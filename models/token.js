const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, ref:"SOWusers"},
    token: {type: String},
    used: {type: Boolean, default: false}
}, {timestamps: true});

const tokenModel = mongoose.model("token",tokenSchema);

module.exports = tokenModel;