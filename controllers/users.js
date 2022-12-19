require("dotenv").config({path: "../config/index.env"})
const userModel = require("../models/users.js");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
// const fs = require("fs");
// const validateEmail = require('node-deep-email-validator');
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'coldcolin',
    api_key: '294911175644673', 
    api_secret: '2HLHt9dU-ltj82-NjftTpIAdj-M', 
    secure: true 
  });

const storage = multer.diskStorage({
    destination: function (res, file, cb){
        cb(null, "./uploads")
    },
    filename: function(res, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage}).single("image");

const createUser = async(req, res, next)=>{
    try{
        // const valid = await validateEmail(req.body.email);
        const imageShow = await cloudinary.uploader.upload(req.file.path)
        // if(valid.result){
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)
            const newUser = await userModel.create({
                name: req.body.name,
                email: req.body.email,
                stack: req.body.stack,
                password: hash,
                image: imageShow.secure_url,
                imageId: imageShow.public_id
            });
            // fs.unlinkSync(req.file.path);
            res.status(201).json({data: newUser});
        // }else{
        //     res.status(400).json({error: valid.failReason});
        // }
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const deleteUser = async(req, res, next)=>{
    try{
        const Id = req.params.id;
        const user = await userModel.findById(Id);
        await cloudinary.uploader.destroy(user.imageId);
        await user.remove()
        res.status(200).json({msg: 'deleted'})
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getUser = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        res.status(200).json({data: user})
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getOneUser = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        res.status(200).json({data: user})
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const updateUser = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const user = userModel.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            stack: req.body.stack,
        }, {new: true});
        res.status(200).json({data: user});
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getUsers = async (req, res, next)=>{
    try{
        const users = await userModel.find();
        res.status(200).json({data: users})
    }catch(err){
        next(ApiError.badRequired(`${err}`))
    }
}

const loginUser = async (req, res, next)=>{
    try{
        const {email, password } = req.body;
        const user = await userModel.findOne({email: email});
        if(user){
            const pass = await bcrypt.compare(password, user.password);
            if(pass){
                const {password, ...data} = user._doc
                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    stack: user.stack,
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

module.exports ={
    createUser,
    upload,
    deleteUser,
    getUser,
    getOneUser,
    updateUser,
    getUsers,
    loginUser
}
