const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const router = express.Router();

const {accessChats,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} =  require("../controllers/chatController");


router.post("/", auth, accessChats);
router.get("/", auth, fetchChats);
router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/groupremove", auth, removeFromGroup);
router.put("/groupadd", auth, addToGroup);


module.exports = router