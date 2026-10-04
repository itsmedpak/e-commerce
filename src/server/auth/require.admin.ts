import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserFromSession } from "./session"

export const requireAdmin = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    if (!token) redirect("/login")
    const user = await getUserFromSession(token)
    if (!user) redirect("/login")
    return user
}