const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/authMiddleware");
const {signup} = require("../controllers/userController");
const {login,allUsers,updateDisplayPicture} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/", auth,allUsers);
router.put("/updateDisplaypicture", auth,updateDisplayPicture);


module.exports = router