const express = require("express");
const router = express.Router();
const {addRatings, getRatings, deleteRatings} = require("../controllers/ratings")

router.post("/add/:id", addRatings);
router.get("/get/:id", getRatings);
router.delete("/delete/:studentId/:week", deleteRatings);

module.exports = router