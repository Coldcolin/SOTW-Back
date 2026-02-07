const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SOWusers",
        required: true
    },
    submissionLink: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    isLate: {
        type: Boolean,
        default: false
    },
    grade: {
        type: Number,
        min: 0,
        max: 20
    }
}, {
    timestamps: true
});

// Ensure one submission per student per assignment
assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);