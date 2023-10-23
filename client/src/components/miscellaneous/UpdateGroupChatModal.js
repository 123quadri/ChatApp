import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./userAvatar/UserBadgeItem";
import UserListItem from "./userAvatar/UserListItem";
import toast from "react-hot-toast";
import { Chatendpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const {ACCESS_CHAT_API,FETCH_CHAT_API,CREATE_GROUP_CHAT_API,
    RENAME_GROUP_CHAT_API,REMOVE_FROM_GROUP_CHAT_API,ADD_TO_GROUP_CHAT_API,SEARCH_USER_API} = Chatendpoints;


  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
   
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
     
      const api = SEARCH_USER_API+`search=${search}`
      const response = await  apiConnector("GET",api,null,{
            Authorization: `Bearer ${user.token}`,
          });
        // console.log("response in handleSearch  is:",response?.data);
        const data = response?.data;
        setLoading(false);
      setSearchResult(data);
    } catch (error) {
        toast.error("Failed to Load the Search Results");
        setLoading(false);
      
    }
    setLoading(false);
  };

  const handleRename = async () => {
    setRenameLoading(true);

    if (!groupChatName) return;

    try {
      
      const response = await  apiConnector("PUT",RENAME_GROUP_CHAT_API,{chatId: selectedChat._id,
        chatName: groupChatName,},{
        Authorization: `Bearer ${user.token}`,
      });
    // console.log("response in handleName  is:",response?.data);
    const data = response?.data;
     
    

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      
    } catch (error) {
        toast.error(error.response.data.message);
     
      
    }
    setGroupChatName("");
    setRenameLoading(false);
  };

  const handleAddUser = async (user1) => {
    console.log("admin id is :",selectedChat.groupAdmin._id);
    console.log("User id is:",user._id);
    setLoading(true);
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("user Already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      const response = await  apiConnector("PUT",ADD_TO_GROUP_CHAT_API,{chatId: selectedChat._id,
        userId: user1._id,},{
        Authorization: `Bearer ${user.token}`,
      });
    //   console.log("response in handleAddUser  is:",response?.data);
      const data = response?.data;

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
        toast.error("error in adding user to group");
      setLoading(false);
      return;
    }
    setGroupChatName("");
    setLoading(false);
  };

  const handleRemove = async (user1) => {
    setLoading(true);
    console.log("admin id is :",selectedChat.groupAdmin._id);
    console.log("User id is:",user._id);
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      const response = await  apiConnector("PUT",REMOVE_FROM_GROUP_CHAT_API,{chatId: selectedChat._id,
        userId: user1._id,},{
        Authorization: `Bearer ${user.token}`,
      });
    //   console.log("response in handleRemove is:",response?.data);
      const data = response?.data;


      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    //   fetchMessages();
    } catch (error) {
        console.log("Error is:",error);
      toast.error("error in removing user");
      return;
    }
    setLoading(false);
    fetchMessages()
    setGroupChatName("");
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} 
      icon={<ViewIcon />} 
      onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;