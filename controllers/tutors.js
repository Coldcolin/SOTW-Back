require("dotenv").config({path: "../config/index.env"})
const tutorModel = require("../models/tutors");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const validateEmail = require('node-deep-email-validator');


const createTutor = async(req, res, next)=>{
    try{
        const valid = await validateEmail(req.body.email);
        if(valid.result){
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)
            const newTutor = await tutorModel.create({
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                password: hash,
            });
            res.status(201).json({data: newTutor});
        }else{
            res.status(400).json({error: valid.failReason});
        }
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const deleteTutor = async(req, res, next)=>{
    try{
        const Id = req.params.id;
        const tutor = await tutorModel.findById(Id);
        await tutor.remove()
        res.status(200).json({msg: 'deleted'})
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getOneTutor = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const tutor = await tutorModel.findById(id);
        res.status(200).json({data: tutor})
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}


const updateTutor = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const tutor = tutorModel.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        }, {new: true});
        res.status(200).json({data: tutor});
    }catch(err){
        next(ApiError.badRequired(`${err}`))
    }
}

const getTutors = async (req, res, next)=>{
    try{
        const tutor = await tutorModel.find();
        res.status(200).json({data: tutor})
    }catch(err){
        next(ApiError.badRequired(`${err}`))
    }
}

const loginTutor = async (req, res, next)=>{
    try{
        const {email, password } = req.body;
        const tutor = await tutorModel.findOne({email: email});
        if(tutor){
            const pass = await bcrypt.compare(password, tutor.password);
            if(pass){
                const {password, ...data} = tutor._doc
                const token = jwt.sign({
                    id: tutor._id,
                    email: tutor.email,
                    role: tutor.role,
                }, process.env.secret_key, {expiresIn: "1d"});
                res.status(200).json({message:"logged in", data: {...data, token}})
            }else{
                res.status(400).json({error: `password: ${password} is incorrect`})
            }
        }else{
            res.status(404).json({error: `user with email :${email} is not found`})
        }
    }catch(err){
        next(ApiError.badRequired(`${err}`))
    }
}

module.exports = {
    createTutor,
    deleteTutor,
    getOneTutor,
    updateTutor,
    getTutors,
    loginTutor
}