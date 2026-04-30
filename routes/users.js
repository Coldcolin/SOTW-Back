const express = require('express');
const {createUser, studentDashboard, deleteUser, getUser, getOneUser, updateUser, 
    secondUpdate, getUsers, loginUser,makeAlumni,makeStudent, forgotPassword, resetPassword, updateAllUsersWeekStatus,
       getDashboardStats,
    getAllStaffs,
getAllStudents,
getAllAlumnis,
getSingleStudent,
getSingleStaff,
getSingleAlumni, resetWeeklyAssessments} = require("../controllers/users.js");
const { authenticate } = require('../middleware/authentation.js');
const upload = require("../middleware/multer.js")
const router = express.Router();

router.post("/create",upload.single("image"), createUser);
router.delete("/remove/:id", deleteUser)
router.get("/getUser/:id", getUser);
router.get("/oneUser/:id", getOneUser);
router.get("/allUsers", getUsers);
router.patch("/update/:id",upload.single("image"), updateUser);
router.patch("/anotherUpdate/:id", secondUpdate);
router.patch("/alumni/:id", makeAlumni);
router.patch("/student/:id", makeStudent);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.patch("/reset/:id", resetPassword);
router.patch('/update-all-week-status', updateAllUsersWeekStatus);
router.patch('/reset-assessments', resetWeeklyAssessments);
router.get("/dashboard", authenticate,studentDashboard);


router.get("/dashboard/stats", getDashboardStats);

router.get("/students", getAllStudents);
router.get("/staffs", getAllStaffs);
router.get("/alumnis", getAllAlumnis);


router.get("/students/:id", getSingleStudent);
router.get("/staffs/:id", getSingleStaff);
router.get("/alumnis/:id", getSingleAlumni);


module.exports = router;
