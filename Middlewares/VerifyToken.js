import jwt from "jsonwebtoken"
import { secrate } from "../db/jwtconfig.js";

export const verifyT=(req,res,next)=>{
    
  
    try{
        const cookie=req.headers.cookie;
        console.log("verify"+cookie)
        if(!cookie) return res.status(401).json({message:"please Login"})
            const actualtoken=cookie.split("=")[1].trim();
        
            if(!actualtoken) return res.json({message:"Can't Find Token"})
                
            jwt.verify(String(actualtoken),secrate,(err,user)=>{
                if(err) return res.status(401).json({message:err.message})
                req.id=user.id
                next();
            })
           
    }catch(err){
        return res.json({message:err.message})
    }
}