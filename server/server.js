const express = require("express");
const app = express();
const cors = require("cors");
const fileupload = require("express-fileupload");
const dbConnect = require("./config/database");
const cloudinary = require("./config/cloudinary");

require("dotenv").config();

app.use(express.json());
const PORT = parseInt(process.env.PORT) || 5000 ;

app.use(fileupload({
    useTempFiles:true,
    tempFileDir: "/tmp/"
}));

app.use(
    cors({
        origin:"*",
        credentials:true,
    })
);

dbConnect();
cloudinary.cloudinaryConnect();

app.get("/" , (req , res) => {
    return res.json({
        success:true,
        message:"Your server is up and running",
    });
});


const userRoutes =  require("./routes/userRoutes");
app.use("/api/v1/auth" , userRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/v1/chat" , chatRoutes);

const messageRoutes = require("./routes/messageroutes");
app.use("/api/v1/message" , messageRoutes);

const server = app.listen(PORT , () => {
    console.log(`Server started at port ${PORT}`);
});

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors:{
        origin:"*"
    },
});
io.on("connection" , (socket) => {
    // console.log("connected to socket.io");

    socket.on("setup" , (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat" , (room) =>{
        socket.join(room);
        // console.log("user joined room :", room);
    })

    socket.on("typing" , (room,name) => {

        socket.in(room).emit("typing",name);
        // console.log("In typing by : ", name);
    })
        
    
    
    socket.on("stop typing" , (room) => {
        socket.in(room).emit("stop typing");
        // console.log("In stop Typing");
    });
    
    socket.on("new message" , (newMessageRecieved) => {
        // console.log("new mesage is : ", newMessageRecieved);
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat users not defined");

        chat.users.forEach((user) => {
            if(user._id === newMessageRecieved.sender._id) return ;
            socket.in(user._id).emit("message recieved" , newMessageRecieved);
        })
    })

    socket.off("setup", () => {
        // console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
});