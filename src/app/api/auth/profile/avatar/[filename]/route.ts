import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readFile } from "fs/promises"
import path from "path"

import { getUserFromSession } from "@/server/auth/session"

const ALLOWED_EXTENSIONS = new Set([
    "jpg", "jpeg", "png", "webp",
])

const CONTENT_TYPES: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp"
}

type RouteContext = {
    params: Promise<{
        filename: string
    }>
}

const GET = async(_request: Request, { params }: RouteContext) => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_session")?.value
        if (!token)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        const user = await getUserFromSession(token)

        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )

        const { filename } = await params

        if ( !filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
            return NextResponse.json(
                { error: "Invalid filename." },
                { status: 400 }
            )
        }

        const extension = path.extname(filename).slice(1).toLowerCase()

        if (!ALLOWED_EXTENSIONS.has(extension)) {
            return NextResponse.json(
                { error: "Invalid image type." },
                { status: 400 }
            )
        }

        const avatarsDirectory = path.join(process.cwd(), "storage", "avatars")
        const filePath = path.join(avatarsDirectory, filename)
        const buffer = await readFile(filePath)

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": CONTENT_TYPES[extension],
                "Cache-Control": "private, max-age=3600",
            },
        })
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT")
            return NextResponse.json(
                { error: "Image not found." }, { status: 404 }
            )

        console.error("GET /api/auth/profile/avatar/[filename]:", error)

        return NextResponse.json(
            { error: "Failed to load image." }, { status: 500 }
        )
    }
}

export {GET}