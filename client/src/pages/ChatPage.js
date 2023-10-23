import React, { useEffect, useState } from 'react'
import ChatBox from '../components/miscellaneous/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';
import MyChats from '../components/miscellaneous/MyChats';
import { Box } from "@chakra-ui/layout";


const ChatPage = () => {
    const {user} = ChatState();
    const[fetchAgain,setFetchAgain] = useState(false);
    // console.log("user is:",user);
  return (
    <>


    
    
      {user && <SideDrawer/>}

      <Box d="flex" className='flex w-screen justify-between '   h="91.5vh" p="10px" >
        {user && <MyChats  fetchAgain={fetchAgain}  />}
        {user && (
          
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        )}
      </Box>

      </>

   
  )
}

export default ChatPage