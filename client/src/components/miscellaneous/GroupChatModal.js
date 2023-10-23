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
    Box,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ChatState } from "../../Context/ChatProvider";
  import UserBadgeItem from "./userAvatar/UserBadgeItem";
  import UserListItem from "./userAvatar/UserListItem";
  import { apiConnector } from "../../services/apiConnector";
  import { Chatendpoints } from "../../services/apis";
  import toast from 'react-hot-toast'
  
  const GroupChatModal = ({ children }) => {

    const {SEARCH_USER_API,ACCESS_CHAT_API,CREATE_GROUP_CHAT_API} = Chatendpoints;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
   
  
    const { user, chats, setChats } = ChatState();
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast.error("user already added");
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
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
        return
      }
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
       toast.error("All fileds are required");
        return;
      }
  
      try {

        const response = await  apiConnector("POST",CREATE_GROUP_CHAT_API,
        {
            name:groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
            Authorization: `Bearer ${user.token}`,
        });
        console.log("response in handleSubmit  is:",response?.data);
        const data = response?.data;

        setChats([data, ...chats]);
        onClose();
        toast.success("Chat created Successfully");
        return
      } catch (error) {
        toast.error("failed to create chat");
        return;
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal  onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
             
              
            }}
           />
          <ModalContent >
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center" >
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                      
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;