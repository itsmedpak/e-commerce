import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { getUserFromSession } from "@/server/auth/session"

class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export const POST = async (req: Request) => {
    try {
        /*
         * 1. Get session token
         */
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_session")?.value

        if (!token)
            throw new HttpError("Unauthorized.", 401)

        /*
         * 2. Validate session
         */
        const sessionUser = await getUserFromSession(token)

        if (!sessionUser)
            throw new HttpError("Unauthorized.", 401)

        /*
         * 3. Get current password hash
         *
         * getUserFromSession() intentionally does not return
         * passwordHash, so fetch it separately.
         */
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            select: { id: true, passwordHash: true }
        })

        if (!user)
            throw new HttpError("Unauthorized.", 401)

        /*
         * 4. Parse request body
         */
        const body = await req.json()

        const currentPassword = body.currentPassword
        const newPassword = body.newPassword
        const confirmPassword = body.confirmPassword

        /*
         * 5. Validate input types
         */
        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            typeof confirmPassword !== "string"
        ) {
            throw new HttpError("Invalid request.", 400)
        }

        /*
         * 6. Required fields
         */
        if (!currentPassword || !newPassword || !confirmPassword)
            throw new HttpError("Please fill in all password fields.", 400)

        /*
         * 7. Confirm new password
         */
        if (newPassword !== confirmPassword)
            throw new HttpError("New passwords do not match.", 400)

        /*
         * 8. Password policy
         */
        if (newPassword.length < 8)
            throw new HttpError("Password must be at least 8 characters.", 400)

        /*
         * 9. Verify current password
         */
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword, user.passwordHash
        )

        if (!isCurrentPasswordValid)
            throw new HttpError("Current password is incorrect.", 400)

        /*
         * 10. Prevent reusing current password
         */
        const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash)

        if (isSamePassword)
            throw new HttpError("New password must be different from your current.", 400)


        /*
         * 11. Hash new password
         */
        const passwordHash = await bcrypt.hash(newPassword, 12)

        /*
         * 12. Update password
         */
        await prisma.user.update({
            where: {id: user.id}, data: {passwordHash}
        })

        return NextResponse.json(
            { message: "Password changed successfully." }, { status: 200 }
        )
    } catch (error) {
        console.error("Change password error:", error)

        if (error instanceof HttpError)
            return NextResponse.json(
                { message: error.message }, { status: error.status }
            )

        return NextResponse.json(
            { message: "Something went wrong."}, { status: 500 }
        )
    }
}