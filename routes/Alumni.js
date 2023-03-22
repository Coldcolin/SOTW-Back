const express = require('express');
const {addAlumni} = require("../controllers/Alumni");
const router = express.Router();

router.post("/addAlumni", addAlumni);


module.exports = router;
