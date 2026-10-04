import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

import { prisma } from "@/lib/prisma"
import { getUserFromSession } from "@/server/auth/session"

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
])

export async function POST(request: Request) {
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

        const formData = await request.formData()
        const file = formData.get("avatar")

        if (!(file instanceof File))
            return NextResponse.json(
                { error: "No image was provided." }, { status: 400 }
            )

        if (!ALLOWED_TYPES.has(file.type))
            return NextResponse.json(
                { error: "Only JPG, PNG, and WebP images are allowed."},
                { status: 400 }
            )

        if (file.size > MAX_FILE_SIZE)
            return NextResponse.json(
                { error: "Image size must be less than 5 MB."},
                { status: 400 }
            )

        const extension = ALLOWED_TYPES.get(file.type)!
        const filename = `${user.id}-${crypto.randomUUID()}.${extension}`
        const uploadDirectory = path.join(process.cwd(), "storage", "avatars")
        await mkdir(uploadDirectory, {recursive: true})
        const filePath = path.join(uploadDirectory, filename)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)
        const avatarUrl = `/api/auth/profile/avatar/${filename}`

        await prisma.user.update({
            where: {id: user.id},
            data: { avatarUrl },
        })

        return NextResponse.json({
            avatarUrl
        })
    } catch (error) {
        console.error("POST /api/auth/profile/avatar:", error)

        return NextResponse.json(
            { error: "Failed to upload profile picture." },
            { status: 500 }
        )
    }
}