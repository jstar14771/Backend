import express from "express"
import { Employee } from "../models/Employee.model.js";
import mongoose from "mongoose";
import { OfferLetter } from "../models/Offerletter.model.js";
import { Payslip } from "../models/Payslips.model.js";
import { Post } from "../models/Post.model.js";
const route=express.Router()

route.post("/addemployee",async(req,res)=>{
    const{empname,email,empid,mobile,joindate,emprole}=req.body;
    if(!empname || !email || !empid || !mobile || !joindate || !emprole) return res.status(202).json({message:"fill all details"})
    
   try{
    const already=await Employee.findOne({email,empid})
    if(already) return res.json({message:"Already exists"})
    const emp=new Employee({
        name:empname,empid,email,role:emprole,join:joindate,mobile
    })
    await emp.save();
    return res.json({status:200,message:"Successfully Added"})
   }catch(err){
       return res.json({message:err.message})
   }

   
    
})
route.get("/employees",async(req,res)=>{
    const emp= await Employee.find({ role: { $ne: 'admin' } })

    return res.json(emp)
})

route.get('/getEmployee/:id', async (req, res) => {
    try {
      const employeeId = req.params.id;
      const employee = await Employee.findById(employeeId).populate("offerletter").populate("payslip").populate("post")
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
route.post("/uploadOffer/:id",async(req,res)=>{
  const{url}=req.body;
  const id=req.params.id;
  
  try {
    const user=await Employee.findById(id);

  if(!user) return res.json({message:"User Not Found"});

  const newOffer=new OfferLetter({Offerurl:url,employee:user._id})

  const saved=await newOffer.save();

  await Employee.findByIdAndUpdate(user._id,{
    $push:{offerletter:saved._id}
  },{new:true})
  return res.json({message:"Uploaded Successfully"})
  } catch (error) {
    return res.json({message:error.message})
  }
})
route.post("/uploadPayslip/:id",async(req,res)=>{
  const{url,MonthYear}=req.body;
  const id=req.params.id;
  
  try {
    const user=await Employee.findById(id);

  if(!user) return res.json({message:"User Not Found"});

  const newSlip=new Payslip({slip:url,employee:user._id,MonthYear})

  const saved=await newSlip.save();

  await Employee.findByIdAndUpdate(user._id,{
    $push:{payslip:saved._id}
  },{new:true})
  return res.json({message:"Uploaded Successfully"})
  } catch (error) {
    return res.json({message:error.message})
  }
})

route.delete("/delete/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
      // Find the employee by ID
      const employee = await Employee.findById(employeeId)
          .populate('offerletter')
          .populate('payslip')
          .populate('post');

      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      if (employee.offerletter.length > 0) {
          for (const offerLetterId of employee.offerletter) {
              await OfferLetter.findByIdAndDelete(offerLetterId);
          }
      }

      if (employee.payslip.length > 0) {
          for (const payslipId of employee.payslip) {
              await Payslip.findByIdAndDelete(payslipId);
          }
      }

      
      if (employee.post.length > 0) {
          for (const postId of employee.post) {
              await Post.findByIdAndDelete(postId);
          }
      }

      
      await Employee.findByIdAndDelete(employeeId);

      return res.json({ message: "Employee deleted successfully" });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
  }
});


export default route