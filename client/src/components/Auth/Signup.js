import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {AiOutlineEye} from "react-icons/ai"
import {AiOutlineEyeInvisible} from  "react-icons/ai"
import { useNavigate } from 'react-router-dom';
import signUp from '../../services/operations/auth';
import { ChatState } from '../../Context/ChatProvider'



const Signup = () => {
  const {user,setUser} = ChatState();
  const[showPassword , setShowpassword] = useState(false);
  const [confirmPassword , setConfirmPassword] = useState(false);
  const[SignUpformData , setLoginFormData] = useState({name:"",email:"",password:"",confirmPassword:""});
// const [userPic,setUserPic] = useState(null);
  const navigate = useNavigate();

  // let formData = new FormData();
  // const [formData, setFormData] = useState(new FormData());

  function changeHandler(event){
    const{name,value,checked,type} = event.target;
    setLoginFormData( (prevformData) => {
      return {
        ...prevformData,
        [name]: type ==="checkbox" ? checked : value
      };
    });
  }

  // function userPicChangeHandler(event){
  //   const file = event.target.files[0];
  //   // formData.append('userPic', file);
  //   console.log("file is:",file);
  //   // console.log("formData:", formData);
  //   // console.log("File is1 :",formData.get("userPic"));
  //   setUserPic(file);
  //   console.log("userPic is:",userPic);
  // }

  
  // useEffect(() =>{
  //   console.log("userPic is:",userPic);
  // },[userPic])


 async  function submitHandler(event){
    event.preventDefault();
    if(SignUpformData.password !== SignUpformData.confirmPassword){
       toast.error("password and confirm passwors should match");
       return;
    }
    try {
      
      // console.log("userPic is :", userPic);
      // const formData = new FormData();
      // formData.append("userPic", userPic);
      // console.log("File is1 :",formData.get("userPic"));
      

      const data = await signUp(SignUpformData.name , 
        SignUpformData.email, SignUpformData.password,SignUpformData.confirmPassword,navigate);
        setUser(data);
        // console.log("data in signup form is :",data);
        // localStorage.setItem("userInfo",JSON.stringify(data));
        
    } 
    catch (error) {
      toast.error("error in signing up");
    }
    
    // console.log("printing Lofion form  data");
    // console.log(LoginformData);
  }

  return (
    <div className='bg-[#282b30] rounded-md px-6 py-4 w-[90%] md:w-[40%] flex flex-col gap-y-4'>
    <form onSubmit={submitHandler} className='bg-[#282b30] rounded-md px-2 py-4 w-[100%] 
    flex flex-col gap-y-4' encType="multipart/form-data " >

      <div className='flex flex-col gap-2 text-[#CCCCCC]'>
        <label htmlFor="name"> Name 
        <sup className="ml-1 text-[red]">*</sup> </label>
        <input
          onChange={changeHandler}
          className='border border-[#36393e] bg-[#424549] p-1 rounded-md  ' 
          type="text"  
          id='name' 
          placeholder='Enter Your Name'
          name='name'
          value={SignUpformData.name}
          />
      </div>
      
      <div className='flex flex-col gap-2 text-[#CCCCCC]'>
      <label htmlFor="email"> Email address 
      <sup className="ml-1 text-[red]">*</sup> </label>
        <input 
        onChange={changeHandler}
        className='border border-[#36393e] bg-[#424549] p-1 rounded-md ' 
          type="email"  
          id='email' 
          placeholder='Enter Your Email Address'
          name='email'
          value={SignUpformData.email}  
          />
      </div>

      <div className='flex flex-col gap-2 relative text-[#CCCCCC]'>
      <label htmlFor="password"> Password 
      <sup className="ml-1 text-[red]">*</sup> </label>
        <input 
        onChange={changeHandler}
        className='border border-[#36393e] bg-[#424549] p-1 rounded-md ' 
          type={showPassword ? "text" : "password"}  
          id='password' 
          placeholder='Enter password'
            name='password'
            value={SignUpformData.password}
          />
          <div className='absolute right-1 top-10' onClick={() =>(setShowpassword((prev) => !prev ))}>
            {
              showPassword ? (<AiOutlineEyeInvisible fontSize={20}/>) : (<AiOutlineEye fontSize={20} />)
            }
                  
          </div>          
      </div>

      <div className='flex flex-col gap-2 relative text-[#CCCCCC]'>
        <label htmlFor="confirmPassword">Comfirm Password 
        <sup className="ml-1 text-[red]">*</sup> </label>
          <input 
          onChange={changeHandler}
          className='border border-[#36393e] bg-[#424549] p-1 rounded-md ' 
            type={confirmPassword ? "text" : "password"}  
            id='confirmPassword' 
            placeholder='Confirm password'
             name='confirmPassword'
             value={SignUpformData.confirmPassword} 
            />

          <div className='absolute right-1 top-10' onClick={() =>(setConfirmPassword((prev) => !prev ))}>
            {
              confirmPassword ? (<AiOutlineEyeInvisible fontSize={20}/>) : (<AiOutlineEye fontSize={20} />)
            }
                  
          </div>
      </div>

   
      <button className='px-2 py-2 rounded-md w-full bg-[#7289da] text-white'>Sign Up</button>
    </form>
    {/* <div className='flex flex-col gap-2'>
        <label htmlFor="picture">Upload Your picture<sup>*</sup> </label>
          <input 
            name='userPic'
            onChange={userPicChangeHandler}
            type="file"  
            id='picture' 
            accept="image/png, image/gif, image/jpeg"
            />
      </div> */}
    </div>
  )
}

export default Signup