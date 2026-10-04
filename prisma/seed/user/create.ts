import bcrypt from "bcryptjs"
import { PrismaClient } from "@/generated/prisma/client"

const createAdmin = async(prisma: PrismaClient) => {
    const passwordHash = await bcrypt.hash("NavShanti@123", 12)
    const user = await prisma.user.upsert({
        where: {
            email: "itsmeozadpak@gmail.com",
        },
        update: {},
        create: {
            name: "Admin",
            email: "itsmeozadpak@gmail.com",
            passwordHash
        }
    })
    console.log("User ready:", user.email)
}

export default createAdmin