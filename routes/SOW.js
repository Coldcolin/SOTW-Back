const express = require("express");
const router = express.Router();
const {addSOW} = require("../controllers/SOW")

router.post("/create/:id", addSOW);

module.exports = router;