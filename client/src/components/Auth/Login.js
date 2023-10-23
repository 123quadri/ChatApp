import React, { useState } from 'react'
import {AiOutlineEye} from "react-icons/ai"
import {AiOutlineEyeInvisible} from  "react-icons/ai"
import { login } from '../../services/operations/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChatState } from '../../Context/ChatProvider'



const Login = () => {
  const {user,setUser} = ChatState();
    const[showPassword, setShowpassword] = useState(false);
    const[LoginformData , setLoginFormData] = useState({email:"",password:""});
    const navigate = useNavigate();

    function changeHandler(event){
     
      const{name,value,checked,type} = event.target;
      setLoginFormData( (prevformData) => {
        return {
          ...prevformData,
          [name]: type ==="checkbox" ? checked : value
        };
      });
    }

   async function submitHandler(event){
      event.preventDefault();
      try {
        if(!LoginformData.email || !LoginformData.password){
          toast.error("All fiels are required");
          return;
        }
        const data = await login(LoginformData.email,LoginformData.password,navigate);
        setUser(data);
        // console.log("User data is :",user);
        // console.log("data in Login is:", data);
        // localStorage.setItem("userInfo",JSON.stringify(data));
        
      } 
      catch (error) {
        console.log("Error is ",error);
        toast.error("Error in login");
        return;
      }
     
    }
  return (
    <>
    <form onSubmit={submitHandler}
    className=' rounded-md px-4 py-6 w-[90%] h-[40%] bg-[#282b30] md:w-[40%] flex flex-col gap-y-6'
    >
      <div className='bg-[#282b30] rounded-md px-6 py-4 w-[100%] flex flex-col gap-y-6'>
      <div className='flex flex-col gap-y-3 '>
            <label htmlFor="email" className='text-[#CCCCCC]'> Email Address 
            <sup className="ml-1 text-[red]">*</sup></label>
              <input className='border border-[#36393e] bg-[#424549] p-1 rounded-md '
               type="email" 
               placeholder='Enter email' 
               id='email'
               name='email'
               value={LoginformData.email}
               onChange={changeHandler} />

               <div className='relative flex flex-col text-[#CCCCCC]'>
                  <label htmlFor="password">Password 
                  <sup className="ml-1 text-[red]">*</sup> </label>
                  <input
                  className='border relative border-[#36393e] bg-[#424549] p-1 rounded-md mt-1'
                  type={showPassword ? "text" : "password"} 
                  placeholder='enter password'
                  id='password' 
                  name='password'
                  value={LoginformData.password}
                  onChange={changeHandler}
                  autoComplete='off'
                   />
                  <div className='absolute right-1 top-9' onClick={() =>(
                    setShowpassword((prev) => !prev )
                  )}>
                  {
                    showPassword ? (<AiOutlineEyeInvisible fontSize={20}/>) : (<AiOutlineEye fontSize={20}/>)
                  }
                  
                  </div>
               </div>
          </div>

          <div className='flex flex-col gap-2'>
            <button className='px-2 py-2 rounded-md w-full bg-[#7289da] text-white'>Login</button>
            {/* <button className='px-2 py-2 rounded-md w-full bg-red-400'
            onClick={() =>{
              setLoginFormData(() => {
                return {
                  email:"guest@example.com",
                  passwordf:"123456"
                }
              })
            }}
            >
            Get gest user credentials</button> */}
          </div>
      </div>
    </form>
          
    </>
  )
}

export default Login