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
            //find students in the Front end
            const frontEndStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Front End") && (result?.student?.role === "student"));
            res.status(200).json({data: frontEndStudents})
            // //If there are no students
            if(frontEndStudents.length !== 0){
                //Get array for all students scores
                const arrayOfTotalScores = frontEndStudents.map((student)=> student?.total)
                //Find Highest Score
                const highestScore = Math.max(...arrayOfTotalScores);
                //Check if more than one student gets the Highest score
                const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore)
                //check if there is already a SOTW for that week
                const check = await frontendSOTW.find().where("week").equals(`${week}`);
                if(check.length === 0){
                    //If the length of highScoreArray is 1, then make student SOTW else use other metrics
                    if(highScoreArray.length  === 1){
                        //to get result with highest score
                        const resultWithHighestScore = frontEndStudents.filter((result)=> result?.total === highestScore);
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
                        const resultWithHighestScores = frontEndStudents.filter((result)=> result?.total === highestScore);
                        //check improvement for each student
                        if(week >= 2){
                        const improvedStudents = resultWithHighestScores.filter((rating)=> {
                            //to get the last two values in the allRatings array
                            const values = rating?.student?.allRatings.slice(-2);
                            return (values[1] > values[0])
                        })

                        if(improvedStudents.length >= 1){
                            //to get id of Student with highest score
                            const index = Math.floor(Math.random() * improvedStudents.length)
                            // console.log(index)
                            const studentId = improvedStudents[index].student._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await frontendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }else{
                            const index = Math.floor(Math.random() * resultWithHighestScores.length);
                            const studentId = resultWithHighestScores[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await frontendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }
                        }else{
                            const index = Math.floor(Math.random() * frontEndStudents.length);
                            const studentId = frontEndStudents[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await frontendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
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
            //find students in the Front end
            const backEndStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Back End") && (result?.student?.role === "student"));
            //If there are no students
            if(backEndStudents.length !== 0){
            //Find Student/Students with the highest Score
            const arrayOfTotalScores = backEndStudents.map((student)=> student?.total)
            //Find Highest Score
            const highestScore = Math.max(...arrayOfTotalScores);
            //Check if more than one student gets the Highest score
            const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore)
            //check if there is already a SOTW for that week
        const check = await backendSOTW.find().where("week").equals(`${week}`);
            if(check.length === 0){
                //If the length of highScoreArray is 1, then make student SOTW else use other metrics
                if(highScoreArray.length  === 1){
                    //to get result with highest score
                    const resultWithHighestScore = backEndStudents.filter((result)=> result?.total === highestScore);
                    //to get id of Student with highest score
                    const studentId = resultWithHighestScore[0].student?._id
                    //find student from data base
                    const student = await users.findById(studentId);
                    //create an instance for SOTW
                    const newSOW = await backendSOTW({week: week});
                    //add student Id to SOTW document
                    newSOW.student = student;
                    newSOW.save()
                    res.status(200).json({data: "Student Added"})
                }else{
                    //to get results with highest score
                    const resultWithHighestScores = backEndStudents.filter((result)=> result?.total === highestScore);
                    //check improvement for each student
                    if(week >= 2){
                    const improvedStudents = resultWithHighestScores.filter((student)=> {
                        //to get the last two values in the allRatings array
                        const values = student?.student?.allRatings.slice(-2);
                        return (values[1] > values[0])
                    })

                        if(improvedStudents.length >= 1){
                            //to get id of Student with highest score
                            const index = Math.floor(Math.random() * improvedStudents.length)
                            // console.log(index)
                            const studentId = improvedStudents[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await backendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }else{
                            const index = Math.floor(Math.random() * resultWithHighestScores.length);
                            const studentId = resultWithHighestScores[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await backendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }
                    }else{
                        const index = Math.floor(Math.random() * backEndStudents.length);
                        const studentId = backEndStudents[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await backendSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
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
    "chooseProductSOTW": async function(req, res, next){
        try{
            //get week to be used
            const week = req.body.week
            //get all results for the week
            const resultsForWeek = await ratings.find().where("week").equals(`${week}`).populate("student");
            //find students in the Front end
            const backEndStudents = resultsForWeek.filter((result)=> (result?.student?.stack === "Product Design") && (result?.student?.role === "student"));
            //If there are no students
            if(backEndStudents.length !== 0){
            //Find Student/Students with the highest Score
            const arrayOfTotalScores = backEndStudents.map((student)=> student?.total)
            //Find Highest Score
            const highestScore = Math.max(...arrayOfTotalScores);
            //Check if more than one student gets the Highest score
            const highScoreArray = arrayOfTotalScores.filter((score)=> score === highestScore)
            //check if there is already a SOTW for that week
        const check = await productSOTW.find().where("week").equals(`${week}`);
            if(check.length === 0){
                //If the length of highScoreArray is 1, then make student SOTW else use other metrics
                if(highScoreArray.length  === 1){
                    //to get result with highest score
                    const resultWithHighestScore = backEndStudents.filter((result)=> result?.total === highestScore);
                    //to get id of Student with highest score
                    const studentId = resultWithHighestScore[0].student?._id
                    //find student from data base
                    const student = await users.findById(studentId);
                    //create an instance for SOTW
                    const newSOW = await productSOTW({week: week});
                    //add student Id to SOTW document
                    newSOW.student = student;
                    newSOW.save()
                    res.status(200).json({data: "Student Added"})
                }else{
                    //to get results with highest score
                    const resultWithHighestScores = backEndStudents.filter((result)=> result?.total === highestScore);
                    //check improvement for each student
                    if(week >= 2){
                    const improvedStudents = resultWithHighestScores.filter((student)=> {
                        //to get the last two values in the allRatings array
                        const values = student?.student?.allRatings.slice(-2);
                        return (values[1] > values[0])
                    })

                        if(improvedStudents.length >= 1){
                            //to get id of Student with highest score
                            const index = Math.floor(Math.random() * improvedStudents.length)
                            // console.log(index)
                            const studentId = improvedStudents[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await productSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }else{
                            const index = Math.floor(Math.random() * resultWithHighestScores.length);
                            const studentId = resultWithHighestScores[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await productSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
                        }
                    }else{
                        const index = Math.floor(Math.random() * backEndStudents.length);
                        const studentId = backEndStudents[index].student?._id
                            //find student from data base
                            const student = await users.findById(studentId);
                            //create an instance for SOTW
                            const newSOW = await productSOTW({week: week});
                            //add student Id to SOTW document
                            newSOW.student = student;
                            newSOW.save()
                            res.status(200).json({data: "Student Added"})
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
    }
}

module.exports = theAlgorithm;