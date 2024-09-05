import mongoose from "mongoose";

const AllPostModel=new mongoose.Schema({
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    }]
})

export const AllPosts=mongoose.model.AllPosts || mongoose.model("AllPosts",AllPostModel)