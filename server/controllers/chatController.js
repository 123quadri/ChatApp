const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");


exports.accessChats = async (req,res) => {
    try {
        const {userId} = req.body;
    //    userId = new mongoose.Types.ObjectId(userId);
    console.log("user id is:",userId);
        if(!userId){
            console.log("User id not send with request");
            return res.status(400)
        }

        var isChat = await Chat.find({
            isGroupChat:false,
            $and:[
                {users:{$elemMatch : { $eq:req.user._id } }  },
                {users:{$elemMatch : { $eq:userId } } }
            ],

        })
        .populate("users" , "-password")
        .populate("latestMessage");

        isChat = await User.populate(isChat,{
            path:"latestMessage.sender",
            select : "name pic email",
        });

        if(isChat.length > 0)
        {
            return res.send( isChat[0]);
        }
        else{
            var chatData = {
                chatName : "sender",
                isGroupChat: false,
                users:[req.user._id , userId]
            }
        }

        const createdChat = await Chat.create(chatData);
        
        const FullChat = await Chat.findOne({_id:createdChat._id}).populate("users" , "-password");
        return res.status(200).send(FullChat);         

    } 
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in accessing the chats",
        });
    }
}

exports.fetchChats = async (req,res) =>{
    try {

        let allChats = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})

        allChats = await User.populate(allChats,{
            path:"latestMessage.sender",
            select : "name pic email",
        });

        return res.send(allChats);
    } 
    catch (error) {
        console.log("error is :",error);
        return  res.status(500).json({
            success:false,
            message:"Error in fetching all  the chats",
        });
    }
}

exports.createGroupChat = async (req,res)=>{
    try {
        if(!req.body.users || !req.body.name){
            return res.status(400).send({message:"Please fill all the fields"});
        }

        let users = JSON.parse(req.body.users);

        if(users.length < 2){
            return res.status(400).send("More than two users are required to create a group");
        }

        users.push(req.user);

        const groupChat = await Chat.create({
            chatName:req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin:req.user,
        });

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users" , "-password")
        .populate("groupAdmin","-password");

       return  res.status(200).json(fullGroupChat)

    } 
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in creating group chat",
        });
    }
}

exports.renameGroup = async (req,res) => {
    try {
        const {chatId,chatName} = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(chatId,
            {
                chatName,
            },
            {
                new:true,
            }
        )
        .populate("users" , "-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
           return  res.status(404);
            console.log("Chat not found");
        }

        else{
           return  res.json(updatedChat);
        }
    } 
    catch (error) {
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in renaming the group",
        });
    }
}

exports.addToGroup = async (req,res) => {
    try {
        const {chatId,userId} = req.body;
        
        const added = await Chat.findByIdAndUpdate(chatId, {$push:{users:userId}}  ,{new:true})
        .populate("users" , "-password")
        .populate("groupAdmin","-password");

        if(!added){
            console.log("Chat not found");
            return res.status(400).json({ 
                success:false,
                message:"chat not found"
            })
        }
        else{
           return  res.json(added);
        }

    } catch (error) {
        return  res.status(500).json({
            success:false,
            message:"Error in adding a member to group",
        });
    }
}


exports.removeFromGroup = async (req,res) =>{
    try {
        const {chatId,userId} = req.body;
        
        const removed = await Chat.findByIdAndUpdate(chatId, {$pull:{users:userId}}  ,{new:true})
        .populate("users" , "-password")
        .populate("groupAdmin","-password");

        if(!removed){
            console.log("Chat not found");
           return  res.status(400).json({ 
                success:false,
                message:"chat not found"
            })
        }
        else{
           return  res.json(removed);
        }
 


    } catch (error) {
        return  res.status(500).json({
            success:false,
            message:"Error in removing a member from group",
        });
    }
}