const express = require('express');
const {createUser, upload, deleteUser, getUser, getOneUser, updateUser, getUsers, loginUser} = require("../controllers/users.js");
const router = express.Router();

router.post("/create",upload, createUser);
router.delete("/remove/:id", deleteUser)
router.get("/getUser/:id", getUser);
router.get("/oneUser/:id", getOneUser);
router.get("/allUsers", getUsers);
router.patch("/update/:id", updateUser);
router.post("/login", loginUser);

module.exports = router;
