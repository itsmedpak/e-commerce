import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromSession } from "@/server/auth/session"
import { prisma } from "@/lib/prisma"

export const POST = async (req: Request) => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_session")?.value
        if (!token)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        const user = await getUserFromSession(token)
        if (!user)
            return NextResponse.json({ error: "Unauthorized" },{ status: 401 })
        const body = await req.json()
        const {id, type, entityId, payload} = body

        if (typeof id !== "string" || typeof type !== "string" || typeof entityId !== "string" || payload === undefined)
            return NextResponse.json({ error: "Invalid sync payload" },{ status: 400 })

        switch (type) {
            case "profile.update": {
                if (typeof payload !== "object" || payload === null || Array.isArray(payload))
                    return NextResponse.json(
                        { error: "Invalid profile payload" }, { status: 400 }
                    )

                const data = payload as {
                    name?: unknown
                    phone?: unknown
                }

                const updateData: {
                    name?: string
                    phone?: string | null
                } = {}

                if (data.name !== undefined) {
                    if (typeof data.name !== "string")
                        return NextResponse.json(
                            { error: "Invalid name" }, { status: 400 }
                        )
                    updateData.name = data.name.trim()
                }

                if (data.phone !== undefined) {
                    if ( data.phone !== null && typeof data.phone !== "string")
                        return NextResponse.json(
                            { error: "Invalid phone" }, { status: 400 }
                        )

                    updateData.phone =
                        typeof data.phone === "string" ? data.phone.trim() : null
                }

                const existingOperation =
                    await prisma.syncOperation.findUnique({ where: { id }})

                if (existingOperation) {
                    if (existingOperation.userId !== user.id)
                        return NextResponse.json(
                            { error: "Invalid sync operation" }, { status: 403 }
                        )

                    if (existingOperation.status === "completed")
                        return NextResponse.json({
                            success: true, alreadyProcessed: true,
                        })
                }

                await prisma.$transaction(async (tx) => {
                    await tx.syncOperation.upsert({
                        where: { id },
                        create: {
                            id, userId: user.id, type, entityId, status: "processing"
                        },
                        update: {}
                    })

                    await tx.user.update({
                        where: { id: user.id },
                        data: {
                            ...updateData,
                            ...(updateData.phone !== undefined ? { phoneVerifiedAt: null } : {}),
                        }
                    })

                    await tx.syncOperation.update({
                        where: { id },
                        data: { status: "completed", completedAt: new Date()},
                    })
                })

                return NextResponse.json({
                    success: true, alreadyProcessed: false,
                })                

            }            
            default:
                return NextResponse.json({ error: "Unsupported sync operation" },{ status: 400 })
        }
    } catch (error) {
        console.error("POST /api/sync/outbox:", error)
        return NextResponse.json( { error: "Internal server error" },{ status: 500 } )
    }
}