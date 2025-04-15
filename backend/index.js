const express = require('express');
const app = express();
const cors = require('cors');
const questionRouter = require('./routes/quiz.route');


//1. Set up the database
const DB = require('./config/mongoDB').connectDB;
DB();



//Add necessary middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Routes
app.use("/api/questions", questionRouter);

//Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})

