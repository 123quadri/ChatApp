import React from "react";
import { FiSearch } from "react-icons/fi";
import {AiOutlineClose} from "react-icons/ai"
import { IoIosNotifications } from "react-icons/io";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { AiOutlineDown } from "react-icons/ai";
import ChatProvider, { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import toast from "react-hot-toast";
import { Chatendpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import ChatLoading from "./ChatLoading";
import UserListItem from "./userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  // console.log("User is:",user);

  const { SEARCH_USER_API, ACCESS_CHAT_API } = Chatendpoints;
  const api = SEARCH_USER_API + `search=${search}`;
  // console.log("api is:",api);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.clear();
    navigate("/");
  };

  // const {user} = ChatState();
  // console.log(user);
  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
      toast.error("Enter something in seaarch");
      setLoading(false);
      return;
    }

    try {
      const response = await apiConnector("GET", api, null, {
        Authorization: `Bearer ${user.token}`,
      });
      //   console.log("response is:",response);
      const data = response?.data;

      setSearchResult(data);
    } catch (error) {
      console.log("erroe is :", error);
      toast.error("error in search");
      return;
    }
    setLoading(false);
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const response = await apiConnector(
        "POST",
        ACCESS_CHAT_API,
        { userId },
        {
          Authorization: `Bearer ${user.token}`,
        }
      );
      //   console.log("Response is :",response?.data);
      const data = response?.data;

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log("erroe is :", error);
      toast.error("error in fetching chat");
      return;
    }
    setLoadingChat(false);
  };

  return (

    // <div className="bg-[grey] w-[115%] sm:w-[100%]  flex flex-row justify-between px-4 py-2  items-center">
    <>
    <Box
    d="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="#282b30"
    w="100%"
    p="5px 10px 5px 10px"
    // borderWidth="5px"
    className="flex flex-row justify-between"
  >

      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <FiSearch className="text-xl sm:text-2xl text-[#CCCCCC] hover:text-black" fontSize={"40px"} />
          {/* <i className="fas fa-search"></i> */}
          <Text
            className="sm:block hidden text-[#CCCCCC] hover:text-black"
            d={{ base: "none", md: "flex" }}
            px={4}
          >
            Search User
          </Text>
        </Button>
      </Tooltip>


        <Text fontSize="2xl" fontFamily="Work sans" className="text-[#CCCCCC]">
          Chatify
        </Text>

      <div className="flex flex-row justify-between items-center gap-x-4">
        {/* <div></div> */}
        {/* <div>pic</div> */}
        <Menu>
          <MenuButton className="relative">
            <span
              className=" absolute top-[-5px] right-[-3px] bg-[red] w-[20px] h-[20px] 
                flex justify-center items-center  
                 rounded-full text-white text-sm"
            >
              {notification.length}
            </span>
            <IoIosNotifications className="text-white" fontSize={30} />
          </MenuButton>
          <MenuList pl={2}>
            {notification.length === 0
              ? "No new Notifications"
              : notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? ` New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
         
            as={Button}
            rightIcon={<AiOutlineDown  fontSize={25} fontWeight={25} />}
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user?.name}
              src={user?.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal  user={user}>
              <MenuItem> My Profile</MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </ProfileModal>
          </MenuList>
        </Menu>

        {/* <div ><AiOutlineDown fontSize={25} fontWeight={25}/></div> */}
      </div>
    </Box>

      <Drawer  placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center" borderBottomWidth="1px">
          Search Users <span className="cursor-pointer" onClick={onClose}><AiOutlineClose/></span></DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2} className="flex flex-row">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult.length > 0 ? (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <div>No Result Found</div>
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </>
  );
};

export default SideDrawer;
