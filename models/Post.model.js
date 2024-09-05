import mongoose from "mongoose"

const PostModel=new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    fromDate:{
        type:String,
        required:true
    },
    toDate:{
        type:String,
        required:true
    },
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    }
},{timestamps:true})

export const Post =mongoose.model.Post || mongoose.model("Post",PostModel)