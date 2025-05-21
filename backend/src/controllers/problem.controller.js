import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    // going to get all the data from the request body 
    const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body;
    // going to check user role once again
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "You are not allowed to create a problem" })
    }
    // Loop through each reference solution for different languages
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            const submissionsResults = await submitBatch(submissions);

            const tokens = submissionsResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Result --- ", result);
                console.log(`Testcase ${i + 1} and Language ${language} -------- result ${JSON.stringify(result.status.description)}`);
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` });
                }
            }
        }

        // save the problem to the database;

        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hints,
                editorial,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        })

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Creating problem"
        })
    }
}
export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();
        if (!problems) {
            return res.status(404).json({
                error: "No Problem found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Problems Fetched Successfully",
            problem: problems
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Fetching problem"
        })
    }
}
export const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique(
            {
                where: {
                    id
                }
            }
        )

        if (!problem) {
            return res.status(404).status({ error: "Problem not found" });
        }

        res.status(200).json({
            success: true,
            message: "Message Fetched by id Successfully",
            problem
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Fetching by id problem"
        })
    }
}
export const updateProblem = async (req, res) => {
    // id 
    const { id } = req.params;

    // going to check user role once again
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "You are not allowed to update a problem" })
    }

    const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body;


    // id ----> problem (condition)
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            const submissionsResults = await submitBatch(submissions);

            const tokens = submissionsResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Result --- ", result);
                console.log(`Testcase ${i + 1} and Language ${language} -------- result ${JSON.stringify(result.status.description)}`);
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` });
                }
            }
        }

        const updateProblem = await db.problem.update({
            where: {
                id
            },
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hints,
                editorial,
                testcases,
                codeSnippets,
                referenceSolutions
            }
        })

        return res.status(201).json({
            success: true,
            message: "Problem Updated successfully",
            problem: updateProblem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Updating problem"
        })
    }
}
export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique({ where: { id } });

        if (!problem) {
            return res.status(404).json({ error: "" })
        }
        await db.problem.delete({ where: { id } });

        res.status(200).json({
            success: true,
            message: "problem delete successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Deleting the problem"
        })
    }
}
export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        const problem = await db.problem.findMany({
            where:{
                solvedBy:{
                    some:{
                        userId: req.user.id
                    }
                }
            },
            include:{
                solvedBy:{
                    where:{
                        userId: req.user.id 
                    }
                }
            }
        })
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problem
        })
    } catch (error) {
        console.error("Error fetching problems : ",error);
        return res.status(500).json({
            error: "Failed to fetch problems"
        })
    }
}