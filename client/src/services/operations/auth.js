import { apiConnector } from "../apiConnector";
import { authendpoints } from "../apis";
import { toast } from "react-hot-toast"


const {
    SIGNUP_API,
    LOGIN_API,
   
  } = authendpoints

export default  async function signUp( name,email,password,confirmPassword,navigate) {
  
      const toastId = toast.loading("Loading...");
      let data;
      try {
        // console.log("form data in auth is:",formData.get("userPic"));
        const response = await apiConnector("POST", SIGNUP_API,{ 
          name,
          email,
          password,
          confirmPassword,
        }
      )
  
        console.log("SIGNUP API RESPONSE............", response)
        data = response?.data;
        console.log("data is:",data);
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        localStorage.setItem("userInfo",JSON.stringify(data));
        toast.success("Signup Successful")

        navigate("/chats");
        // navigate("/chats")
      } catch (error) {
        // console.log("SIGNUP API ERROR............", error)
        toast.error("Signup Failed")
        navigate("/")
      }
    
      toast.dismiss(toastId)
      return data;
    
  }

  
  export async function login(email, password, navigate) {
    
        let data;
      const toastId = toast.loading("Loading...")
     
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        })
  
        // console.log("LOGIN API RESPONSE............", response)
        data = response?.data;
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        localStorage.setItem("userInfo",JSON.stringify(data));
        toast.success("Login Successful");
       
       
        navigate("/chats");
      
      } catch (error) {
        // console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed");
        navigate("/");
      }
      
      toast.dismiss(toastId)
      return data;
    
  }