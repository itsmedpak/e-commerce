import { createHash, randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export const POST = async (req: Request) => {
    console.log("Forgot password request received.")
    try {
        const body = await req.json()
        const email = body.email
        if (typeof email !== "string")
            throw new HttpError("Please enter a valid email address.", 400)
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail)
            throw new HttpError("Please enter a valid email address.", 400)
        const smtpHost = process.env.SMTP_HOST
        const smtpPort = Number(process.env.SMTP_PORT)
        const smtpUser = process.env.SMTP_USER
        const smtpPassword = process.env.SMTP_PASSWORD
        const appUrl = process.env.APP_URL

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !appUrl)
            throw new HttpError("Password reset email is not configured.", 500)

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail}
        })
        if (!user)
            throw new HttpError("No account found with this email address.", 404)
        const token = randomBytes(32).toString("base64url")
        const tokenHash = createHash("sha256").update(token).digest("hex")
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)
        await prisma.user.update({
            where: {id: user.id},
            data: {resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt}
        })
        const resetUrl = new URL(
            "/reset-password",
            appUrl
        )

        resetUrl.searchParams.set(
            "token",
            token
        )

        resetUrl.searchParams.set(
            "email",
            normalizedEmail
        )

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPassword}
        })
        await transporter.sendMail({
            from: `Your App <${smtpUser}>`,
            to: normalizedEmail,
            subject: "Reset your password",
            text: `Use this link to reset your password. ${resetUrl.toString()} This link expires in one hour. If you didn't request a password reset, you can safely ignore this email.`
        })
        return NextResponse.json(
            { message: "Password reset link has been sent." },
            { status: 200 }
        )

    } catch (error) {
        console.error("Forgot password error:", error)

        if (error instanceof HttpError)
            return NextResponse.json(
                { message: error.message}, { status: error.status }
            )

        return NextResponse.json( 
            { message: "Something went wrong..........."}, { status: 500 }
        )
    }
}