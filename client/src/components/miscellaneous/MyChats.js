import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
// import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import toast from "react-hot-toast";
import { Chatendpoints } from '../../services/apis';
import { apiConnector } from '../../services/apiConnector';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const {FETCH_CHAT_API} = Chatendpoints;



  const fetchChats = async () => {
    // console.log(user._id);
    try {
      
      const response = await apiConnector("GET",FETCH_CHAT_API,null,{
        Authorization: `Bearer ${user.token}`,
      });
      const data = response?.data;
      // 
      setChats(data);

    } catch (error) {
      toast.error("failed to load the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // return (
  //   <div>
  //     hello
  //   </div>
  // )

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#36393e"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={"#282b30"}
      className={`md:w-[31%] w-[100%] overflow-hidden ${selectedChat ?  "hidden" : "flex"} md:flex `} 
    >
      <Box
        pb={3}
        px={3} 
        // bg={"#424549"}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        className=" flex flex-col md:flex-row justify-between"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        textColor={"#CCCCCC"}
      >
        My Chats
        <GroupChatModal>
          <Button
          bg={"#7289da"}
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#36393e"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                className="hover:bg-[#38B2AC] transition-all duration-200 hover:text-[white]" 
              >
                <Text className="text-lg font-semibold ">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;