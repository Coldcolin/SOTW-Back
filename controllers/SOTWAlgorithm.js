const users = require("../models/users");
const ratings = require("../models/ratings");
const backendSOTW = require("../models/BSOW");
const productSOTW = require("../models/PSOW");
const frontendSOTW = require("../models/SOW");
const ApiError = require("../error/ApiError");


const theAlgorithm ={
    "chooseFrontEndSOTW": async function(req, res, next){
        try{
            //get week to be used
            const week = req.body.week
            //get all results for the week
            const resultsForWeek = await ratings.find().where("week").equals(`${week}`).populate("student");
            if (resultsForWeek.length === 0){
                return next(ApiError.badRequest("No results for this week"))
            }
            //find students in the Front end
            const frontEndStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Front End") && (result?.student?.role === "student"));
            // //If there are no students
            if(frontEndStudents.length !== 0){
                    //Get array for all students scores
                    const arrayOfTotalScores = frontEndStudents.map((rating)=> rating.total)
                //Find Highest Score
                const highestScore = Math.max(...arrayOfTotalScores);
                //Check if more than one student gets the Highest score
                const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore)
                //check if there is already a SOTW for that week
                const check = await frontendSOTW.find().where("week").equals(`${week}`);
                //If there is no SOTW for that week
                if(check.length === 0){
                    //If the length of highScoreArray is 1, then make student SOTW else use other metrics
                    if(highScoreArray.length  === 1){
                            //to get result with highest score
                            const resultWithHighestScore = frontEndStudents.filter((result)=> result.total === highestScore);
                            //to get id of Student with highest score
                            const studentId = resultWithHighestScore[0].student?._id
                        //find student from data base
                        const student = await users.findById(studentId);
                        //create an instance for SOTW
                        const newSOW = await frontendSOTW({week: week});
                        //add student Id to SOTW document
                        newSOW.student = student;
                        newSOW.save()
                        res.status(200).json({data: "Student Added"})
                    }else{
                            //to get results with highest score
                            const resultWithHighestScores = frontEndStudents.filter((result)=> result.total === highestScore);
                        //check improvement for each student
                        if(week >= 2){
                            // Find the most improved student in a single pass
                            let maxImprovement = -Infinity;
                            let mostImprovedStudents = [];
                            for (const rating of resultWithHighestScores) {
                                if (rating.student.allRatings && rating.student.allRatings.length >= 2) {
                                    const ratingsId = rating.student.allRatings.slice(-2); // [previous, latest]
                                    const values = await Promise.all(
                                        ratingsId.map(async (ratingId) => {
                                            const found = await ratings.findById(ratingId).lean().exec();
                                            return found ? found.total : 0;
                                        })
                                    );
                                    const improvement = values[1] - values[0];
                                    if (values[1] > values[0]) {
                                        if (improvement > maxImprovement) {
                                            maxImprovement = improvement;
                                            mostImprovedStudents = [rating];
                                        } else if (improvement === maxImprovement) {
                                            mostImprovedStudents.push(rating);
                                        }
                                    }
                                }
                            }
                            if (mostImprovedStudents.length === 1) {
                                const studentId = mostImprovedStudents[0].student?._id;
                                const student = await users.findById(studentId);
                                const newSOW = await frontendSOTW({week: week});
                                newSOW.student = student;
                                newSOW.save()
                                res.status(200).json({data: "Student Added"});
                            } else if (mostImprovedStudents.length > 1) {
                                // Pick randomly among most improved
                                const index = Math.floor(Math.random() * mostImprovedStudents.length);
                                const studentId = mostImprovedStudents[index].student?._id;
                                const student = await users.findById(studentId);
                                const newSOW = await frontendSOTW({week: week});
                                newSOW.student = student;
                                newSOW.save()
                                res.status(200).json({data: "Student Added"});
                            } else {
                                // If no improved students, pick randomly from all candidates
                                const index = Math.floor(Math.random() * resultWithHighestScores.length);
                                const studentId = resultWithHighestScores[index].student?._id;
                                const student = await users.findById(studentId);
                                const newSOW = await frontendSOTW({week: week});
                                newSOW.student = student;
                                newSOW.save()
                                res.status(200).json({data: "Student Added"});
                            }
                        } else {
                            // If week < 2, pick randomly from highest score candidates only
                            const index = Math.floor(Math.random() * resultWithHighestScores.length);
                            const studentId = resultWithHighestScores[index].student?._id;
                            const student = await users.findById(studentId);
                            const newSOW = await frontendSOTW({week: week});
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"});
                        }
                    }
                }else{
                    res.status(400).json({message: `There is a SOTW for week: ${week} already`})
                }
            }else{
                res.status(400).json({message: "there are no students yet"})
            }
            
        }catch(err){
            next(ApiError.badRequest(`${err}`))
        }
    },
    "chooseBackEndSOTW": async function(req, res, next){
        try{
            //get week to be used
            const week = req.body.week
            //get all results for the week
            const resultsForWeek = await ratings.find().where("week").equals(`${week}`).populate("student");
            const backEndStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Back End") && (result?.student?.role === "student"));
            // If there are no backend students for the week, return an error
            if (backEndStudents.length === 0) {
                return res.status(400).json({message: "there are no students yet"});
            }
            const arrayOfTotalScores = backEndStudents.map((rating)=> rating.total);
            const highestScore = Math.max(...arrayOfTotalScores);
            const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore);
            const check = await backendSOTW.find().where("week").equals(`${week}`);
            // If a SOTW already exists for this week, return an error
            if (check.length !== 0) {
                return res.status(400).json({message: `There is a SOTW for week: ${week} already`});
            }
            // If only one student has the highest score, select them as SOTW
            if (highScoreArray.length === 1) {
                const resultWithHighestScore = backEndStudents.filter((result)=> result.total === highestScore);
                const studentId = resultWithHighestScore[0].student?._id;
                const student = await users.findById(studentId);
                const newSOW = await backendSOTW({week: week});
                newSOW.student = student;
                newSOW.save();
                return res.status(200).json({data: "Student Added"});
            } else {
                // If multiple students have the highest score
                const resultWithHighestScores = backEndStudents.filter((result)=> result.total === highestScore);
                // If it's week 2 or later, check for most improved student
                if (week >= 2) {
                    let maxImprovement = -Infinity;
                    let mostImprovedStudents = [];
                    for (const rating of resultWithHighestScores) {
                        if (rating.student.allRatings && rating.student.allRatings.length >= 2) {
                            const ratingsId = rating.student.allRatings.slice(-2);
                            const values = await Promise.all(
                                ratingsId.map(async (ratingId) => {
                                    const found = await ratings.findById(ratingId).lean().exec();
                                    return found ? found.total : 0;
                                })
                            );
                            const improvement = values[1] - values[0];
                            // If the student improved from previous week
                            if (values[1] > values[0]) {
                                if (improvement > maxImprovement) {
                                    maxImprovement = improvement;
                                    mostImprovedStudents = [rating];
                                } else if (improvement === maxImprovement) {
                                    mostImprovedStudents.push(rating);
                                }
                            }
                        }
                    }
                    // If only one student is most improved, select them
                    if (mostImprovedStudents.length === 1) {
                        const studentId = mostImprovedStudents[0].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await backendSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    // If multiple students are equally most improved, pick randomly
                    } else if (mostImprovedStudents.length > 1) {
                        const index = Math.floor(Math.random() * mostImprovedStudents.length);
                        const studentId = mostImprovedStudents[index].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await backendSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    // If no students improved, pick randomly from highest scorers
                    } else {
                        const index = Math.floor(Math.random() * resultWithHighestScores.length);
                        const studentId = resultWithHighestScores[index].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await backendSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    }
                } else {
                    // If it's week 1, pick randomly from highest scorers
                    const index = Math.floor(Math.random() * resultWithHighestScores.length);
                    const studentId = resultWithHighestScores[index].student?._id;
                    const student = await users.findById(studentId);
                    const newSOW = await backendSOTW({week: week});
                    newSOW.student = student;
                    newSOW.save();
                    return res.status(200).json({data: "Student Added"});
                }
            }

        }catch(err){
            next(ApiError.badRequest(`${err}`))
        }
    },
    "chooseProductSOTW": async function(req, res, next){
        try{
            // Get week to be used
            const week = req.body.week
            // Get all results for the week
            const resultsForWeek = await ratings.find().where("week").equals(`${week}`).populate("student");
            // Find students in Product Design
            const productStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Product Design") && (result?.student?.role === "student"));
            // If there are no product design students for the week, return an error
            if (productStudents.length === 0) {
                return res.status(400).json({message: "there are no students yet"});
            }
            // Get array of total scores for all product students
            const arrayOfTotalScores = productStudents.map((rating)=> rating.total);
            // Find highest score
            const highestScore = Math.max(...arrayOfTotalScores);
            // Check if more than one student gets the highest score
            const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore);
            // Check if there is already a SOTW for that week
            const check = await productSOTW.find().where("week").equals(`${week}`);
            // If a SOTW already exists for this week, return an error
            if (check.length !== 0) {
                return res.status(400).json({message: `There is a SOTW for week: ${week} already`});
            }
            // If only one student has the highest score, select them as SOTW
            if (highScoreArray.length === 1) {
                const resultWithHighestScore = productStudents.filter((result)=> result.total === highestScore);
                const studentId = resultWithHighestScore[0].student?._id;
                const student = await users.findById(studentId);
                const newSOW = await productSOTW({week: week});
                newSOW.student = student;
                newSOW.save();
                return res.status(200).json({data: "Student Added"});
            } else {
                // If multiple students have the highest score
                const resultWithHighestScores = productStudents.filter((result)=> result.total === highestScore);
                // If it's week 2 or later, check for most improved student
                if (week >= 2) {
                    let maxImprovement = -Infinity;
                    let mostImprovedStudents = [];
                    for (const rating of resultWithHighestScores) {
                        if (rating.student.allRatings && rating.student.allRatings.length >= 2) {
                            const ratingsId = rating.student.allRatings.slice(-2);
                            const values = await Promise.all(
                                ratingsId.map(async (ratingId) => {
                                    const found = await ratings.findById(ratingId).lean().exec();
                                    return found ? found.total : 0;
                                })
                            );
                            const improvement = values[1] - values[0];
                            // If the student improved from previous week
                            if (values[1] > values[0]) {
                                if (improvement > maxImprovement) {
                                    maxImprovement = improvement;
                                    mostImprovedStudents = [rating];
                                } else if (improvement === maxImprovement) {
                                    mostImprovedStudents.push(rating);
                                }
                            }
                        }
                    }
                    // If only one student is most improved, select them
                    if (mostImprovedStudents.length === 1) {
                        const studentId = mostImprovedStudents[0].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await productSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    // If multiple students are equally most improved, pick randomly
                    } else if (mostImprovedStudents.length > 1) {
                        const index = Math.floor(Math.random() * mostImprovedStudents.length);
                        const studentId = mostImprovedStudents[index].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await productSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    // If no students improved, pick randomly from highest scorers
                    } else {
                        const index = Math.floor(Math.random() * resultWithHighestScores.length);
                        const studentId = resultWithHighestScores[index].student?._id;
                        const student = await users.findById(studentId);
                        const newSOW = await productSOTW({week: week});
                        newSOW.student = student;
                        newSOW.save();
                        return res.status(200).json({data: "Student Added"});
                    }
                } else {
                    // If it's week 1, pick randomly from highest scorers
                    const index = Math.floor(Math.random() * resultWithHighestScores.length);
                    const studentId = resultWithHighestScores[index].student?._id;
                    const student = await users.findById(studentId);
                    const newSOW = await productSOTW({week: week});
                    newSOW.student = student;
                    newSOW.save();
                    return res.status(200).json({data: "Student Added"});
                }
            }

        }catch(err){
            next(ApiError.badRequest(`${err}`))
        }
    },
    "chooseStudentsOfTheMonth": async function(req, res, next){
        try{
            // Get all students per stack
            const frontEndStudents = await users.find({ role: "student", stack: "Front End" }).select('name _id');
            const backEndStudents = await users.find({ role: "student", stack: "Back End" }).select('name _id');
            const productDesignStudents = await users.find({ role: "student", stack: "Product Design" }).select('name _id');

            // Helper to get last four rating totals for a student
            async function getLastFourTotals(studentId) {
                const ratingsArr = await ratings.find({ student: studentId }).sort({ week: -1 }).limit(4);
                return ratingsArr.map(r => r.total);
            }

            // Build array of {id, name, average} for each stack
            const checkingArrayFront = await Promise.all(frontEndStudents.map(async (e) => {
                const lastFour = await getLastFourTotals(e._id);
                const sum = lastFour.reduce((p, v) => p + v, 0);
                const val = lastFour.length ? sum / lastFour.length : 0;
                return { id: e._id, name: e.name, average: val };
            }));
            const checkingArrayBack = await Promise.all(backEndStudents.map(async (e) => {
                const lastFour = await getLastFourTotals(e._id);
                const sum = lastFour.reduce((p, v) => p + v, 0);
                const val = lastFour.length ? sum / lastFour.length : 0;
                return { id: e._id, name: e.name, average: val };
            }));
            const checkingArrayProduct = await Promise.all(productDesignStudents.map(async (e) => {
                const lastFour = await getLastFourTotals(e._id);
                const sum = lastFour.reduce((p, v) => p + v, 0);
                const val = lastFour.length ? sum / lastFour.length : 0;
                return { id: e._id, name: e.name, average: val };
            }));


            function getHighestAverage(arr) {
                if (arr.length === 0) {
                  return null; // Return null if the array is empty
                }
                let highestAverageObject = arr[0]; // Initialize with the first object
                for (let i = 1; i < arr.length; i++) {
                    if (arr[i].average > highestAverageObject.average) {
                        highestAverageObject = arr[i]; // Update the highest average object
                    }
                }
                return highestAverageObject;
            }

            const frontendStudentOfTheMonth = getHighestAverage(checkingArrayFront)
            const backendStudentOfTheMonth = getHighestAverage(checkingArrayBack)
            const productDesignStudentOfTheMonth = getHighestAverage(checkingArrayProduct)

            const frontEndStudent = await users.findById(frontendStudentOfTheMonth.id);
            const backEndStudent = await users.findById(backendStudentOfTheMonth.id);
            const productDesignStudent = await users.findById(productDesignStudentOfTheMonth.id);
            //create an instance for SOTW
            const newSOWF = await frontendSOTW({week: req.body.week});
            const newSOWB = await backendSOTW({week: req.body.week});
            const newSOWP = await productSOTW({week: req.body.week});
            //add student Id to SOTW document
            newSOWF.student = frontEndStudent;
            newSOWF.save()
            newSOWB.student = backEndStudent;
            newSOWB.save()
            newSOWP.student = productDesignStudent;
            newSOWP.save()
            res.status(200).json({front: frontendStudentOfTheMonth, back: backendStudentOfTheMonth, product: productDesignStudentOfTheMonth})
        }catch(err){
            next(ApiError.badRequest(`${err}`))
        }
    },
    "setStudentsPosition": async function(req, res, next){
        try{
            const stacks = ["Front End", "Back End", "Product Design"];
            
            for (const stack of stacks) {
                // Get all students for the current stack, sorted by overallRating in descending order
                const students = await users.find({ role: "student", stack: stack })
                    .sort({ overallRating: -1 });
                
                // Update positions
                for (let i = 0; i < students.length; i++) {
                    const student = students[i];
                    student.position = i + 1; // Position starts from 1
                    await student.save();
                }
            }
            
            res.status(200).json({ message: "Student positions updated successfully for all stacks" });
        }catch(err){
            next(ApiError.badRequest(`${err}`))
        }
    }

}

module.exports = theAlgorithm;