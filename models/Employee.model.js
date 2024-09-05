import mongoose from "mongoose"

const employeeModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    empid:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    join:{
        type:String,
        required:true
    },
    password:{
        type:String,
        default:"Employee2007"
    },
    role:{
        type:String,
        required:true
    },
    offerletter:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OfferLetter",
        required:true
    }],
    payslip:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payslip",
        required:true
       }
    ],
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    }]
    
})

export const  Employee=mongoose.models.Employee || mongoose.model("Employee",employeeModel)