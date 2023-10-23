const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const router = express.Router();

const {sendMessage,allMessages} = require("../controllers/messageController");


router.post("/",auth,sendMessage);
router.get("/:chatId",auth,allMessages);

module.exports = router;