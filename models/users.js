const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    imageId: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    stack: {type:String, required: true},
    allRatings: {type: Array},
    overallRating: {type: Number},
    weeklyRating: {type: Number},
    nominated: {type: Boolean, default: false},
    studentOfTheWeek: {type: Boolean, default: false},
    bStudentOfTheWeek: {type: Boolean, default: false}
}, {timestamps:true});

const userModel = mongoose.model("SOWusers", userSchema);

module.exports = userModel;