const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    stack: {
        type: String,
        required: true,
        enum: ["Front End", "Back End", "Product Design"]
    },
    dueDateTime: {
        type: Date,
        required: true
    },
    allowLateSubmissions: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Index for efficient querying
assignmentSchema.index({ week: 1, stack: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);