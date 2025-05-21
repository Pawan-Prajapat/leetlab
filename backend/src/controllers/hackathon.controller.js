import { db } from "../libs/db.js";

export const getAllHackathon = async (req, res) => {
    try {
        const hackathons = await db.hackathon.findMany();
        if(!hackathons){
            return res.status(404).json({
                error: "No Hackathon Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "hackathons fetched successfully",
            hackathons
        })

    } catch (error) {
        console.error("Error in fetching hackathons ", error);
        res.status(500).json({error: "Error in fetching hakcathons"});
    }
}
export const getCurrUpHackathon = async (req, res) => {
    try {
        const curr_up_hackathons = await db.hackathon.findMany({
            where:{
                startTime:{
                    gte: now
                }
            },
            orderBy:{
                startTime: 'asc'
            }
        })

        if(!curr_up_hackathons){
            return res.status(404).json({error: "Current and Upcomming Hackathons not Found"});
        }
        res.status(200).json({
            success: true,
            message: "Current and Upcomming Hackathons",
            curr_up_hackathons
        })
    } catch (error) {
        console.error("Error in fetcht Current and Upcomming Hackathons",error);
        res.status(500).json({error: "Error in fetcht Current and Upcomming Hackathons"});
    }
}
export const getHackathonDetails = async (req, res) => {
    const {hackathonId} = req.params;
    try {
        const hackathon = await db.hackathon.findUnique({
            where:{
                id: hackathonId,
                orgId: req.user.id 
            },
            include:{
                problems:{
                    include:{
                        problem:true 
                    }
                },
                participants:{
                    include:{
                        user:true
                    }
                }
            }
        })

        if(!hackathon){
            return res.status(404).json({
                error: "Hackathon not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Hackathon fetched successfully",
            hackathon
        })
    } catch (error) {
        console.error("Failed to fetch hackathon ", error);
        res.status(500).json({error: "Failed to fetch hackathon"});
    }
}
export const createHackathon = async (req, res) => {
    const {name, description, startTime, endTime} = req.body;
    const orgId = req.user.id;

    try {
        const hackathon = await db.hackathon.create({
            data:{
                name,
                description,
                startTime,
                endTime,
                orgId 
            }
        })

        res.status(200).json({
            success: true,
            message: "Hackathon created successfully",
            hackathon
        })
    } catch (error) {
        console.error("Error in creating Hackathon", error);
        res.status(500).json({error: "Error in creating Hackathon"})
    }
}
export const addProblemToHackathon = async (req, res) => {
    const {hackathonId}  = req.params;
    const {problemIds} = req.body;
    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({error: "Invalid Or Missing problemIds"});            
        }

        const problemsInHackathon = await db.hackathonproblem.createMany({
            data: problemIds.map((problemId)=>({
                hackathonId,
                problemId
            }))
        })
        
        res.stauts(201).json({
            success:true,
            message: "Problems added to hackathon successfully",
            problemsInHackathon
        })
    } catch (error) {
        console.error("Error adding problems in hackathon",error),
        res.status(500).json({error: "Error adding problems in hackathon"});
    }
}
export const updateHackathon = async (req, res) => {
    const {hackathonId} = req.params;
    const {name, description, startTime, endTime} = req.body;
    try {
        const updateHackathon = await db.hackathon.update({
            where:{
                id: hackathonId 
            },
            data:{
                name, 
                description,
                startTime,
                endTime
            }
        });

        res.status(201).json({
            success: true,
            message: "Update hackathon successfully",
            updateHackathon
        })
    } catch (error) {
        console.error("Error in update hackathon", error);
        res.status(500).json({error: "Error in update hackathon"});
    }
}
export const deleteHackathon = async (req, res) => {
    const {hackathonId} = req.params;
    try {
        const deletedHackathon = await db.hackathon.delete({
            where:{
                id: hackathonId
            }
        });

        res.staus(200).json({
            success: true,
            message: "Hackathon delete successfully",
            deletedHackathon
        })
    } catch (error) {
        console.error("Error in deleting Hackathon ",error);
        res.status(500).json({error: "Error in deleting Hackathon"});
    }
}
export const removeProblemFromHackathon = async (req, res) => {
    const {hackathonId} = req.params;
    const {problemIds} = req.body;

    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({error: "Invalid or missing problemIds"})
        }
        const deleteProblems = await db.hackathonproblem.deleteMany({
            where:{
                hackathonId,
                problemId:{
                    in: problemIds
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "removed problem from hackathon successfully",
            deleteProblems
        })
    } catch (error) {
        console.error("Error in remove problem from hackathon ", error);
        res.status(500).json({error: "Error in remove problem form hackathon"});
    }
}