import express from "express"

import { Post } from "../models/Post.model.js";
import { AllPosts } from "../models/AllPost.model.js";
import { verifyT } from "../Middlewares/VerifyToken.js";
import { Employee } from "../models/Employee.model.js";

const PostRoute =express.Router();

PostRoute.post("/createReq", verifyT, async (req, res) => {
    const { subject, reason, leave, rejoin } = req.body;

    try {
        const employee = await Employee.findById(req.id);

        if (!employee) return res.status(404).json({ message: "Employee Not Found" });

        const newPost = new Post({
            subject,
            reason,
            fromDate: leave,
            toDate: rejoin,
            employee: employee._id
        });

        const saved = await newPost.save();

        let allposts = await AllPosts.findOne(); 

        if (!allposts) {
            allposts = new AllPosts({ posts: [] }); // Initialize posts array
        }

        // Ensure posts property is an array
        if (!Array.isArray(allposts.posts)) {
            allposts.posts = [];
        }

        allposts.posts.push(saved._id);

        await allposts.save();

        await Employee.findByIdAndUpdate(employee._id,{
            $push:{post:saved._id}
          },{new:true})

        return res.json({ message: "Request Sent Successfully" });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: error.message });
    }
});

PostRoute.get("/emp/posts",verifyT, async (req, res) => {

    try {
        const employee = await Employee.findById(req.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        
        const posts = await Post.find({ employee:employee._id }).sort({createdAt:-1}).populate({
            path: 'employee', 
            select: 'name empid email' 
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this employee" });
        }

        res.status(200).json(posts); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
PostRoute.get("/allposts", async (req, res) => {
    try {
        const allPosts = await AllPosts.findOne().populate({
            path: 'posts',
            options: { sort: { createdAt: -1 } },
            populate:{
                path:"employee",
                select:"name empid _id email"
            }
        });

        if (!allPosts || allPosts.posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(allPosts.posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
PostRoute.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('employee', 'name empid email');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  PostRoute.put('/updateStatus/:id', async (req, res) => {
    const { status } = req.body;
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({message:"updated Successfully!"});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
export default PostRoute

