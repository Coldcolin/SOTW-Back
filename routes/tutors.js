const express = require('express');
const {createTutor, deleteTutor, getTutors, getOneTutor, updateTutor, loginTutor} = require("../controllers/tutors");
const router = express.Router();

router.post("/create",createTutor);
router.delete("/remove/:id", deleteTutor)
router.get("/getTutor/:id", getTutors);
router.get("/oneTutor/:id", getOneTutor);
router.get("/allTutors", getTutors);
router.patch("/update", updateTutor);
router.post("/login", loginTutor);

module.exports = router;
