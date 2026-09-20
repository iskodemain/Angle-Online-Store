import React, { useContext } from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Cart from './pages/Cart.jsx'
import Product from './pages/Product.jsx'
import Login from './pages/Login.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Orders from './pages/Orders.jsx'
import { ToastContainer} from 'react-toastify';
import { ShopContext } from "./context/ShopContext.jsx";
// COMPONENTS
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import ForgotPassword from './components/ForgotPassword.jsx';
// TEMPORARY: OTP routes disabled — re-enable when nodemailer works
// import VerifyCode from './components/VerifyCode.jsx';
// import ResetPassword from './components/ResetPassword.jsx';
// import AccountVerifyCode from './components/AccountVerifyCode.jsx'
// CSS
import './App.css'
// ICON
import { IoIosArrowUp } from "react-icons/io";

const App = () => {
  // TEMPORARY: emailVerification, code, emailAccountCreate unused while OTP is disabled
  // Re-enable destructuring when nodemailer works: const {emailVerification, code, isLoading, emailAccountCreate} = useContext(ShopContext);
  const { isLoading } = useContext(ShopContext);
  

  if (isLoading) {
    return <div className="loader"></div>
  }
  
  return(
    <div className="App">
      <button onClick={()=> window.scrollTo(0, 0)} className="up-scroll"><IoIosArrowUp className="arrow"/></button>
      <ToastContainer/>
      <Navbar/>
      <SearchBar/>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/place-order" element={<PlaceOrder/>}/>
        <Route path="/orders" element={<Orders/>}/>
        {/* VERIFICATION CREATE ACCOUNT — TEMPORARY: disabled, re-enable when nodemailer works */}
        {/* <Route path="/account-verification" element={emailAccountCreate ? <AccountVerifyCode/> : <Navigate to="/login" replace/>}/> */}
        {/* VERIFICATION FORGOT PASSWORD — TEMPORARY: disabled, re-enable when nodemailer works */}
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        {/* <Route path="/verify-code" element={emailVerification ?  <VerifyCode /> : <Navigate to="/forgot-password" replace/>}/> */}
        {/* <Route path="/reset-password" element={emailVerification ? <ResetPassword /> : <Navigate to="/forgot-password" replace/>}/> */}
      </Routes>
    </div>
)
}
export default App;