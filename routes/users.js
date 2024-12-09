const express = require('express');
const {createUser, upload, deleteUser, getUser, getOneUser, updateUser, secondUpdate, getUsers, loginUser,makeAlumni,makeStudent, forgotPassword, resetPassword, updateAllUsersWeekStatus, resetWeeklyAssessments} = require("../controllers/users.js");
const router = express.Router();

router.post("/create",upload, createUser);
router.delete("/remove/:id", deleteUser)
router.get("/getUser/:id", getUser);
router.get("/oneUser/:id", getOneUser);
router.get("/allUsers", getUsers);
router.patch("/update/:id",upload, updateUser);
router.patch("/anotherUpdate/:id", secondUpdate);
router.patch("/alumni/:id", makeAlumni);
router.patch("/student/:id", makeStudent);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.patch("/reset/:id", resetPassword);
router.patch('/update-all-week-status', updateAllUsersWeekStatus);
router.patch('/reset-assessments', resetWeeklyAssessments);

module.exports = router;
