const express = require("express");
const router = express.Router();
const {
    // Assignment Management
    createAssignment,
    getAssignmentsByWeekAndStack,
    getAssignmentsByWeek,
    getAllAssignments,
    updateAssignment,
    deleteAssignment,
    
    // Submission Management
    submitAssignment,
    getStudentSubmissions,
    getSubmissionById,
    
    // Grading Management
    gradeSubmission,
    getSubmissionsByWeek,
    getSubmissionsByAssignment
} = require("../controllers/assignmentManagementController");
const { authenticate, admin } = require("../middleware/authentation");

// ============== ASSIGNMENT ROUTES ==============

// Create assignment (tutors only)
router.post("/assignments/create", authenticate, admin, createAssignment);

// Get assignments by week and stack (for students)
router.get("/assignments/week/:week", authenticate, getAssignmentsByWeekAndStack);

// Get all assignments by week (for tutors)
router.get("/assignments/week/:week/all", authenticate, admin, getAssignmentsByWeek);

// Get all assignments (for tutors)
router.get("/assignments/all", authenticate, admin, getAllAssignments);

// Update assignment
router.patch("/assignments/:assignmentId", authenticate, admin, updateAssignment);

// Delete assignment
router.delete("/assignments/:assignmentId", authenticate, admin, deleteAssignment);

// ============== SUBMISSION ROUTES ==============

// Submit assignment (students only)
router.post("/submissions/:assignmentId/submit", authenticate, submitAssignment);

// Get student's submissions
router.get("/submissions/my-submissions", authenticate, getStudentSubmissions);

// Get specific submission by ID (for tutors)
router.get("/submissions/:submissionId", authenticate, getSubmissionById);

// ============== GRADING ROUTES ==============

// Grade a submission (tutors only)
router.patch("/grading/submission/:submissionId", authenticate, admin, gradeSubmission);

// Get submissions by week for grading (tutors only)
router.get("/grading/week/:week", authenticate, admin, getSubmissionsByWeek);

// Get submissions by assignment (tutors only)
router.get("/grading/assignment/:assignmentId", authenticate, admin, getSubmissionsByAssignment);

module.exports = router;