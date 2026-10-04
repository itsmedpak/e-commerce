
import { NextResponse } from "next/server"
import { loginAdmin } from "@/server/auth/login"
import { createUserSession } from "@/server/auth/session"
import { setSessionCookie } from "@/server/auth/cookie"
import { getLoginRateLimit, recordLoginAttempt} from "@/server/auth/rate.limit"

const POST = async (req: Request) => {
  try {
    const body = await req.json()
    const email = body.email
    const password = body.password

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Use only headers supplied by a trusted proxy.
    const forwardedFor = req.headers.get("x-forwarded-for")

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null

    const userAgent = req.headers.get("user-agent")

    // 1. Check email and IP limits independently.
    const rateLimit = await getLoginRateLimit(normalizedEmail, ipAddress)

    if (rateLimit.limited)
      return NextResponse.json(
        {
          message: "Too many failed attempts",
          attemptsRemaining: 0,
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )

    // 2. Authenticate credentials.
    const user = await loginAdmin(normalizedEmail, password)

    // 3. Invalid credentials.
    if (!user) {
      await recordLoginAttempt({email: normalizedEmail, ipAddress, success: false})

      // Recalculate immediately after recording failure.
      const updatedRateLimit = await getLoginRateLimit(normalizedEmail, ipAddress)

      if (updatedRateLimit.limited)
        return NextResponse.json(
          {
            message: "Too many failed attempts",
            attemptsRemaining: 0,
            retryAfter: updatedRateLimit.retryAfter,
          },
          { status: 429 }
        )

      return NextResponse.json(
        {
          message: "Invalid email or password",
          attemptsRemaining:
            updatedRateLimit.attemptsRemaining,
        },
        { status: 401 }
      )
    }

    // 4. Record successful authentication.
    await recordLoginAttempt({ email: normalizedEmail, ipAddress, success: true})

    // 5. Create session.
    const session = await createUserSession(user.id, {ipAddress, userAgent})

    // 6. Set session cookie.
    await setSessionCookie(session.token, session.expiresAt)

    return NextResponse.json({ success: true})
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      { message: "Something went wrong" }, { status: 500 }
    )
  }
}

export { POST }