const ratingsModel = require("../models/ratings");
const userDb = require("../models/users");
const ApiError = require("../error/ApiError");

const addRating = async(req, res, next)=>{
    try{
        const userID = req.params.id;
        const user = await userDb.findById(userID);
        const ratedStudent = await ratingsModel.find().where("student").equals(`${userID}`);
        const { punctuality, Assignments, classParticipation, classAssessment,personalDefense, week } = req.body;

        const existingRating = await ratingsModel.findOne({ student: userID, week: week });
        if (existingRating) {
            return res.status(400).json({ message: "Student has already been rated for this week" });
        }else{
            const theTotal = ((Number(punctuality) + Number(Assignments) + Number(personalDefense)  + Number(classParticipation) + Number(classAssessment))/500)* 100;
        
            const rating = await ratingsModel({
                punctuality: punctuality,
                Assignments: Assignments,
                personalDefense: personalDefense,
                classParticipation: classParticipation,
                classAssessment: classAssessment,
                total: theTotal,
            })
                rating.week = week
                user.weeklyRating = theTotal;

            user.allRatings.push(theTotal);
            function sumArray(arr){
                let sum = 0;
                arr.forEach(item => {sum += item})
                return sum
            }
            
            user.overallRating = ((sumArray(user.allRatings))/ user.allRatings.length);
            rating.student = user;
            user.assessedForTheWeek = true
            user.week = week
            
            user.save()
            rating.save()
            
            res.status(200).json({message: `rated successfully`})
        }
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

const deleteRatings = async (req, res, next)=>{
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
            student.overallRating = ((sumArray(student.allRatings))/ student.allRatings.length);
            // student.week = 

            await ratingsModel.findByIdAndDelete(ratingId);

            const rated = await ratingsModel.find().where("student").equals(`${studentId}`);

            let weekValues = rated.map((i)=> i.week);
            let highestValue = Math.max(...weekValues);
            let newHighest = rated.filter((i)=> i.week === highestValue);
            // console.log("highestValue:", highestValue, "weekValues:", weekValues, "newHighest:", newHighest, "week:", week)
            if (+week > highestValue){
                student.weeklyRating = newHighest[0].total
            }
            student.assessedForTheWeek = false;
            student.save()
            
            res.status(200).json({message: "Rating Deleted"});
            // console.log(week)
        }
        

    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

// ... existing code ...

const updateRating = async (req, res, next) => {
    try {
        const { studentId, week } = req.params;
        const { punctuality, Assignments, classParticipation, classAssessment, personalDefense } = req.body;

        const student = await userDb.findById(studentId);
        if (!student) {
            return next(ApiError.notFound('Student not found'));
        }

        const rating = await ratingsModel.findOne({ student: studentId, week: week });
        if (!rating) {
            return next(ApiError.notFound('Rating not found for the specified week'));
        }

        // Update rating fields if provided
        if (punctuality !== undefined) rating.punctuality = punctuality;
        if (Assignments !== undefined) rating.Assignments = Assignments;
        if (classParticipation !== undefined) rating.classParticipation = classParticipation;
        if (classAssessment !== undefined) rating.classAssessment = classAssessment;
        if (personalDefense !== undefined) rating.personalDefense = personalDefense;

        // Recalculate total
        const newTotal = ((Number(rating.punctuality) + Number(rating.Assignments) + Number(rating.personalDefense) + Number(rating.classParticipation) + Number(rating.classAssessment)) / 500) * 100;
        rating.total = newTotal;

        // Update allRatings array
        const ratingIndex = student.allRatings.findIndex((_, index) => index === rating.week - 1);
        if (ratingIndex !== -1) {
            student.allRatings[ratingIndex] = newTotal;
        }

        // Recalculate overallRating
        student.overallRating = Math.round((student.allRatings.reduce((sum, val) => sum + val, 0) / student.allRatings.length) * 10) / 10;

        // Update weeklyRating if this is the most recent week
        const highestWeek = Math.max(...student.allRatings.map((_, index) => index + 1));
        if (parseInt(week) === highestWeek) {
            student.weeklyRating = Math.round(newTotal * 10) / 10;
        }

        await rating.save();
        await student.save();

        res.status(200).json({ message: 'Rating updated successfully', updatedRating: rating });
    } catch (err) {
        next(ApiError.badRequest(`${err}`));
    }
};


module.exports ={
    addRating,
    getRatings,
    deleteRatings,
    updateRating
}