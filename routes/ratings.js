const express = require("express");
const router = express.Router();
const {addRating, getRatings, deleteRatings} = require("../controllers/ratings")

router.post("/add/:id", addRating);
router.get("/get/:id", getRatings);
router.delete("/delete/:studentId/:week", deleteRatings);

module.exports = router