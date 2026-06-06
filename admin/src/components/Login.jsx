import React, {useContext, useState}from 'react'
import './Login.css'
import axios from 'axios'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { backendURL } from '../App';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';


const Login = ({setToken}) => {
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [passwordType, setPasswordType] = useState('password')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const {toastSuccess, toastError} = useContext(ShopContext)

    const onSubmitHandler = async(event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await axios.post(backendURL + '/api/user/admin', {email, password})
        if (response.data.success) {
          setToken(response.data.token)
          toast.success(response.data.message, {...toastSuccess});
        } else {
          toast.error(response.data.message, {...toastError});
        }
      } catch(error) {
        console.log(error);
        toast.error(error.message, {...toastError});
      } finally {
        setLoading(false);
      }
    }
    

    const togglePassword = () => {
      setPasswordType((prevPasswordType) => 
        prevPasswordType === 'password' ? 'text' : 'password'
      );
    };
  
    return (
      
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] GGG'>
        <form onSubmit={onSubmitHandler} action="" className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20 gap-4 text-gray-800 kengkoy'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10 '>
            <p className='cs-text'>Admin Panel</p>
          </div>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 input-account-page' placeholder='Email' required/>
          <div className={`w-full px-3 py-2 pass-tainer ${isPasswordFocused ? 'focused' : ''}`} onClick={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} tabIndex={-1}>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type={passwordType} placeholder='Password' required onBlur={() => setIsPasswordFocused(false)}/>
            <div onClick={togglePassword} className='showHidePass'>
              {passwordType === 'password' ? <IoIosEyeOff /> : <IoIosEye />}
            </div>
          </div>
          <button type='submit' className='LC-button' disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {loading && <div className="loaderCA"></div>}
        </form>
      </div>
    )
  }
  
  export default Login
