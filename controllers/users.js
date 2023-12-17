require("dotenv").config({path: "../config/index.env"})
const userModel = require("../models/users.js");
const tokenModel = require("../models/token.js");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const nodemailer = require("nodemailer");
const { error } = require("console");
const crypto = require('crypto');
const cloudinary = require("cloudinary").v2;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.email,
      pass: process.env.mailKey,
    },
  });

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
                cohort: req.body.cohort,
                role: req.body.role,
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
        const user = await userModel.findByIdAndUpdate(id, {
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
        next(ApiError.badRequest(`${err}`))
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
        next(ApiError.badRequest(`${err}`))
    }
}

const makeAlumni = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findByIdAndUpdate(id, {
            role: "alumni",
        }, {new: true});
        res.status(200).json({message: "successfully made an Alumni"});
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}
const makeStudent = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findByIdAndUpdate(id, {
            role: "student",
        }, {new: true});
        res.status(200).json({message: "successfully made an Alumni"});
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}


const forgotPassword= async(req, res, next) => {
    try{
        const {email} = req.body

        // // Check if the email exists in your user database
        const user = await userModel.find({email: req.body.email})
        
      
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const checkIfTokenExists = await tokenModel.find().where("userId").equals(`${user[0]._id}`)
        
        const tokenValue = crypto.randomBytes(4).toString("hex")

        if (checkIfTokenExists.length >= 1) {
            await tokenModel.findByIdAndDelete(checkIfTokenExists[0]._id)
            // // Generate a unique token for password reset
            await tokenModel.create({
                token: tokenValue,
                userId: user[0]._id,
            })
        }else{
            // Generate a unique token for password reset
            await tokenModel.create({
                token: tokenValue,
                userId: user[0]._id,
            })
        }

        const value = user[0]?._id.toString()
        const encryptedString = cryptr.encrypt(value);


        const info = await transporter.sendMail({
            from: 'ColdDev 😎 from The curve Africa', // sender address
            to: email, // list of receivers
            subject: "Password Reset", // Subject line
            text: "", // plain text body
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
            </head>
            
            <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 30px; background-color: #023047;">
            
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="margin-top: 30px; border-radius: 5px">
                <tr>
                  <td bgcolor="#fffff" style="padding: 40px 30px 40px 30px;border-radius: 5px">
            
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #023047; font-size: 24px; text-align: center;-webkit-text-stroke: 1px black;text-shadow:3px 3px 0 #000,-1px -1px 0 #000,  1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;">
                          <strong>Password Reset</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                          <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
                          <p>To reset your password, click the link below:</p>
                          <p style="text-align: center;">
                            <a href="https://thecurve-sotw.onrender.com/#/reset/${encryptedString}" style="background-color: #FFB703; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                          </p>
                          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                          <p style="text-align: center;">https://thecurve-sotw.onrender.com/#/reset/${encryptedString}</p>
                          <p style="text-align: center;">Use this token: <b>${tokenValue}</b></p>
                          <p style="margin-top: 30px;">Thanks,<br>THE CURVE AFRICA</p>
                        </td>
                      </tr>
                    </table>
            
                  </td>
                </tr>
              </table>
            
            </body>
            
            </html>`, // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          res.status(200).send("successful")

    }catch(err){
        next(ApiError.badRequest(`${err}`))
        // console.log(err)
    }
}

const resetPassword = async(req, res, next)=>{
    try{
        const userId = req.params.id;
        const decryptedString = cryptr.decrypt(userId);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)
        
        const theTokenItem = await tokenModel.findOne({userId: decryptedString});
        
        const token = theTokenItem.token

        if(token !== req.body.token){
            res.status(400).json({message: "incorrect token"})
        }else{
            await userModel.findByIdAndUpdate( decryptedString, {
                password: hash,
            }, {new: true})
            await tokenModel.findByIdAndDelete(
                theTokenItem._id
            );
            res.status(201).json({ message: "reset complete"})
        }

    }catch(err){
        next(ApiError.badRequest(`${err}`))
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
    loginUser,
    makeAlumni,
    makeStudent,
    forgotPassword,
    resetPassword
}
