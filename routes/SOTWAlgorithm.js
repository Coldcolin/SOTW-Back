const express = require("express");
const router = express.Router();
const theAlgorithm = require("../controllers/SOTWAlgorithm");

router.use((req, res, next)=>{
    console.log("API Called", new Date());
    next();
});

router.post("/sotwfront/", (req, res, next)=>{theAlgorithm.chooseFrontEndSOTW(req, res, next)});
router.post("/sotwback/", (req, res, next)=>{theAlgorithm.chooseBackEndSOTW(req, res, next)});
router.post("/sotwproduct/", (req, res, next)=>{theAlgorithm.chooseProductSOTW(req, res, next)});
router.post("/sotm/", (req, res, next)=>{theAlgorithm.chooseStudentsOfTheMonth(req, res, next)});
router.post("/position", (req, res, next)=>{theAlgorithm.setStudentsPosition(req, res, next)});

module.exports = router;