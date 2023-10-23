const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel");

exports.auth = async (req,res,next) => {

    try {
        // console.log("cookie :" ,req.cookies.token);
        // console.log("body :" ,req.body.token);
        const token = req.body.token || req.header("Authorization").replace("Bearer ", "");
        // console.log("token :",token);
        
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            });
        }

        try {
            const payload = jwt.verify(token , process.env.JWT_SECRET);
            // console.log(payload);

            req.user = await User.findById(payload.id).select("-password");
        } 
        catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invalid Token "
            });
        }

        next();
    } 
    catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong , while verifying the token"
        });
        
    }
}