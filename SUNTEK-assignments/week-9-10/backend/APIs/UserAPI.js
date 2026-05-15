//create mini express application app
import exp from 'express'
import { UserModel } from '../models/UserModel.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
export const UserApp=exp.Router();

//user api routes

import { register } from '../services/authService.js';

import { upload } from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

//create user
UserApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
    let cloudinaryResult;
    try {
        let userObj = req.body;
        
        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }

        // call existing register()
        const newUserObj = await register({
            ...userObj,
            role: "USER",
            profileImageUrl: cloudinaryResult?.secure_url,
        });
        res.status(201).json({ message: "user created successfully", payload: newUserObj });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err); // pass to error handler middleware
    }
})
//read all users
UserApp.get("/users",async(req,res)=>{
    //get all users from db
    const usersList=await UserModel.find({status:true});
    //send response
    res.status(200).json({message:"users ",payload:usersList})
})
//read a user by id
UserApp.get("/users/:id",async(req,res)=>{
    //get user id from req params
    let uid=req.params.id;
    //get user from db
    let user=await UserModel.findOne({_id:uid,status:true});
    //check user 
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    //send response
    res.status(200).json({message:"user found ",payload:user})
})
//soft delete a user  by id
UserApp.delete("/users/:id",async(req,res)=>{
    //get user id from req params
    let uid=req.params.id;
    //delete user from db
    let user=await UserModel.findByIdAndUpdate(uid,{$set:{status:false}});
    //check user
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    //send response
    res.status(200).json({message:"user deleted successfully"})
})

//activate user (change status to true)
//PUT (complete change )
//   PATCH when partial change (only one or two fields)
UserApp.patch("/users/:id",async(req,res)=>{
    //get user id from req params
    let uid=req.params.id;
    //find user and change status to false
    let user=await UserModel.findByIdAndUpdate(uid,{$set:{status:true}},{new:true});
    //send response
    res.status(200).json({message:"user activated successfully",payload:user})
})



//update a user by id 
UserApp.put("/users/:id",async(req,res)=>{
    //get user id from req params
    let uid=req.params.id;
    
    //get updated user data from req body
    let updatedUser=req.body;
    //update user in db
    let user=await UserModel.findByIdAndUpdate(uid,updatedUser,{new:true});
    //send response
    res.status(200).json({message:"user updated successfully",payload:user})
})

//Read all active articles (for USER profile page)
UserApp.get("/articles", verifyToken("USER"), async (req, res) => {
    const articles = await ArticleModel.find({ isArticleActive: true })
        .populate("author", "firstName email")
        .sort({ createdAt: -1 });
    res.status(200).json({ message: "articles", payload: articles });
})

//Add comment to article (for USER)
UserApp.put("/articles", verifyToken("USER"), async (req, res) => {
    const { articleId, comment } = req.body;
    const userId = req.user.userId;

    const article = await ArticleModel.findById(articleId);
    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }
    if (!article.isArticleActive) {
        return res.status(400).json({ message: "Cannot comment on a deleted article" });
    }

    //push comment to article
    article.comments.push({ user: userId, comment });
    await article.save();

    //return updated article with populated fields
    const updatedArticle = await ArticleModel.findById(articleId)
        .populate("author", "firstName email")
        .populate("comments.user", "firstName email");

    res.status(200).json({ message: "Comment added successfully", payload: updatedArticle });
})



