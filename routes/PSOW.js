const express = require("express");
const router = express.Router();
const {getSOWTW, getAllSOWTW, deleteSOTW, addSOW} = require("../controllers/PSOW")

router.post("/create/:id", addSOW);
router.get("/student", getSOWTW);
router.get("/all", getAllSOWTW);
router.delete("/delete/:week", deleteSOTW);

module.exports = router;