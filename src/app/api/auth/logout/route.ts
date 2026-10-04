import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revokeUserSession } from "@/server/auth/session"

const POST = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    if (token)
      await revokeUserSession(token)
    const response = NextResponse.json({success: true})
    response.cookies.delete("admin_session")
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export { POST }