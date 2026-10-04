import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const loginAdmin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({
        where: {email: normalizedEmail}
    })
    if (!user || !user.passwordHash) return null
    const passwordValid = await bcrypt.compare(password, user.passwordHash)
    if (!passwordValid) return null
    return user
}

export { loginAdmin }