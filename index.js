import express from "express"
import mongoose from "mongoose"
import dot from "dotenv"
import route from "./Routes/EmployeeR.js";
import cors from "cors"
import authRoute from "./Routes/auth.js";
import cookieparser from "cookie-parser"
import PostRoute from "./Routes/RequestRoute.js";
const app=express();
dot.config()
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://myjstar.vercel.app'], 
    credentials: true
}));
app.use(cookieparser())
const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
    console.error('MONGO_URL environment variable is not set.');
    process.exit(1);
}

mongoose.connect(mongoURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

app.use("/api",route)
app.use("/auth",authRoute)
app.use("/post",PostRoute)

app.listen(3001,()=>{
    console.log("listening")
})