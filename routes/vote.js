const express = require("express");
const router = express.Router();
const { addVote } = require("../controllers/voting");

router.post("/vote/:id/:userId", addVote);

module.exports = router

