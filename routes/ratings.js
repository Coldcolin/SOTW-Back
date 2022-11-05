const express = require("express");
const router = express.Router();
const {addRating} = require("../controllers/ratings")

router.post("/add/:id", addRating)

module.exports = router