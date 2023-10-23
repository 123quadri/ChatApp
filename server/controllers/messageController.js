const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");


exports.sendMessage = async (req,res) => {
    try {
        const {content,chatId} = req.body;

        if(!content || !chatId){
            console.log("Invalid Data or missing data");
            return  res.status(400).json({
            success:false,
            message:"Invalid Data or missing data",
            });    
        }

        let newMessage = {
            sender : req.user._id,
            content  : content,
            chat : chatId
        }

        let message  = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message , {
            path:"chat.users",
            select : "name pic email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId , {
            latestMessage : message._id,
        });

        return res.json(message);
    } 
    
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in sending message",
        });    
    }
}

exports.allMessages = async (req,res) => {
    try {
       
        const message = await Message.find({chat : req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat");

        return res.json(message);
    } 
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in Fetching all messages",
        });   
    }
}