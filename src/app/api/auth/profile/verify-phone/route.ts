
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromSession } from "@/server/auth/session"
import { prisma } from "@/lib/prisma"
import { getFirebaseAdminAuth } from "@/lib/firebase.admin"

export const POST = async (req: Request) => {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get("admin_session")?.value

        if (!sessionToken)
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )

        const user = await getUserFromSession(sessionToken)

        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )

        const body = await req.json()

        if (typeof body.idToken !== "string" || !body.idToken)
            return NextResponse.json(
                { error: "Firebase ID token is required" }, { status: 400 }
            )
        
        const decodedToken = await getFirebaseAdminAuth()
            .verifyIdToken(body.idToken, true)
            .catch(() => null)

        if (!decodedToken)
            return NextResponse.json(
                { error: "Invalid or expired Firebase token" }, { status: 401 }
            )
    const verifiedPhone = decodedToken.phone_number

        if (!verifiedPhone)
            return NextResponse.json(
                { error: "Firebase token has no verified phone number" },
                { status: 400 }
            )

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                phone: verifiedPhone,
                phoneVerifiedAt: new Date(),
            },
            select: {
                id: true,
                phone: true,
                phoneVerifiedAt: true,
            },
        })

        return NextResponse.json({
            success: true,
            user: updatedUser,
        })
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "This phone number is already in use" },
                { status: 409 }
            )
        }

        console.error("POST /api/auth/profile/verify-phone:", error)

        return NextResponse.json(
            { error: "Phone verification failed" },
            { status: 401 }
        )
    }
}