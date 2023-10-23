import React, { useEffect, useState } from 'react'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'
import { useNavigate } from 'react-router-dom'


const Home = () => {

  // const navigate = useNavigate();
  
  // useEffect(() =>{
  //   let user = localStorage.getItem("userInfo") ? localStorage.getItem("userInfo") : (null);
    
  //   if (user !== "undefined") {
  //     // If there's a stored user info, parse it as JSON
  //     console.log("user is :", user);
  //     const user = JSON.parse(user);
  //   }
  //   else{
  //       navigate("/")
  //   }
    
  //   // const user = JSON.parse(localStorage.getItem("userInfo"));

  //   // if(user){
  //   //   navigate("/chats");
  //   // }
  //   // else{
  //   //   navigate("/")
  //   // }
  // },[navigate])

  const[formType,setFormtype] = useState("SignUp");

  return (
    
    <div className='flex flex-col gap-6 w-[100%]  mx-auto items-center h-[100vh] justify-center  '>
        {/* <div className=' px-6 py-4 w-[70%] bg-[#36393e]  md:w-[40%]'>
          <h1 className='font-semibold text-xl text-[#7289da] text-center'>Chatify</h1>
        </div> */}

        <div className=' px-6 py-4 w-[80%] md:w-[30%] flex flex-col gap-y-4  '>
          <div className='flex flex-row gap-x-10 justify-evenly'>
            <button onClick={() => setFormtype("Login")}
             className={`${formType === "Login" ? "bg-[#7289da] text-white" : "bg-[white]"} 
             px-2 py-2 rounded-md w-[50%] transition-all duration-200`} >
             Login</button>
            <button onClick={() => setFormtype("SignUp")} 
            className= {`${formType === "SignUp" ? "bg-[#7289da] text-white" : "bg-[white]"}
             px-2 py-2 rounded-md  w-[50%] transition-all duration-200 `}>
            SignUp</button>
          </div>
        </div>
        {
          formType === "SignUp" ? (<Signup/>) : (<Login/>  )
        }
        
    </div>
  )
}

export default Home