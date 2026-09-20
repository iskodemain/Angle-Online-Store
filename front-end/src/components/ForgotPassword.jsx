import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import axios from 'axios'
import { toast } from "react-toastify";
import OurPolicy from '../components/OurPolicy.jsx'
import Infos from '../components/Infos.jsx'
import Footer from '../components/Footer.jsx'
import './ForgotPassword.css'
import './ResetPassword.css'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const ForgotPassword = () => {
  const { toastSuccess, toastError, navigate, backendUrl } = useContext(ShopContext);

  // Step 1: email verification
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Step 2: new password
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [loadingReset, setLoadingReset] = useState(false);

  // STEP 1 — check if email exists
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.", { ...toastError });
      return;
    }
    setLoadingEmail(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password/verify-email', { email });
      if (response.data.success) {
        setEmailVerified(true);
        toast.success("Email verified. Please enter your new password.", { ...toastSuccess });
      } else {
        toast.error(response.data.message, { ...toastError });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, { ...toastError });
    } finally {
      setLoadingEmail(false);
    }
  };

  // STEP 2 — reset password
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (!newPassword) {
      toast.error("Please enter your new password.", { ...toastError });
      return;
    }
    setLoadingReset(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password/reset-password', { email, newPassword });
      if (response.data.success) {
        toast.success(response.data.message, { ...toastSuccess });
        navigate('/login');
      } else {
        toast.error(response.data.message, { ...toastError });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, { ...toastError });
    } finally {
      setLoadingReset(false);
    }
  };

  const togglePassword = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] upthis-f'>

      {/* STEP 1 — Email check */}
      {!emailVerified && (
        <form onSubmit={handleEmailSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-3 mt-10'>
            <p className='em-text'>Forgot Password</p>
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className='w-full px-3 py-2 input-email-page'
            placeholder='Enter your Email Address'
            required
          />
          <button type='submit' className='SVC-button' disabled={loadingEmail}>
            {loadingEmail ? 'Checking...' : 'Continue'}
          </button>
          {loadingEmail && <div className="loaderFP"></div>}
        </form>
      )}

      {/* STEP 2 — New password form (shown only after email is verified) */}
      {emailVerified && (
        <form onSubmit={handlePasswordReset} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='items-center mt-10 rp-container'>
            <p className='em-text'>Choose New Password</p>
            <p className='rp-textsm'>Choose a new strong password for: <span className='valid-email'>{email}</span></p>
          </div>

          <div
            className={`w-full px-3 py-2 input-password-page ${isPasswordFocused ? 'focused' : ''}`}
            onClick={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            tabIndex={-1}
          >
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={passwordType}
              placeholder='Enter New Password (at least 8 characters)'
              onBlur={() => setIsPasswordFocused(false)}
              required
            />
            <div onClick={togglePassword} className='showHidePassC'>
              {passwordType === 'password' ? <IoIosEyeOff /> : <IoIosEye />}
            </div>
          </div>

          <div className='required-container'>
            <p className='ntrp-text'>Minimum of 8 characters and includes the following:</p>
            <p className='required-rp'>
              • Include at least one uppercase letter (A-Z) <br />
              • Include at least one lowercase letter (a-z) <br />
              • Include at least one number (0-9) <br />
              • Include at least one special character (e.g., !, @, #, $)
            </p>
          </div>

          <button type='submit' className='SVC-button' disabled={loadingReset}>
            {loadingReset ? 'Resetting...' : 'Reset Password'}
          </button>
          {loadingReset && <div className="loaderFP"></div>}
        </form>
      )}

      <OurPolicy />
      <Infos />
      <Footer />
    </div>
  );
};

export default ForgotPassword;
