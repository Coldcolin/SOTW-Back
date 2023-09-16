const express = require("express");
const router = express.Router();
const theAlgorithm = require("../controllers/SOTWAlgorithm");

router.use((req, res, next)=>{
    console.log("API Called", new Date());
    next();
});

router.post("/sotwfront", (req, res)=>{theAlgorithm.chooseFrontEndSOTW(req, res)});
router.post("/sotwback", (req, res)=>{theAlgorithm.chooseBackEndSOTW(req, res)});

module.exports = router;