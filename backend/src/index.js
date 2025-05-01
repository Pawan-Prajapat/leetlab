import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/execute-code.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res)=>{
    res.send("Hello Guys welcome in leetlab 🔥");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);

app.listen(PORT , () => console.log(`server is runing on port ${PORT}`))