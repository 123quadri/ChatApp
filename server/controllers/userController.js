const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateToken");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


exports.signup = async (req,res) => {
    try {

        const {name,email,password,confirmPassword} = req.body;
    
        if(!name || !password || !email || !confirmPassword){
            return res.status(403).json({
                success:false,
                message:"All fiels are compulsary",
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                 success:false,
                 message:"Password and ConfirmPassword do not match",
             });
         }

         const existingUser = await User.findOne({email});

         if(existingUser){
             return res.status(400).json({
                 success:false,
                 message:"User is already registered",
             });
         }

         const hashedPassword = await bcrypt.hash(password,10);

         const user = await  User.create({
            name,
            email,
            password:hashedPassword,
            pic : `https://api.dicebear.com/5.x/initials/svg?seed=${name} ${name}`
         });

         
         
         if(user){
            return res.status(200).json({
                success:true,
                _id:user._id,
                name : user.name,
                email:user.email,
                token : generateToken(user._id),
                pic:user.pic
            })
         }
         else
         {
            return  res.status(400).json({
                success:false,
                message:"User was not registered",
            });
         }


    } 
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"User cannot be registerted please try again",
        });
    }
}


exports.login = async (req,res) => {
    try{

        const { email , password } = req.body;

        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            });
        }

        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered , please register first"
            });
        }

      

        if(await bcrypt.compare(password , user.password)){
                res.status(200).json({
                    success:true,
                    _id:user._id,
                    name : user.name,
                    email:user.email,
                    token : generateToken(user._id),
                    pic:user.pic,
                    message:"User logged in successfully" 
                });
        }

        else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            });
        }

    }

    catch(error){
        // console.log(error);
        return res.status(500).json({
            success: false,
            message : "Login failure , please tryn again"
        });

    }
}

exports.allUsers = async (req,res) => {
    try {
        
        const keyword = req.query.search ? {
            $or : [
                {name : {$regex : req.query.search,$options :"i" }},
                {email : {$regex : req.query.search,$options :"i" }}
            ]
        } :
        {}

        const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
        res.send(users);
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error in searching users"
        });

    }
}

exports.updateDisplayPicture = async (req,res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user._id
        // console.log("In backend and data is:",userId);
        const image = await uploadImageToCloudinary(
          displayPicture,
          process.env.FOLDER_NAME,
          1000,
          1000
        )
        // console.log("Image  is:",image)
        const updatedProfile = await User.findByIdAndUpdate(
          { _id: userId },
          { pic: image.secure_url },
          { new: true }
        )
        res.send({
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}