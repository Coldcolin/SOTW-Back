const express = require("express");
const router = express.Router();
const {getSOWTW, getAllSOWTW, deleteSOTW} = require("../controllers/PSOW")

router.get("/student", getSOWTW);
router.get("/all", getAllSOWTW);
router.delete("/delete/:week", deleteSOTW);

module.exports = router;