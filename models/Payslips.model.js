import mongoose, { mongo } from "mongoose";

const PayslipsModel=new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },
    MonthYear:{
        type:String,
        required:true
    },
    slip:{
        type:String,
        required:true
    }
})

export const Payslip=mongoose.model.Payslip || mongoose.model("Payslip",PayslipsModel)