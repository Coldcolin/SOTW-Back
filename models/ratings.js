const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({
    punctuality: {type: Number, required: true},
    Assignments: {type: Number, required: true},
    personalDefense: {type: Number, required: true},
    classParticipation: {type: Number, required: true},
    classAssessment: {type: Number, required: true},
    total: {type: Number, required: true},
    student: {type: mongoose.SchemaTypes.ObjectId, ref: "SOWusers"},
    week: {type: Number, required: true}
}, {timestamps: true});

const ratingsModel = mongoose.model("ratings", ratingsSchema );

module.exports = ratingsModel;