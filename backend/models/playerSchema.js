const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema= new Schema({

    name:{
        type:String,
        required:true,
    },
    score:{
        type:Number,
        required:true,
        default:0,
    }
})

module.exports=mongoose.model("Player",playerSchema);