import env from "dotenv"
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

const registerHost = async (req, res) => {

    // Validating the request using express-validator
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    // Accessing validated data
    const { name, email, phoneNumber, password } = req.body;
    
    try {
        // Checking for existing host with the same email
        const existingHost = await prisma.hosts.findUnique({
            where: { 
                email: email
            } 
        });
        
        // If host already exists, sending error
        if (existingHost) {    
            return res.status(400).json({ message: "Host already exists with this email" });
        }
        
        // If the host does not exist, inserting a new host record
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newHost = await prisma.hosts.create({
            data: {
                name: name,
                email: email,
                phone: phoneNumber,
                password: hashedPassword
            }
        });

        console.log("Successfully registerd host", newHost);
        res.redirect("/host");

    } 
    catch (error) {
        console.error("Error during host registration", error);
        res.status(500).send("Internal Server Error");
    } 
    finally {
        // Disconnecting Prisma Client after the request is handled
        await prisma.$disconnect();
    }
    
};

export { registerHost };