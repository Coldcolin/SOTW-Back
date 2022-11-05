const mongoose = require("mongoose");

const sowSchema = new mongoose.Schema({
    student: {type: mongoose.SchemaTypes.ObjectId, ref:"users"},
    week: {type: Number, required: true}
}, {timestamps: true});

const sowModel = mongoose.model("sow", sowSchema);

module.exports = sowModel;