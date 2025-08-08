const SOWModel = require("../models/PSOW");
const ApiError = require("../error/ApiError");

const addSOW = async (req, res, next)=>{
    try{
        const ids = req.params.id;
        const student = await userModel.findById(ids);
        const newSOW = await SOWModel({week: req.body.week});
        
        // const oldSOW = await userModel.find().where("studentOfTheWeek").equals(true);
        // const {_id} = oldSOW;
        // const oldStudent = await userModel.findOne(_id);
        // const oldSOWCount = await userModel.find().where("studentOfTheWeek").equals(true).count();
        
        newSOW.student = student;
        newSOW.save();
        res.status(200).json({ message: "new SOW added"})

        // if(oldSOWCount !== 0){
        //     oldStudent.studentOfTheWeek = false;
        //     oldStudent.save();
        //     student.studentOfTheWeek = true;
        //     student.save();
        //     newSOW.student = student;
        //     newSOW.save();
        //     res.status(200).json({ message: "new SOW added"})
        // }else if (oldSOWCount === 0){
        //     student.studentOfTheWeek = true;
        //     student.save();
        //     newSOW.student = student;
        //     newSOW.save(); 
        //     res.status(200).json({data: oldSOWCount , message: "no true found"})
        // }
        
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

const deleteSOTW= async (req, res, next)=>{
    try{
        const week = req.params.week
        const oneSOW = await SOWModel.find().where("week").equals(`${week}`)
        await oneSOW.remove()
        res.status(200).json({message: "Student of the week deleted"})

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

module.exports = {
    addSOW,
    getSOWTW,
    getAllSOWTW,
    deleteSOTW
}