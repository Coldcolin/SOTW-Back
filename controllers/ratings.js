const ratingsModel = require("../models/ratings");
const userDb = require("../models/users");
const ApiError = require("../error/ApiError");

const addRating = async(req, res, next)=>{
    try{
        const userID = req.params.id;
        const user = await userDb.findById(userID);
        const ratedStudent = await ratingsModel.find().where("student").equals(`${userID}`);
        const { punctuality, Assignments, classParticipation, classAssessment,personalDefense, week } = req.body;
        const theTotal = ((Number(punctuality) + Number(Assignments) + Number(personalDefense)  + Number(classParticipation) + Number(classAssessment))/500)* 100;
        
        const rating = await ratingsModel({
            punctuality: punctuality,
            Assignments: Assignments,
            personalDefense: personalDefense,
            classParticipation: classParticipation,
            classAssessment: classAssessment,
            total: theTotal,
        })

        if(ratedStudent){
            let toBeDeleted = ratedStudent.map((i)=> i.week);
            let highestValue = Math.max(...toBeDeleted);
            if(toBeDeleted.includes(week)){
                res.status(400).json({message: "week already saved"})
            }else if(week > highestValue){
                rating.week = week
                user.weeklyRating = Math.round(theTotal * 10)/ 10;
            }else{
                rating.week = week
            }
        }else{
            rating.week = week
            user.weeklyRating = Math.round(theTotal * 10)/ 10;
        }

        user.allRatings.push(theTotal);
        function sumArray(arr){
            let sum = 0;
            arr.forEach(item => {sum += item})
            return sum
        }
        
        
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

const deleteRatings = async (req, res)=>{
    try{
        const studentId = req.params.studentId;
        const student = await userDb.findById(studentId);
        const week = req.params.week;
        const ratedStudent = await ratingsModel.find().where("student").equals(`${studentId}`);

        if(ratedStudent){
            let toBeDeleted = ratedStudent.filter((i)=> (i.week === +week))
            let ratingId = toBeDeleted[0]?.id;
            let totalValue = toBeDeleted[0]?.total;
            let totalIndex = student.allRatings.indexOf(totalValue);
            if (totalIndex !== -1) {
                student.allRatings[totalIndex] = null;
            };
            

            student.allRatings.pull(null);
            // student.save()
            function sumArray(arr){
                let sum = 0;
                arr.forEach(item => {sum += item})
                return sum
            }
            student.overallRating = Math.round(((sumArray(student.allRatings))/ student.allRatings.length)* 10)/10;

            await ratingsModel.findByIdAndDelete(ratingId);

            const rated = await ratingsModel.find().where("student").equals(`${studentId}`);

            let weekValues = rated.map((i)=> i.week);
            let highestValue = Math.max(...weekValues);
            let newHighest = rated.filter((i)=> i.week === highestValue);
            // console.log("highestValue:", highestValue, "weekValues:", weekValues, "newHighest:", newHighest, "week:", week)
            if (+week > highestValue){
                student.weeklyRating = newHighest[0].total
            }
            student.save()
            
            res.status(200).json({message: "Rating Deleted"});
            // console.log(week)
        }
        

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

module.exports ={
    addRating,
    getRatings,
    deleteRatings
}