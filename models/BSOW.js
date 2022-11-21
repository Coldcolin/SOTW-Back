const mongoose = require("mongoose");

const sowSchema = new mongoose.Schema({
    student: {type: mongoose.SchemaTypes.ObjectId, ref:"SOWusers"},
    week: {type: Number, required: true}
}, {timestamps: true});

const sowModel = mongoose.model("bsow", sowSchema);

module.exports = sowModel;