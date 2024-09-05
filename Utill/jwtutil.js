import jwt from "jsonwebtoken"
import { secrate } from "../db/jwtconfig.js"

export const generateToken=(user)=>{

    const payload={
        id:user._id,
        email:user.email,
        role:user.role,
        empid:user.empid
    }
    return jwt.sign(payload,secrate,{expiresIn:'1d'})
}

