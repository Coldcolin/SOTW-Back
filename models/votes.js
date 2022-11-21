const mongoose = require("mongoose")

const voteSchema = new mongoose.Schema({
    count: {type: Number, required: true},
    forWho: {type: mongoose.SchemaTypes.ObjectId, ref: "SOWusers"},
    byWho: {type: mongoose.SchemaTypes.ObjectId, ref: "SOWusers"},
    week: {type: Number, required: true}
}, {timestamps: true});

const voteModel = mongoose.model("votes", voteSchema);

module.exports = voteModel;