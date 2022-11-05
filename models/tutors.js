const mongoose = require("mongoose");

const tutorsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    rating: [{type: mongoose.SchemaTypes.ObjectId, ref:"ratings"}]
}, {timestamps: true});

const tutorModel = mongoose.model("tutor", tutorsSchema);

module.exports = tutorModel