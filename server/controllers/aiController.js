import OpenAI from "openai";
import { clerkClient, getAuth } from "@clerk/express";
import sql from "../configs/db.js";
import { v2 as cloudinary } from 'cloudinary';
import axios from "axios";
import fs from 'fs';

// Initialize OpenAI SDK pointed to Groq's endpoint
const AI = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
        }

        const response = await AI.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: parseInt(length) || 500,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: (Number(free_usage) || 0) + 1
                }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        console.error("Chef Error:", error.message);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
        }

        const response = await AI.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 100
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: (Number(free_usage) || 0) + 1
                }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        console.error("Chef Error:", error.message);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
        
        const formData = new FormData();
        formData.append('prompt', prompt);
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData , {
            headers: {"x-api-key": process.env.CLIPDROP_API_KEY}, 
            responseType: "arraybuffer"
        });

        const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;
        
        const {secure_url} = await cloudinary.uploader.upload(base64Image);
       
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
                  VALUES (${userId}, ${prompt}, ${secure_url}, 'image' ,${publish ?? false})`;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        console.error("Chef Error:", error.message);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
        
        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: "cloudinary_ai"
                }
            ]
        });
       
        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, 'Remove background from image' , ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        console.error("Chef Error:", error.message);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
        
        const {public_id} = await cloudinary.uploader.upload(image.path);
            
        const imageUrl = cloudinary.url(public_id, {
            transformation: [{effect: `gen_remove:${object}`}],
            resource_type: 'image'
        });
       
        const promptMessage = `Remove ${object} from image`;
        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, ${promptMessage} , ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        console.error("Chef Error:", error.message);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export const resumeReview = async (req, res) => {
    let parser = null;
    try {
        const { userId } = getAuth(req);
        const resume = req.file;
        const plan = req.plan;

        // 1. Check plan
        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
        
        // 2. Ensure file actually reached the server
        if (!resume) {
            return res.json({ success: false, message: "No resume file was received by the server." });
        }

        // 3. Check file size
        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file exceeds allowed size (5MB)." });
        }

        // 4. Safely check file path
        if (!resume.path || !fs.existsSync(resume.path)) {
            throw new Error(`File not found at path: ${resume.path}`);
        }
        const dataBuffer = fs.readFileSync(resume.path);

        // 5. Corrected pdf-parse v2 instantiation syntax
        const pdfModule = await import('pdf-parse');
        const PDFParse = pdfModule.PDFParse || pdfModule.default?.PDFParse;

        parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();

        if (!pdfData.text || pdfData.text.trim() === '') {
            throw new Error("Could not extract any text. The PDF might be scanned or image-based.");
        }

        // 6. Generate AI response with structured Markdown template
        const prompt = `Act as an expert technical recruiter. Review the following resume and provide highly constructive feedback. 
You MUST format your response exactly like this template using Markdown:

**Overall Impression:**
(Provide a brief 2-3 sentence summary of the resume's quality here)

**Strengths:**
* (Bullet point 1)
* (Bullet point 2)
* (Bullet point 3)

**Weaknesses:**
* (Bullet point 1)
* (Bullet point 2)

**Specific Suggestions:**
* (Actionable suggestion 1)
* (Actionable suggestion 2)

Resume content:\n\n${pdfData.text}`;
                
        const response = await AI.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;
       
        // 7. Save to database
        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, 'Review the uploaded resume' , ${content}, 'resume-review')`;

        // 8. Cleanup parser memory and temp file
        if (parser) {
            await parser.destroy();
        }
        if (resume.path && fs.existsSync(resume.path)) {
            fs.unlinkSync(resume.path);
        }

        res.json({ success: true, content });

    } catch (error) {
        if (parser) {
            try { await parser.destroy(); } catch (e) {}
        }
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit reached. Please wait 30 seconds." 
            });
        }
        
        console.error("🚨 Backend Review Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to parse PDF." }); 
    }
}