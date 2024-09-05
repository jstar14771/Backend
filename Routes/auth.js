import express from "express"
import { Employee } from "../models/Employee.model.js";
import { generateToken } from "../Utill/jwtutil.js";
import { verifyT } from "../Middlewares/VerifyToken.js";
import { OfferLetter } from "../models/Offerletter.model.js";

const authRoute =express.Router()
const clearAllCookies = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return next();
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieArray = cookies.split(';').map(cookie => cookie.trim());

    cookieArray.forEach(cookie => {
        const cookieName = cookie.split('=')[0];
        res.cookie(cookieName, '', {
            path: '/',
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            expires: new Date(0)  
        });
    });

    next();
};

authRoute.post("/login",clearAllCookies,async(req,res)=>{

    const{empid,password}=req.body;
    try{

        const user =await Employee.findOne({empid})
        if(!user) return res.status(401).json({message:"User Not Found"})
        if(password!==user.password) return res.json({message:"Password Wrong"})
        
        const token =generateToken(user)
        if(req.cookies[user.id]){
            req.cookies[user.id]=""
        }
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',  
            secure: isProduction,  
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)  
        };
        res.cookie(String(user.id),token,cookieOptions)
        return res.json({message:"Login SuucessFull",user:user,token:token,role:user.role})
    }catch(err){
        return res.json({message:err.message})
    }
})

authRoute.get("/user",verifyT,async(req,res)=>{
    try {
        const user = await Employee.findById(req.id).populate('offerletter').populate("payslip").populate("post"); // Assuming `id` is available in `req.user`
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
})



authRoute.get('/logout', clearAllCookies, (req, res) => {
    res.json({ message: 'Logged out Successfull!' });
});




export default authRoute