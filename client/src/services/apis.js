const BASE_URL = process.env.REACT_APP_CHAT_APP_BASE_URL;


export const authendpoints = {
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/auth/updateDisplaypicture",
    
    // GET_ALL_CHATS_API : BASE_URL + "/chats/getAllChats",
}

export const Chatendpoints = {
    SEARCH_USER_API: BASE_URL + "/auth?",
    ACCESS_CHAT_API: BASE_URL + "/chat",
    FETCH_CHAT_API: BASE_URL + "/chat",
    CREATE_GROUP_CHAT_API: BASE_URL + "/chat/group",
    RENAME_GROUP_CHAT_API: BASE_URL + "/chat/rename",
    REMOVE_FROM_GROUP_CHAT_API: BASE_URL + "/chat/groupremove",
    ADD_TO_GROUP_CHAT_API: BASE_URL + "/chat/groupadd",
}

export const messageendpoints = {
    SEND_MESSAGE_API: BASE_URL + "/message",
    FETCH_MESSAGES_API : BASE_URL + "/message"
    
}





// router.post("/",auth,sendMessage);
// router.get("/:chatId",auth,allMessages);