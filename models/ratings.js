const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({
    punctuality: { type: Number, required: true },
    Assignments: { type: Number, required: true },
    personalDefense: { type: Number, required: true },
    classParticipation: { type: Number, required: true },
    classAssessment: { type: Number, required: true },
    total: { type: Number, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "SOWusers", required: true },
    week: { type: Number, required: true }
}, { timestamps: true });

ratingsSchema.index({ student: 1, week: 1 }, { unique: true });

const ratingsModel = mongoose.model("ratings", ratingsSchema);

module.exports = ratingsModel;
