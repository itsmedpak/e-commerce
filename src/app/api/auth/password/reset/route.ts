import { NextResponse } from "next/server"
import { createHash } from "crypto"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const email = body.email
        const token = body.token
        const password = body.password
        if (typeof email !== "string" || typeof token !== "string" || typeof password !== "string")
            throw new HttpError("Invalid password reset request.", 400)

        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedEmail || !token || !password)
            throw new HttpError("Invalid password reset request.", 400)

        if (password.length < 8)
            throw new HttpError("Password must be at least 8 characters.", 400)

        const user = await prisma.user.findUnique({
            where: {email: normalizedEmail}
        })

        if (!user)
            throw new HttpError("Invalid or expired password reset link.", 400)

        if (!user.resetTokenHash || !user.resetTokenExpiresAt)
            throw new HttpError("Invalid or expired password reset link.", 400)

        if (user.resetTokenExpiresAt.getTime() <= Date.now())
            throw new HttpError("This password reset link has expired.", 400)

        const tokenHash = createHash("sha256").update(token).digest("hex")

        if (tokenHash !== user.resetTokenHash)
            throw new HttpError("Invalid or expired password reset link.", 400)

        const passwordHash = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordHash,
                resetTokenHash: null,
                resetTokenExpiresAt: null
            }
        })

        return NextResponse.json(
            {message: "Password has been reset successfully."}, {status: 200}
        )

    } catch (error) {
        console.error("Reset password error:", error)
        if (error instanceof HttpError)
            return NextResponse.json(
                { message: error.message}, { status: error.status }
            )
        return NextResponse.json(
            { message: "Something went wrong."}, { status: 500 }
        )
    }
}