const SOWModel = require("../models/PSOW");
const ApiError = require("../error/ApiError");


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
    getSOWTW,
    getAllSOWTW,
    deleteSOTW
}