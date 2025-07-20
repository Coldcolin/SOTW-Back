const ratingsModel = require("../models/ratings");
const userDb = require("../models/users");
const ApiError = require("../error/ApiError");



const addRating = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const user = await userDb.findById(userID);
    const ratedStudent = await ratingsModel
      .find()
      .where("student")
      .equals(`${userID}`);
    const {
      punctuality,
      Assignments,
      classParticipation,
      classAssessment,
      personalDefense,
      week,
    } = req.body;

    const existingRating = await ratingsModel.findOne({
      student: userID,
      week: week,
    });
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Student has already been rated for this week" });
    } else {
      const theTotal =
        ((Number(punctuality) +
          Number(Assignments) +
          Number(personalDefense) +
          Number(classParticipation) +
          Number(classAssessment)) /
          500) *
        100;

      const rating = await ratingsModel({
        punctuality: punctuality,
        Assignments: Assignments,
        personalDefense: personalDefense,
        classParticipation: classParticipation,
        classAssessment: classAssessment,
        total: theTotal,
      });
      rating.week = week;
      user.weeklyRating = Math.round(theTotal * 10) / 10;

      
      function sumArray(arr) {
        let sum = 0;
        arr.forEach((item) => {
          sum += item;
        });
        return sum;
      }

      user.overallRating =
        Math.round((sumArray(user.allRatings) / user.allRatings.length) * 10) /
        10;
      rating.student = user;
      user.assessedForTheWeek = true;
      user.week = week;

      
      rating.save();
      user.allRatings.push(rating._id);
      user.save();

      res.status(200).json({ message: `rated successfully` });
    }
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

const addRatings = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await userDb.findById(studentId);
    if (!student) {
      return next(ApiError.notFound("Student not found"));
    }

    const {
      punctuality,
      Assignments,
      classParticipation,
      classAssessment,
      personalDefense,
      week,
    } = req.body;

    // Check if rating for this week already exists
    const existingRating = await ratingsModel.findOne({
      student: studentId,
      week,
    });
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Student has already been rated for this week" });
    }

    // Calculate total
    const total =
      (Number(punctuality) +
        Number(Assignments) +
        Number(personalDefense) +
        Number(classParticipation) +
        Number(classAssessment)) /
      5;

    // Save new rating
    const rating = new ratingsModel({
      punctuality,
      Assignments,
      personalDefense,
      classParticipation,
      classAssessment,
      total,
      week,
      student: studentId,
    });
    await rating.save();

    student.allRatings.push(rating._id)

    // Fetch all ratings again to update user fields
    const ratings = await ratingsModel.find({ student: studentId });
    const totals = ratings.map((r) => r.total);

    student.overallRating = totals.length
      ? totals.reduce((a, b) => a + b, 0) / totals.length
      : 0;


    const highestWeek = Math.max(...ratings.map((r) => r.week));
    const latestWeekRating = ratings.find((r) => r.week === highestWeek);
    student.weeklyRating = latestWeekRating ? latestWeekRating.total : 0;

    student.assessedForTheWeek = true;
    student.week = week;

    await student.save();

    res.status(200).json({ message: "Rated successfully", rating });
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

const getRatings = async (req, res, next) => {
  try {
    const id = req.params.id;
    const allRatings = await ratingsModel
      .find()
      .where("student")
      .equals(`${id}`);
    res.status(200).json({ data: allRatings });
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

const getRatingss = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const allRatings = await ratingsModel.find({ student: id });
  
      res.status(200).json({ data: allRatings });
    } catch (err) {
      next(ApiError.badRequest(`${err}`));
    }
  };
  

const deleteRatings = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const student = await userDb.findById(studentId);
    const week = req.params.week;
    const ratedStudent = await ratingsModel
      .find()
      .where("student")
      .equals(`${studentId}`);

    if (ratedStudent) {
      let toBeDeleted = ratedStudent.filter((i) => i.week === +week);
      let ratingId = toBeDeleted[0]?.id;
      let totalValue = toBeDeleted[0]?.total;
      let totalIndex = student.allRatings.indexOf(totalValue);
      if (totalIndex !== -1) {
        student.allRatings[totalIndex] = null;
      }

      student.allRatings.pull(null);
      // student.save()
      function sumArray(arr) {
        let sum = 0;
        arr.forEach((item) => {
          sum += item;
        });
        return sum;
      }
      student.overallRating =
        Math.round(
          (sumArray(student.allRatings) / student.allRatings.length) * 10
        ) / 10;
      // student.week =

      await ratingsModel.findByIdAndDelete(ratingId);

      const rated = await ratingsModel
        .find()
        .where("student")
        .equals(`${studentId}`);

      let weekValues = rated.map((i) => i.week);
      let highestValue = Math.max(...weekValues);
      let newHighest = rated.filter((i) => i.week === highestValue);
      // console.log("highestValue:", highestValue, "weekValues:", weekValues, "newHighest:", newHighest, "week:", week)
      if (+week > highestValue) {
        student.weeklyRating = newHighest[0].total;
      }
      student.assessedForTheWeek = false;
      student.save();

      res.status(200).json({ message: "Rating Deleted" });
      // console.log(week)
    }
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

const deleteRatingss = async (req, res, next) => {
  try {
    const { studentId, week } = req.params;

    const student = await userDb.findById(studentId);
    if (!student) return next(ApiError.notFound("Student not found"));

    const ratingToBeDeleted = await ratingsModel.findOne({
      student: studentId,
      week: Number(week),
    });
    if (!ratingToBeDeleted)
      return next(ApiError.notFound("Rating for specified week not found"));

    await ratingsModel.findByIdAndDelete(ratingToBeDeleted._id);

     //here's where we remove all reference from student's allRatings. sharp!
     student.allRatings = student.allRatings.filter(
        (id) => id.toString() !==toBeDeleted._id.toString()
    )
    const remainingRatings = await ratingsModel.find({ student: studentId });

    const validTotals = remainingRatings
      .map((r) => r.total)
      .filter((val) => typeof val === "number" && !isNaN(val));
    student.overallRating = validTotals.length
      ? (
          (validTotals.reduce((a, b) => a + b, 0) / validTotals.length)
        ) 
      : 0;

    const weeks = remainingRatings.map((r) => r.week);
    const highestWeek = weeks.length ? Math.max(...weeks) : null;
    if (highestWeek) {
      const mostRecent = remainingRatings.find((r) => r.week === highestWeek);
      student.weeklyRating = mostRecent.total;
    } else {
      student.weeklyRating = 0;
    }

    student.assessedForTheWeek = false;

    await student.save();

    res.status(200).json({ message: "Rating deleted and student updated" });
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

// ... existing code ...

const updateRating = async (req, res, next) => {
  try {
    const { studentId, week } = req.params;
    const {
      punctuality,
      Assignments,
      classParticipation,
      classAssessment,
      personalDefense,
    } = req.body;

    const student = await userDb.findById(studentId);
    if (!student) {
      return next(ApiError.notFound("Student not found"));
    }

    const rating = await ratingsModel.findOne({
      student: studentId,
      week: week,
    });
    if (!rating) {
      return next(ApiError.notFound("Rating not found for the specified week"));
    }

    // Update rating fields if provided
    if (punctuality !== undefined) rating.punctuality = punctuality;
    if (Assignments !== undefined) rating.Assignments = Assignments;
    if (classParticipation !== undefined)
      rating.classParticipation = classParticipation;
    if (classAssessment !== undefined) rating.classAssessment = classAssessment;
    if (personalDefense !== undefined) rating.personalDefense = personalDefense;

    // Recalculate total
    const newTotal =
      ((Number(rating.punctuality) +
        Number(rating.Assignments) +
        Number(rating.personalDefense) +
        Number(rating.classParticipation) +
        Number(rating.classAssessment)) /
        500) *
      100;
    rating.total = newTotal;

    // Update allRatings array
    const ratingIndex = student.allRatings.findIndex(
      (_, index) => index === rating.week - 1
    );
    if (ratingIndex !== -1) {
      student.allRatings[ratingIndex] = newTotal;
    }

    // Recalculate overallRating
    student.overallRating =
      Math.round(
        (student.allRatings.reduce((sum, val) => sum + val, 0) /
          student.allRatings.length) *
          10
      ) / 10;

    // Update weeklyRating if this is the most recent week
    const highestWeek = Math.max(
      ...student.allRatings.map((_, index) => index + 1)
    );
    if (parseInt(week) === highestWeek) {
      student.weeklyRating = Math.round(newTotal * 10) / 10;
    }

    await rating.save();
    await student.save();

    res
      .status(200)
      .json({ message: "Rating updated successfully", updatedRating: rating });
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

const updateRatings = async (req, res, next) => {
  try {
    const { studentId, week } = req.params;
    const {
      punctuality,
      Assignments,
      classParticipation,
      classAssessment,
      personalDefense,
    } = req.body;

    const student = await userDb.findById(studentId);
    if (!student) {
      return next(ApiError.notFound("Student not found"));
    }

    const rating = await ratingsModel.findOne({
      student: studentId,
      week: Number(week),
    });
    if (!rating) {
      return next(ApiError.notFound("Rating not found for the specified week"));
    }

    // Update fields if provided
    if (punctuality !== undefined) rating.punctuality = punctuality;
    if (Assignments !== undefined) rating.Assignments = Assignments;
    if (classParticipation !== undefined)
      rating.classParticipation = classParticipation;
    if (classAssessment !== undefined) rating.classAssessment = classAssessment;
    if (personalDefense !== undefined) rating.personalDefense = personalDefense;

    // Recalculate total
    rating.total =
      (Number(rating.punctuality) +
        Number(rating.Assignments) +
        Number(rating.classParticipation) +
        Number(rating.classAssessment) +
        Number(rating.personalDefense)) /
      5;

    await rating.save();

    // Fetch all ratings for recalculation
    const ratings = await ratingsModel.find({ student: studentId });

    const totals = ratings.map((r) => r.total);

    student.overallRating = totals.length
      ? totals.reduce((a, b) => a + b, 0) / totals.length
      : 0;

    const highestWeek = Math.max(...ratings.map((r) => r.week));
       
       if (Number(week) !== highestWeek) {
        return res.status(400).json({
          message: `You can only edit the most recent week's rating (week ${highestWeek})`
        });
      }
    const latestWeekRating = ratings.find((r) => r.week === highestWeek);
    student.weeklyRating = latestWeekRating ? latestWeekRating.total : 0;

    await student.save();

    res
      .status(200)
      .json({ message: "Rating updated successfully", updatedRating: rating });
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};

module.exports = {
  addRating,
  getRatings,
  deleteRatings,
  updateRating,
  addRatings
};
