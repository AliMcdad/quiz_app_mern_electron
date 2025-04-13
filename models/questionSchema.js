const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    mainQuestion:{
        type:String,
        required:true,
    },
    theme:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        required:true,
        enum:["beginner","intermediate","expert"]
    },
    answers:{
        type:[String],
        required:true,
    },
    correctAnswer:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("Question",questionSchema);