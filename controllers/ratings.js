const ratingsModel = require("../models/ratings");
const userDb = require("../models/users");
const ApiError = require("../error/ApiError");

const addRating = async(req, res, next)=>{
    try{
        const userID = req.params.id;
        const user = await userDb.findById(userID);
        const { punctuality, Assignments, classParticipation, classAssessment,personalDefense, week } = req.body;
        const theTotal = ((Number(punctuality) + Number(Assignments) + Number(personalDefense)  + Number(classParticipation) + Number(classAssessment))/500)* 100;
        
        const rating = await ratingsModel({
            punctuality: punctuality,
            Assignments: Assignments,
            personalDefense: personalDefense,
            classParticipation: classParticipation,
            classAssessment: classAssessment,
            total: theTotal,
            week: week
        })

        user.allRatings.push(theTotal);
        function sumArray(arr){
            let sum = 0;
            arr.forEach(item => {sum += item})
            return sum
        }
        
        user.weeklyRating = Math.round(theTotal * 10)/ 10;
        user.overallRating = Math.round(((sumArray(user.allRatings))/ user.allRatings.length)* 10)/10;
        rating.student = user;
        
        user.save()
        rating.save()
        
        res.status(200).json({message: `rated successfully`})
    }catch(err){
        next(ApiError.badRequest(`${err}`));
    }
}

const getRatings = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const allRatings = await ratingsModel.find().where("student").equals(`${id}`);
        res.status(200).json({data: allRatings});

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

// const deleteRatings = async (req, res)=>{
//     try{
//         const id = req.params.id;
//         const rate = await ratingsModel.findById(id);
//         const studentId = rate.student;
//         const student = await userDb.findById(studentId);

//     }catch(err){
//         next(ApiError.badRequest(`${err}`))
//     }
// }

module.exports ={
    addRating,
    getRatings
}