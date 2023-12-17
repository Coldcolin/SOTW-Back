const express = require('express');
const {createUser, upload, deleteUser, getUser, getOneUser, updateUser, getUsers, loginUser,makeAlumni,makeStudent, forgotPassword, resetPassword} = require("../controllers/users.js");
const router = express.Router();

router.post("/create",upload, createUser);
router.delete("/remove/:id", deleteUser)
router.get("/getUser/:id", getUser);
router.get("/oneUser/:id", getOneUser);
router.get("/allUsers", getUsers);
router.patch("/update/:id", updateUser);
router.patch("/alumni/:id", makeAlumni);
router.patch("/student/:id", makeStudent);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.patch("/reset/:id", resetPassword);

module.exports = router;
