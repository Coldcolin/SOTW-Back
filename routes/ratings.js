const express = require("express");
const router = express.Router();
const {addRating, getRatings} = require("../controllers/ratings")

router.post("/add/:id", addRating);
router.get("/get/:id", getRatings);

module.exports = router