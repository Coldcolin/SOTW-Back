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
const { authenticate } = require("../middleware/authentation");

// ============== ASSIGNMENT ROUTES ==============

// Create assignment (tutors only)
router.post("/assignments/create", createAssignment);

// Get assignments by week and stack (for students)
router.get("/assignments/week/:week", authenticate, getAssignmentsByWeekAndStack);

// Get all assignments by week (for tutors)
router.get("/assignments/week/:week/all", getAssignmentsByWeek);

// Get all assignments (for tutors)
router.get("/assignments/all", getAllAssignments);

// Update assignment
router.patch("/assignments/:assignmentId", updateAssignment);

// Delete assignment
router.delete("/assignments/:assignmentId", deleteAssignment);

// ============== SUBMISSION ROUTES ==============

// Submit assignment (students only)
router.post("/submissions/:assignmentId/submit", authenticate, submitAssignment);

// Get student's submissions
router.get("/submissions/my-submissions", authenticate, getStudentSubmissions);

// Get specific submission by ID (for tutors)
router.get("/submissions/:submissionId", getSubmissionById);

// ============== GRADING ROUTES ==============

// Grade a submission (tutors only)
router.patch("/grading/submission/:submissionId", gradeSubmission);

// Get submissions by week for grading (tutors only)
router.get("/grading/week/:week", getSubmissionsByWeek);

// Get submissions by assignment (tutors only)
router.get("/grading/assignment/:assignmentId", getSubmissionsByAssignment);

module.exports = router;