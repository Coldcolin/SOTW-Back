const SOWModel = require("../models/BSOW");
const userModel = require("../models/users");
const ApiError = require("../error/ApiError");

const addSOW = async (req, res, next)=>{
    try{
        const ids = req.params.id;
        const student = await userModel.findById(ids);
        const newSOW = await SOWModel({week: req.body.week});
        newSOW.student = student;
        const oldSOW = await userModel.find().where("bStudentOfTheWeek").equals(true);
        const {_id} = oldSOW;
        const oldStudent = await userModel.findOne(_id);
        const oldSOWCount = await userModel.find().where("bStudentOfTheWeek").equals(true).count();
        if(oldSOWCount){
            oldStudent.bStudentOfTheWeek = false;
            oldStudent.save();
            student.bStudentOfTheWeek = true;
            student.save();
            newSOW.save();
            res.status(200).json({ message: "new SOW added"})
        }else{
            student.bStudentOfTheWeek = true;
            student.save();
            newSOW.save(); 
            res.status(200).json({data: oldSOWCount , message: "no true found"})
        }
        // res.status(200).json({message: `new student of the week is ${student.name}` })
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getSOWTW= async (req, res, next)=>{
    try{
        const allSOW = await SOWModel.findOne().sort('-createdAt').populate("student");
        res.status(200).json({data: allSOW})

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}
const getAllSOWTW= async (req, res, next)=>{
    try{
        const allSOW = await SOWModel.find().sort('-createdAt').populate("student");
        res.status(200).json({data: allSOW})

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

module.exports = {
    addSOW,
    getSOWTW,
    getAllSOWTW
}