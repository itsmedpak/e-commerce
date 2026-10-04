import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "admin_session"

const setSessionCookie = async (token: string, expiresAt: Date) => {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    })
}

export { setSessionCookie }