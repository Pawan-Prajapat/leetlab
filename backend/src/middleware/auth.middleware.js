import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorised - No token provided"
            })
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorised - Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authenticating user ", error);
        res.status(500).json({
            error: "Error in authenticating user"
        })
    }
}


export const checkAdmin = async (req, res, next)=>{
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true 
            }
        })

        if(!user || user.role !== "ADMIN"){
            return res.status(403).json({
                message:"Access denied - Admins Only"
            })
        }
        next();
    } catch (error) {
        console.log("Error in checking admin ", error);
        res.status(500).json({
            error: "Error in checking admin"
        })
    }
}

export const checkOrg = async (req, res, next)=>{
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where:{
                id: userId
            },
            select:{
                role: true
            }
        })

        if(!user || user.role !== "ORG"){
            return res.status(403).json({
                message: "Access denied - Organization Only"
            })
        }
        next();
    } catch (error) {
        console.log("Error in checking org ", error);
        res.status(500).json({
            error: "Error in checking organization"
        })
    }
}

export const checkOrgOrAdmin = async (req, res, next)=>{
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where:{
                id: userId
            },
            select:{
                role: true
            }
        })

        if(!user || user.role !== "ORG" || user.role !== "ADMIN"){
            return res.status(403).json({
                message: "Access denied - Organization Or Admin Only"
            })
        }
        next();
    } catch (error) {
        console.log("Error in checking organization or admin ", error);
        res.status(500).json({
            error: "Error in checking organization or Admin"
        })
    }
}