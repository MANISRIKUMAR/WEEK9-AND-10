import exp from 'express'
import {connect} from "mongoose"
import { config } from 'dotenv';
import { UserApp } from './APIs/UserAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from './APIs/CommonAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import cors from "cors"
import cookieParser from "cookie-parser"
//read environment variables
config();
//create http server
const app=exp();
//add body parser middleware
app.use (exp.json())
//add cookie parser middleware (required for reading JWT from cookies)
app.use(cookieParser())
//add cors middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials: true
}))
//forward req to route handlers
app.use("/user-api",UserApp)
app.use("/author-api",authorRoute)
app.use("/common-api",commonRouter)
app.use("/admin-api",adminRoute)


//connect to db
async function connectDB() {
    try {
        await connect(process.env.DB_URL);
        console.log("connected to db successfully")
        //assign port
        const port=process.env.PORT || 5000;
        app.listen(port,()=>console.log(`app listening on port ${port}`))
    }catch(err){
        console.log("err in connection to db:" , err)
    }
    
}
connectDB()
//add error handling middleware
app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }
  // Auth errors from services
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});