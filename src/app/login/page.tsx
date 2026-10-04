import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserFromSession } from "@/server/auth/session"
import LoginForm from "../components/login/LoginPage"

const LoginPage = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    if (token) {
        const user = await getUserFromSession(token)
        if (user)
            redirect("/admin")
    }
    return <LoginForm />
}

export default LoginPage