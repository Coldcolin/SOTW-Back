require("dotenv").config({path: './config/index.env'})
const express =require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const apiErrorHandler = require("./error/api-error-handler.js")
const PORT = process.env.PORT || 6000
//middleware
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());


//database collection
const url = process.env.URL;
// const url = 'mongodb+srv://ColinDecorce:0000colin0000@cluster0.2wuo14s.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url,{useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
    app.listen(PORT, ()=> console.log(`Server on ${PORT} now up and db connected...`))
}).catch((err)=> console.log(`error connecting to db`));

//to display in the browser
app.get("/", async (req, res)=>{
    res.send("Student of the week platform")
});


//api routes
app.use("/users", require("./routes/users.js"));
app.use("/tutors", require("./routes/tutors"));
app.use("/rating", require("./routes/ratings"));
app.use("/vote", require("./routes/vote"));
app.use("/SOW", require("./routes/SOW"));
app.use("/BSOW", require("./routes/BSOW"));
app.use("/Alumni", require("./routes/Alumni"));

//algorithm route
app.use("/algo", require("./routes/SOTWAlgorithm"))


//error middleware
app.use(apiErrorHandler);