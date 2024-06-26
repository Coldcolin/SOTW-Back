const userModel = require("../models/users");
const ratingsModel = require("../models/ratings");
// const monthlyModel = require('../models/');
const backendSOTMModel = require('../models/backendSOTM');
const frontendSOTMModel = require('../models/frontendSOTM');
const productSOTMModel = require('../models/productSOTM');
const _ = require('lodash');
require('dotenv').config({path: './config/index.env'});



// //Function to generate a student monthly rating
// const monthlyRating = async (req, res) => {
//     try {
//         // Get the current date
//         const currentDate = new Date();

//         // Calculate the start of the current month
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         startOfMonth.setHours(0, 0, 0, 0);

//         // Calculate the end of the current month
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//         endOfMonth.setHours(23, 59, 59, 999);

//         //Check if it's close to the end of the month before generating monthly rating
//         if (currentDate <= new Date(currentDate.getFullYear(), currentDate.getMonth(), 25)) {
//             return res.status(400).json({
//                 message: "Not close to end of the month yet!"
//             })
//         }

//         //get the month
//         const months = [
//             "January", "February", "March", "April", "May", "June", "July",
//             "August", "September", "October", "November", "December"
//         ];

//         //Check if monthly rating has already been generated
//         const checkMonthlyRating = await monthlyModel.find({ month: months[currentDate.getMonth()] })
//         if (checkMonthlyRating) {
//             return res.status(400).json({
//                 message: "monthly rating already generated for the month " + months[currentDate.getMonth()],
//             })
//         }

//         const userId = req.params.userId;
//         const student = await userModel.findById(userId);
//         if (!student) {
//             return res.status(404).json({
//                 message: "Student not found!"
//             })
//         }

//         const MonthlyRating = await ratingsModel.find({
//             student: userId,
//             createdAt: {
//                 $gte: startOfMonth.toISOString(),
//                 $lte: endOfMonth.toISOString()
//             },
//         })

//         // Now we calculate the grand total of the scores per week
//         const grandTotal = MonthlyRating.reduce((total, MonthlyRating) => {
//             return total + MonthlyRating.total;
//         }, 0);

//         //We get the average score of the grand total
//         const averageMonthlyRating = grandTotal / MonthlyRating.length;

//         //Now we save the monthly score into the monthly rating document
//         const saveMonthlyRating = await monthlyModel.create({
//             student: student,
//             month: months[currentDate.getMonth()],
//             monthlyRating: averageMonthlyRating,
//         })

//         return res.status(200).json({
//             message: "Student monthly rating generated successfully",
//             data: saveMonthlyRating
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         })
//     }
// }


// //Function to generate all students monthly rating
// const monthlyRatingAuto = async (req, res) => {
//     try {
//         // Get the current date
//         const currentDate = new Date();

//         // Calculate the start of the current month
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         startOfMonth.setHours(0, 0, 0, 0);

//         // Calculate the end of the current month
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//         endOfMonth.setHours(23, 59, 59, 999);

//         //Check if it's close to the end of the month before generating monthly rating
//         if (currentDate <= new Date(currentDate.getFullYear(), currentDate.getMonth(), 25)) {
//             return res.status(400).json({
//                 message: "Not close to end of the month yet!"
//             })
//         }

//         //get the month
//         const months = [
//             "January", "February", "March", "April", "May", "June", "July",
//             "August", "September", "October", "November", "December"
//         ];

//         //Check if monthly rating has already been generated
//         const checkMonthlyRating = await monthlyModel.find({ month: months[currentDate.getMonth()] })
//         if (checkMonthlyRating) {
//             return res.status(400).json({
//                 message: "monthly rating already generated for the month " + months[currentDate.getMonth()],
//             })
//         }

//         // Fetch all students from the database
//         const students = await userModel.find();

//         // Loop through each student to calculate their monthly rating
//         const monthlyRatings = [];
//         for (const student of students) {
//             const MonthlyRating = await ratingsModel.find({
//                 student: student._id, // Use student's _id
//                 createdAt: {
//                     $gte: startOfMonth.toISOString(),
//                     $lte: endOfMonth.toISOString()
//                 },
//             });

//             // Calculate the grand total of the scores per week
//             const grandTotal = MonthlyRating.reduce((total, rating) => {
//                 return total + rating.total;
//             }, 0);

//             // Calculate the average score of the grand total
//             const averageMonthlyRating = grandTotal / MonthlyRating.length;

//             // Save the monthly score into the monthly rating document
//             const saveMonthlyRating = await monthlyModel.create({
//                 student: student,
//                 month: months[currentDate.getMonth()],
//                 monthlyRating: averageMonthlyRating,
//             });

//             // Add the monthly rating to the array
//             monthlyRatings.push(saveMonthlyRating);
//         }

//         return res.status(200).json({
//             message: "Students' monthly ratings generated successfully",
//             data: monthlyRatings
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         });
//     }
// };


// //Function to fetch a monthly rating
// const viewMonthlyRating = async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const monthlyRating = await monthlyModel.findOne({ student: { $in: [userId] } }).populate('student');
//         if (!monthlyRating) {
//             return res.status(404).json({
//                 message: "monthlyRating not found!"
//             })
//         }

//         return res.status(200).json({
//             message: "Monthly rating fetched successfully!",
//             data: monthlyRating
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         });
//     }
// };



// //Function to fetch all monthly ratings
// const viewAllMonthlyRating = async (req, res) => {
//     try {

//         const monthlyRating = await monthlyModel.find().sort({ createdAt: -1 }).populate('student');
//         if (!monthlyRating || monthlyRating.length === 0) {
//             return res.status(404).json({
//                 message: "monthlyRatings not found!"
//             })
//         }

//         return res.status(200).json({
//             message: "Monthly rating fetched successfully!",
//             data: monthlyRating
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         });
//     }
// };



// //Function to delete a monthly rating
// const deleteMonthlyRating = async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const monthlyRating = await monthlyModel.findOne({ student: { $in: [userId] } }).populate('student');
//         if (!monthlyRating) {
//             return res.status(404).json({
//                 message: "monthlyRating not found!"
//             })
//         }

//         const deleteMonthlyRating = await monthlyModel.findOneAndDelete({ student: { $in: [userId] } });
//         if (!deleteMonthlyRating) {
//             return res.status(400).json({
//                 message: "Unable to delete student monthly rating"
//             })
//         };

//         return res.status(200).json({
//             message: "Monthly rating deleted successfully!",
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         });
//     }
// };



// Function to generate all students' monthly rating
const fetchMonthlyRating = async (month) => {
    try {
        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        const currentMonth = months.findIndex(m => m === month);

        if (currentMonth === -1) {
            throw new Error("Invalid month name provided.");
        }

        const startOfMonth = new Date(new Date().getFullYear(), currentMonth, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const students = await userModel.find();

        const monthlyRatings = [];
        for (const student of students) {
            // Fetch the last four ratings
            const lastFourRatings = student.allRatings.slice(-4);

            // Calculate the average of the last four ratings
            const totalRatings = lastFourRatings.reduce((total, rating) => total + rating, 0);
            const averageMonthlyRating = lastFourRatings.length > 0 ? totalRatings / lastFourRatings.length : 0;

            const saveMonthlyRating = {
                student: student,
                month: month,
                monthlyRating: averageMonthlyRating,
            };

            monthlyRatings.push(saveMonthlyRating);
        }

        return monthlyRatings;

    } catch (error) {
        throw new Error("Error fetching monthly ratings: " + error.message);
    }
};



// Function to generate all students' previous monthly rating
const prevMonthlyRating = async (highScore, month) => {
    try {
        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        const currentMonthIndex = months.findIndex(m => m === month);
        if (currentMonthIndex === -1) {
            throw new Error("Invalid month name provided.");
        }

        const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12;
        const previousMonth = months[previousMonthIndex];

        const userIds = highScore.map(student => student._id);

        const monthlyRatings = [];
        for (const userId of userIds) {
            const student = await userModel.findById(userId);
            if (!student) {
                continue;
            }

            // Fetch the previous four ratings (before the last four ratings)
            const allRatings = student.allRatings;
            const ratingsCount = allRatings.length;
            
            if (ratingsCount < 8) {
                // Ensure there are at least 8 ratings to get the previous four before the last four
                throw new Error(`Not enough ratings available for student ID ${userId}`);
            }

            // Fetch the previous four ratings
            const prevFourRatings = allRatings.slice(-8, -4);

            // Calculate the average of the previous four ratings
            const totalPrevFourRatings = prevFourRatings.reduce((total, rating) => total + rating, 0);
            const averagePrevMonthlyRating = prevFourRatings.length > 0 ? totalPrevFourRatings / prevFourRatings.length : 0;

            const saveMonthlyRating = {
                student: student,
                month: previousMonth,
                monthlyRating: averagePrevMonthlyRating,
            };

            monthlyRatings.push(saveMonthlyRating);
        }

        return monthlyRatings;

    } catch (error) {
        throw new Error("Error fetching previous monthly ratings: " + error.message);
    }
};



// Function to select Student of the Month (SOTM) for a specific stack
const selectSOTMForStack = async (stack, sotwModel, month) => {
    // Fetch students' ratings for the specified stack and month
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const currentMonth = months.findIndex(m => m === month);

    const allRatings = await fetchMonthlyRating(month);

    // Filter ratings by stack and role
    const filterByStack = allRatings.filter(rating => {
        // Check if the student's stack and role match the provided parameters
        const student = rating.student;
        return student.stack === stack && student.role === 'student';
    });


    // If no students found for the stack, throw an error
    if (filterByStack.length === 0) {
        throw new Error(`No student found for ${stack} stack in ${months[currentMonth]}!`);
    }

    // Map each student's score and information
    const getEachScore = filterByStack.map(score => ({
        month: score.month,
        monthlyRating: score.monthlyRating,
        student: score.student // Changed to use score.student directly without [0] index
    }));

    // Extract the scores
    const scores = getEachScore.map(score => score.monthlyRating);
    // Find the maximum score
    const maxScore = Math.max(...scores);
    // Filter students with the maximum score
    const highScores = getEachScore.filter(score => score.monthlyRating === maxScore);


    // If there's only one student with the maximum score, return the student and score
    if (highScores.length === 1) {
        return { student: highScores[0].student, score: maxScore };
    } else { // If multiple students have the same maximum score, consider previous month's score
        let highestPrevMonthScore = [];
        for (const score of highScores) {
            // Find the previous month's score for each student
            const prevMonthScore = await prevMonthlyRating(highScores, month);

            // Use the previous month's score or default to 0 if not found
            const totalScore = prevMonthScore.monthlyRating > 0 ? prevMonthScore.monthlyRating : 0;
            highestPrevMonthScore.push(totalScore);
        }

        // Check if any high scorer has a previous month's score greater than 0
        const hasPreviousScores = highestPrevMonthScore.some(score => score > 0);

        if (!hasPreviousScores) {
            // If none of the high scorers have a previous score, randomly select one
            const index = Math.floor(Math.random() * highScores.length);
            return { student: highScores[index].student, score: maxScore };
        } else {
            // Find the maximum previous month's score among the high scorers
            const maxPrevMonthScore = Math.max(...highestPrevMonthScore);
            const maxScoreIndex = highestPrevMonthScore.indexOf(maxPrevMonthScore);

            if (maxPrevMonthScore.length > 1) {
                // If none of the high scorers have a previous score, randomly select one
                const index = Math.floor(Math.random() * highScores.length);
                return { student: highScores[index].student, score: maxScore };
            } else {
                // Return the student with the highest previous month's score
                return { student: highScores[maxScoreIndex].student, score: maxScore };
            }
        }
    }
};



// Function to select SOTM for a given stack
const selectSOTM = async (stack, sotmModel, month) => {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const monthIndex = months.findIndex(m => m === month);
    const currentMonth = months[monthIndex]
    // Select SOTM for the specified stack
    const selectedSOTM = await selectSOTMForStack(stack, sotmModel, month);
    const { student, score } = selectedSOTM;

    // Check if SOTM has already been selected for the month
    const checkSOTM = await sotmModel.findOne({ month: currentMonth });

    // If SOTM already exists for the month, throw an error
    if (checkSOTM) {
        throw new Error(`${stack} SOTM has already been selected for ${currentMonth}!`);
    }

    // Create SOTM entry in the database
    await sotmModel.create({ student, month: currentMonth, score });
    // Return the selected student
    return student;
};


//Function to get the best student for the month by their stacks
const SOTM = async (req, res) => {
    try {
        const { month } = req.body;
        if (!month) {
            return res.status(400).json({
                message: "Month is required in request body."
            });
        }
        // Select SOTM for Backend stack
        const selectedBackendSOTM = await selectSOTM('backend', backendSOTMModel, month);
        // Select SOTM for Frontend stack
        const selectedFrontendSOTM = await selectSOTM('frontend', frontendSOTMModel, month);
        // Select SOTM for Product Design stack
        const selectedProductSOTM = await selectSOTM('productdesign', productSOTMModel, month);

        // Return successful response with selected SOTW for each stack
        return res.status(200).json({
            message: "Student of the month successfully selected for the following stacks:",
            Backend: selectedBackendSOTM,
            Frontend: selectedFrontendSOTM,
            ProductDesign: selectedProductSOTM,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}


//Function to get the best student for the month by their stacks
const SOTMByStacksAndMonth = async (req, res) => {
    try {
        const { month, stack } = req.body;
        if (!month || !stack) {
            return res.status(400).json({
                message: "Month and stack are required in request body."
            });
        }

        let stackModel;
        if (stack === 'backend') {
            stackModel = backendSOTMModel;
        } else if (stack === 'frontend') {
            stackModel = frontendSOTMModel;
        } else if (stack === 'productdesign') {
            stackModel = productSOTMModel;
        } else {
            return res.status(400).json({
                message: "Invalid stack provided."
            });
        }

        // Select SOTM for the specified stack
        const selectedSOTM = await selectSOTM(stack, stackModel, month);

        // Return successful response with selected SOTM
        return res.status(200).json({
            message: `Student of the month successfully selected for ${stack} stack in ${month}:`,
            data: selectedSOTM,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



const SOTMbyMonth = async (stack, SOTMmodel) => {
    const currentDate = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const currentMonth = months[currentDate.getMonth()]

    // fetch SOTM for the current month
    const SOTM = await SOTMmodel.findOne({ month: currentMonth }).populate('student');

    if (!SOTM || SOTM.length === 0) {
        throw new Error(`${stack} SOTM was not found for ${currentMonth}!`);
    }

    return SOTM;
}



//Function to view the SOTM for a particular month and for all stacks
const viewSOTM = async (req, res) => {
    try {
        // fetch SOTM for Backend stack
        const BackendSOTM = await SOTMbyMonth('backend', backendSOTMModel);
        // fetch SOTM for Frontend stack
        const FrontendSOTM = await SOTMbyMonth('frontend', frontendSOTMModel);
        // fetch SOTM for Product Design stack
        const ProductSOTM = await SOTMbyMonth('productdesign', productSOTMModel);

        return res.status(200).json({
            message: "Student of the month successfully fetched for the following stacks:",
            Backend: BackendSOTM,
            Frontend: FrontendSOTM,
            ProductDesign: ProductSOTM,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}




const allSOTM = async (stack, SOTMmodel) => {

    // fetch SOTM for the current month
    const SOTM = await SOTMmodel.find().sort({ createdAt: -1 }).populate('student');

    if (!SOTM || SOTM.length === 0) {
        throw new Error(`${stack} SOTM was not found!`);
    }

    return SOTM;
}


//Function to view all the SOTM for all stacks
const viewAllSOTM = async (req, res) => {
    try {
        // fetch SOTM for Backend stack
        const BackendSOTM = await allSOTM('backend', backendSOTMModel);
        // fetch SOTM for Frontend stack
        const FrontendSOTM = await allSOTM('frontend', frontendSOTMModel);
        // fetch SOTM for Product Design stack
        const ProductSOTM = await allSOTM('productdesign', productSOTMModel);

        return res.status(200).json({
            message: "Student of the Month successfully fetched for the following stacks:",
            Backend: BackendSOTM,
            Frontend: FrontendSOTM,
            ProductDesign: ProductSOTM,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}


//Function to delete a backend SOTM document
const deleteSOTMb = async (req, res) => {
    try {
        const sotmId = req.params.sotmId
        const sotmB = await backendSOTMModel.findById(sotmId);
        if (!sotmB) {
            return res.status(404).json({
                message: "Backend SOTM not found",
            })
        }

        const deleteSOTMb = await backendSOTMModel.findByIdAndDelete(sotmId);
        if (!deleteSOTMb) {
            return res.status(400).json({
                message: "Unable to delete Backend SOTM Data"
            });
        }

        return res.status(200).json({
            message: "SOTM data for backend deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}


//Function to delete a frontend SOTM document
const deleteSOTMf = async (req, res) => {
    try {
        const sotmId = req.params.sotmId
        const sotmF = await frontendSOTMModel.findById(sotmId);
        if (!sotmF) {
            return res.status(404).json({
                message: "Frontend SOTM not found",
            })
        }

        const deleteSOTMf = await frontendSOTMModel.findByIdAndDelete(sotmId);
        if (!deleteSOTMf) {
            return res.status(400).json({
                message: "Unable to delete Frontend SOTM Data"
            });
        }

        return res.status(200).json({
            message: "SOTM data for frontend deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}


//Function to delete a Product design SOTM document
const deleteSOTMp = async (req, res) => {
    try {
        const sotmId = req.params.sotmId
        const sotmP = await productSOTMModel.findById(sotmId);
        if (!sotmP) {
            return res.status(404).json({
                message: "Product design SOTM not found",
            })
        }

        const deleteSOTMp = await productSOTMModel.findByIdAndDelete(sotmId);
        if (!deleteSOTMp) {
            return res.status(400).json({
                message: "Unable to delete Product design SOTM Data"
            });
        }

        return res.status(200).json({
            message: "SOTM data for Product design deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        })
    }
}



module.exports = {
    SOTM,
    SOTMByStacksAndMonth,
    viewSOTM,
    viewAllSOTM,
    deleteSOTMb,
    deleteSOTMf,
    deleteSOTMp,

}