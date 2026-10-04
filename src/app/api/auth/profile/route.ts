import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromSession } from "@/server/auth/session"

export const GET = async () => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_session")?.value

        if (!token)
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )

        const user = await getUserFromSession(token)

        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        })
    } catch (error) {
        console.error("GET /api/auth/profile:", error)
        return NextResponse.json(
            { error: "Internal server error" }, { status: 500 }
        )
    }
}