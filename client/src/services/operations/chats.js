// import { apiConnector } from "../apiConnector";
// import { chatEndpoints } from "../apis";

// const {GET_ALL_CHATS_API} = chatEndpoints;

// export const getAllChats = async () =>{
//     let data;
//     console.log(`Api is ${GET_ALL_CHATS_API} `);
//     try {
//         const response =  await apiConnector("GET" , GET_ALL_CHATS_API);
//         console.log("Response is :" , response);
//         if(!response?.data?.success)
//         {
//             console.log("succes is ", response?.success);
//             throw new Error("Could Not Fetch Chats");
//         }    
//         data = response?.data?.data;
//         return  data;
//     } 
    
//     catch (error) {
//         console.log("Error in getting chats at frontEnd");
//         console.log("Error is ", error.message);
//     }
//     return data
// }