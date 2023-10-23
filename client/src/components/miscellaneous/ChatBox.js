import React from 'react'
import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from '../../Context/ChatProvider'; 


  

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (

            <Box
            d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="#36393e"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={"#282b30"}
            className={` ${selectedChat ? "flex" : "hidden"} md:flex `}
          >

          
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />


          </Box> 


  
  )
}

export default ChatBox