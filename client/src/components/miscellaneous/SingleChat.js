import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import {RiSendPlane2Fill} from "react-icons/ri"
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import animationData from "../../animations/typing.json";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { Chatendpoints } from "../../services/apis";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { messageendpoints } from "../../services/apis";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import {AiOutlineCloseCircle} from "react-icons/ai"
import axios from 'axios';
import {IoIosClose} from "react-icons/io"
import OppositeUserProfileModal from "./OppositeUserProfileModal";


const ENDPOINT = "http://localhost:5000"
var socket , selectedChatCompare

console.log("Open ai api key is:",process.env.REACT_APP_OPEN_AI_API_KEY);
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isSend,setIsSend] = useState(false);
  const [typingPersonName , setTypingPersonName] = useState("");
  const [prompt , setPrompt] = useState("");
  const [openAiResponse , setOpenAiresponse] = useState("");
  const [aiLoading , setAiLoading] = useState(false);

  const {SEND_MESSAGE_API,FETCH_MESSAGES_API} =  messageendpoints;
  const { selectedChat, setSelectedChat, user, notification, setNotification } =ChatState();


  const sendGrammarCorrectionRequest = async () => {
    const toastId = toast.loading("Loading..");
    try {
      setOpenAiresponse("");
      if(prompt.length === 0) {
        toast.error("Oops! It looks like you forgot to type a message")
        return;
      }
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You will be provided with statements, and your task is to convert them to standard English.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`, // Replace with your actual API key
          },
        }
      );
  
      const correctedMessage = response.data.choices[0].message.content;
      
      setOpenAiresponse(correctedMessage);
  
      // You can now use the corrected message in your chat app
      // console.log("Open ai api respose is:",response);
      // console.log('User message:', prompt);
      console.log('Corrected message:', correctedMessage);
      console.log('Open ai rmessage is:', openAiResponse);
      console.log("user typped message is :",newMessage);
      // setPrompt("");
  
      // Add the corrected message to your chat UI
      // This is where you can update the state of your chat component
      // and display the corrected message to the user
    } catch (error) {
      console.error('Error sending request to OpenAI API:', error);
      toast.error("error in checking grammar");
      // Handle the error, e.g., show an error message to the user
    }
    toast.dismiss(toastId);
  };

  const sendAiGeneratedMessage = async () => {
    // if(openAiResponse.length === 0 ) {
    //   toast.error("Oops! It looks like there is no ai generated message");
    //   return
    // }
    socket.emit("stop typing" , selectedChat._id);
      if( openAiResponse)
      {
        // console.log("Messages are in : " ,messages);
        // console.log("New message is :",newMessage);
        try {
          const response = await  apiConnector("POST",SEND_MESSAGE_API,
          {
            chatId : selectedChat._id,
            content : openAiResponse,
          },
          {
            Authorization: `Bearer ${user.token}`,
          });
          // console.log("response is : ", response);
          const data = response?.data;
          setNewMessage("");
          setOpenAiresponse("");
          socket.emit("new message" , data);
          setMessages([...messages,data]);
         
        } 
        catch (error) {
          toast.error("error in sending ai message");
          return;  
        }
      }
  }
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if(!selectedChat) return;
        const api = FETCH_MESSAGES_API + `/${selectedChat._id}`
        

        const response = await  apiConnector("GET",api,null,
        {
          Authorization: `Bearer ${user.token}`,
        });
        // console.log("response is : ", response);
        const data =response?.data;
        setMessages(data);
        // console.log("message are : ", data);
        socket.emit("join chat",selectedChat._id);

      } 
      catch (error) {
        console.log("error is :",error);
        toast.error("error in fetching all  message");
        setLoading(false);
        return;  
      }
      setLoading(false);
    } 

    const sendMessage = async (event) => {
      // if(newMessage.length === 0 ) {
      //   toast.error("Oops! It looks like you forgot to type a message");
      //   return
      // }
      socket.emit("stop typing" , selectedChat._id);
        if(event.key === "Enter"  && newMessage)
        {
          // console.log("Messages are in : " ,messages);
          // console.log("New message is :",newMessage);
          try {
            const response = await  apiConnector("POST",SEND_MESSAGE_API,
            {
              chatId : selectedChat._id,
              content : newMessage,
            },
            {
              Authorization: `Bearer ${user.token}`,
            });
            // console.log("response is : ", response);
            const data = response?.data;
            setNewMessage("");
            setOpenAiresponse("");
            socket.emit("new message" , data);
            setMessages([...messages,data]);
           
          } 
          catch (error) {
            toast.error("error in sending message");
            return;  
          }
        }
    } 
    const sendTyppedMessage = async () => {
      socket.emit("stop typing" , selectedChat._id);
      if(newMessage)
      {
        // console.log("Messages are in : " ,messages);
        // console.log("New message is :",newMessage);
        try {
          const response = await  apiConnector("POST",SEND_MESSAGE_API,
          {
            chatId : selectedChat._id,
            content : newMessage,
          },
          {
            Authorization: `Bearer ${user.token}`,
          });
          // console.log("response is : ", response);
          const data = response?.data;
          setNewMessage("");
          setOpenAiresponse("");
          socket.emit("new message" , data);
          setMessages([...messages,data]);
         
        } 
        catch (error) {
          toast.error("error in sending message");
          return;  
        }
      } 
    }
    useEffect(() => {
      // console.log("inside use Effect");
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on("connected" , () => {setSocketConnected(true)} )
      socket.on("typing" , (name) =>{
        console.log("user typing name is :", name);
        setTypingPersonName(name);
        setIsTyping(true)
      })
      
      socket.on("stop typing" , () => setIsTyping(false))
      // const message  = "How is you?";
      // sendGrammarCorrectionRequest(message);
  },[])

    useEffect(() => {
      setOpenAiresponse("");
      setNewMessage("");
      fetchMessages();
      selectedChatCompare = selectedChat;
    },[selectedChat])

 
    // console.log("Messages are : " ,messages);

    useEffect( () => {
      socket.on("message recieved"  , (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
          // give notifications
          if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved,...notification]);
            setFetchAgain(!fetchAgain);
          }
        }
        else{
          setMessages([...messages,newMessageRecieved]);
        }
      })
    })

    // console.log("Notifications : ", notification);

    const typingHandler =  async (e) => {
        setNewMessage(e.target.value);
        setPrompt(e.target.value)
        if(!socketConnected) return ;

        
          // setTyping(true);
          socket.emit("typing" , selectedChat._id,user.name);
        

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength) {
            socket.emit("stop typing", selectedChat._id);
            // setTyping(false);
          }
        }, timerLength);
    }
    

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "15px", md: "25px" }}
            pb={2}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            className="flex justify-between text-[#CCCCCC] "
          >
            <div className="md:hidden block">
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
            </div>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <OppositeUserProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={1}
            bg="#424549"
            w="100%"
            
            h="92%"
            borderRadius="lg"
            overflowY="hidden"
            className="overflow-y-hidden  relative"
          >
            {loading ? (
              <div className="flex justify-center mt-[23%]">
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                  className="border-cyan-300 "
                />
              </div>
            ) : (
                 <div className="messages h-[90%]">
                  <ScrollableChat messages={messages}/>     
                 </div> 
                )
            }


              <div className="w-[83%] md:w-[60%] bottom-[5.5%] fixed">

                <FormControl
                  onKeyDown={sendMessage}
                  id="first-name"
                  isRequired
                  mt={3}
                  
                  // className="relative"
                  
                >
                  {
                    
                    istyping  ? 
                    (
                      <div className="text-[#cecece] text-sm p-1 rounded-md w-fit" >
                      {
                        typingPersonName.length > 7 ? typingPersonName.substring(0,6)  : typingPersonName
                        } is typing....
                      </div>
                    ) : 
                  
                    (
                      <></>
                    )
                  }

                  {
                      openAiResponse.length !== 0 ?

                       (
                           <div className="relative w-[100%]">
                           <IoIosClose 
                           onClick={() => {setOpenAiresponse("")}}
                           className="bg-[#CCCCCC] rounded-full transition-all duration-200 
                           hover:scale-105 cursor-pointer absolute top-[-0.5rem] right-[-0.5%]
                            text-[red] text-lg "/>
                              <textarea
                                  className="rounded-md h-[38px] p-2 items-center 
                                  max-w-[100%] bg-[#36393e] text-[#CCCCCC] " 
                                  name="myTextarea" id="myTextarea" cols="120" rows="2">
                                  {openAiResponse}
                              </textarea>
                               <button className="absolute left-[89%]
                                sm:left-[97%] text-[#CCCCCC] top-[10px]" onClick={sendAiGeneratedMessage}>
                                  <RiSendPlane2Fill/>
                                  
                               </button>
                            </div>                       
                            
                      ) : 
                      (
                        <></>
                      )    
                  }
                    
                    <span className="flex items-center ">
                    <textarea name="" id="" value={newMessage} onChange={typingHandler} placeholder="Enter a message.."
                    className="rounded-md h-[38px] text-[#CCCCCC]  bg-[#36393e]  p-2 items-center max-w-[100%]  " 
                     cols="120" rows="2"/> 
                      {/* <Input
                        variant="filled"
                        // bg="#E0E0E0"
                        bg={"white"}
                        placeholder="Enter a message.."
                        value={newMessage}
                        onChange={typingHandler}
                        
                      /> */}
                       <button className="absolute  right-[4.5rem] lg:right-[5.8rem]
                        text-[#CCCCCC]" onClick={sendTyppedMessage}>
                          <RiSendPlane2Fill/>
                        </button>
                    
                    <button className="bg-[#38B2AC] ml-2 px-1 text-[10px]
                      rounded-md
                      text-white hover:scale-110 transition-all duration-200"
                      onClick={sendGrammarCorrectionRequest}
                      >
                      
                      Verify Grammar</button>
                  </span>
                
                </FormControl>
              </div>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          className={`flex items-center ${selectedChat} ? "hidden" : "flex" md:flex`}
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" textColor={"#CCCCCC"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
