const express = require("express");
const router = express.Router();
const {addSOW, getSOWTW, getAllSOWTW} = require("../controllers/SOW")

router.post("/create/:id", addSOW);
router.get("/student", getSOWTW);
router.get("/all", getAllSOWTW);

module.exports = router;