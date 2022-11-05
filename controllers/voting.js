const voteModel = require("../models/votes");
const ApiError = require("../error/ApiError");
const userModel = require("../models/users");

const addVote = async (req, res, next) =>{
    try{
        const {week} = req.body;
        const id = req.params.id;
        const userId = req.params.userId;
        const voteCheck = await voteModel.count();
        const whoCheck = await voteModel.find().where("byWho").equals(`${userId}`).count();
        const weekCheck = await voteModel.find({"byWho": `${userId}`}).where("week").equals(`${week}`).count();
        const votee = await userModel.findById(id);
        const voter = await userModel.findById(userId);

        if(voteCheck){
            if(whoCheck){
                if(weekCheck){
                    res.status(400).json({message: "can't vote twice this week!"})
                }else{
                    const vote = await voteModel(req.body);
                    vote.forWho = votee;
                    vote.byWho = voter;
                    vote.save()
                    res.status(200).json({message: "voted!"})
                }

            }else{
                const vote = await voteModel(req.body);
                vote.forWho = votee;
                vote.byWho = voter;
                vote.save()
                res.status(200).json({message: "voted!"})
            }
        }else{
                const vote = await voteModel(req.body);
                vote.forWho = votee;
                vote.byWho = voter;
                vote.save()
                res.status(200).json({message: "voted!!, collection was empty" })
        }
        
    }catch(err){
        next(ApiError.badRequest(`${err}`))
    }
}

const getVotes = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const week = req.params.week;
        const user = await userModel.find({"forWho": `${id}`}).where("week").equals(`${week}`)
        res.status()
    }catch(err){
        next(ApiError.badRequest)
    }
}

module.exports = {
    addVote
}