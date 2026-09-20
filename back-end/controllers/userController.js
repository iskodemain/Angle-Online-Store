import bcryptjs from 'bcryptjs' 
import validator from 'validator'
import jwt from 'jsonwebtoken'
import Customer from '../models/customers.js'
// TEMPORARY: nodemailer disabled — re-enable when OTP is restored
// import nodemailer from 'nodemailer'

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// TEMPORARY: Nodemailer transporter disabled (unavailable on Render)
// Re-enable by uncommenting below when nodemailer is working
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.AOS_EMAIL,
//       pass: process.env.AOS_PASSWORD,
//     },
// });


// Verify Email Route — TEMPORARY: only checks if email exists, OTP sending disabled
// Re-enable full OTP flow by uncommenting the sendMail block below
const verifyEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Customer.findOne({ where: { email } });
      if (!user) {
        return res.json({ success: false, message: 'Email does not exist.' });
      }

      // TEMPORARY: OTP email disabled (nodemailer unavailable on Render)
      // Re-enable by uncommenting the block below
      // const verificationCode = generateVerificationCode();
      // const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
      // await transporter.sendMail({ ... });
      // await user.update({ verification_code: verificationCode, verification_code_expires_at: expirationTime });
      // return res.json({ success: true, message: 'Verification code sent!' });

      return res.json({ success: true, message: 'Email verified.' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error verifying email.' });
    }
};

const verifyCode = async (req, res) => {
    try {
      const { email, code } = req.body;
      const user = await Customer.findOne({ where: { email } });

      if (!user) {
        return res.json({ success: false, message: 'Email address not found. Please try again.' });
      }
  
      if (user.verification_code !== code) {
        return res.json({ success: false, message: 'Invalid verification code.', });
      }

      if (new Date() > user.verification_code_expires_at) {
        await user.update({ verification_code: null});
        return res.json({ success: false, message: 'Verification code has expired. Please request a new one.'});
        
      }

      res.json({ success: true, message: 'Code verified successfully!' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error verifying code.' });
    }
};

const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await Customer.findOne({ where: { email } });
  
      if (!user) {
        return res.json({ success: false, message: 'Invalid email. Please try again.' });
      }

      // TEMPORARY: OTP check disabled (nodemailer unavailable on Render)
      // Re-enable by uncommenting the block below
      // if (!user || user.verification_code !== code) {
      //   return res.json({ success: false, message: 'Invalid verification code or email. Please try again.' });
      // }
      // if (new Date() > user.verification_code_expires_at) {
      //   await user.update({ verification_code: null});
      //   return res.json({ success: false, message: 'Verification code has expired. Please request a new one.'});
      // }

      // PASSWORD VALIDATION
      if (!validator.isLength(newPassword, { min: 8 })) {
        return res.json({success: false, message:"Password must be at least 8 characters long"});
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res.json({success: false, message:"Password must contain at least one uppercase letter."});
      }
      if (!/[a-z]/.test(newPassword)) {
        return res.json({success: false, message:"Password must contain at least one lowercase letter."});
      }
      if (!/[0-9]/.test(newPassword)) {
        return res.json({success: false, message:"Password must contain at least one number."});
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.json({success: false, message:"Password must contain at least one special character (e.g., !, @, #, $, etc.)."});
      }

      // HASHING USER PASSWORD
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);

      await user.update({ password: hashedPassword, verification_code: null, verification_code_expires_at: null,}); 
  
      res.json({ success: true, message: 'Password updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error resetting password.' });
    }
};



//  ROUTE FOR USER LOGIN
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Customer.findOne({where: {email}});
        if (!user) {
            return res.json({success: false, message:"This user does not exist."});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user.customer_id);
            return res.json({success: true, message: "Login Succesfully", token});
        }
        else {
            return res.json({success: false, message:"Invalid Credentials"});
        }


    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
    }
}

// ROUTE FOR ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({success: true, token, message: "Successfully Login"})
        } else {
            res.json({success: false, message: "Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
    }
}


// REGISTRATION
let tempUserData = {};
const registerUser = async (req, res) => {
    try {
        const { user_name, email, password } = req.body;

        // Check if user already exists
        const exists = await Customer.findOne({ where: { email } });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // PASSWORD VALIDATION
        if (!validator.isLength(password, { min: 8 })) {
            return res.json({success: false, message:"Password must be at least 8 characters long"});
        }
        if (!/[A-Z]/.test(password)) {
            return res.json({success: false, message:"Password must contain at least one uppercase letter."});
        }
        if (!/[a-z]/.test(password)) {
            return res.json({success: false, message:"Password must contain at least one lowercase letter."});
        }
        if (!/[0-9]/.test(password)) {
            return res.json({success: false, message:"Password must contain at least one number."});
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.json({success: false, message:"Password must contain at least one special character (e.g., !, @, #, $, etc.)."});
        }

        // TEMPORARY: OTP email verification disabled (nodemailer unavailable on Render)
        // Re-enable by uncommenting the OTP block below and commenting out the direct registration block

        // --- DIRECT REGISTRATION (no OTP) ---
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await Customer.create({ user_name, email, password: hashedPassword });
        const token = createToken(newUser.customer_id);
        return res.json({ success: true, message: "Account created successfully.", token });
        // --- END DIRECT REGISTRATION ---

        // --- OTP REGISTRATION (re-enable when nodemailer is working) ---
        // const verificationCode = generateVerificationCode();
        // tempUserData[email] = {
        //     user_name, email, password,
        //     verificationCode,
        //     expiresAt: Date.now() + 15 * 60 * 1000,
        // };
        // await transporter.sendMail({ ... });
        // res.json({ success: true, message: "Verification code sent to your email." });
        // --- END OTP REGISTRATION ---

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error during registration.' });
    }
};

const verifyAndCreateUser = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Check if the email exists in temp storage
        const userData = tempUserData[email];
        if (!userData) {
            return res.json({ success: false, message: "Verification expired or not initiated." });
        }

        // Validate the code
        if (userData.verificationCode !== code) {
            return res.json({ success: false, message: "Invalid verification code." });
        }

        if (Date.now() > userData.expiresAt) {
            delete tempUserData[email]; // Remove expired data
            return res.json({ success: false, message: "Verification code expired. Please register again." });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(userData.password, salt);

        // Save user in the database
        const newUser = await Customer.create({
            user_name: userData.user_name,
            email: userData.email,
            password: hashedPassword,
        });

        const token = createToken(newUser.customer_id);

        // Clean up temp data
        delete tempUserData[email];

        res.json({
            success: true,
            message: "Account created successfully.",
            token,
            user: {
                customer_id: newUser.customer_id,
                user_name: newUser.user_name,
                email: newUser.email,
                password: newUser.password,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error during account creation.' });
    }
};





export {loginUser, registerUser, adminLogin, verifyEmail, verifyCode, resetPassword, verifyAndCreateUser}