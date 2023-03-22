const alumniModel = require("../models/Alumni");
const userModel = require("../models/users.js");
const ApiError = require("../error/ApiError");

const addAlumni = async(req, res)=>{
    try{
        const newSet = await userModel.find().where("role").equals("student");

        await alumniModel.insertMany(newSet);

        await userModel.deleteMany().where("role").equals("student")

        res.status(200).json({message: "done"})

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

module.exports = {
    addAlumni
}