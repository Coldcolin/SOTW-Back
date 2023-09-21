const express = require("express");
const router = express.Router();
const {addSOW, getSOWTW, getAllSOWTW, deleteSOTW} = require("../controllers/BSOW")

router.post("/create/:id", addSOW);
router.get("/student", getSOWTW);
router.get("/all", getAllSOWTW);
router.delete("/delete/:week", deleteSOTW);

module.exports = router;