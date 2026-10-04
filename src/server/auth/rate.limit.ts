
import { prisma } from "@/lib/prisma"

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_ATTEMPTS = 10

type RateLimitResult = {
  limited: boolean
  attemptsRemaining: number
  retryAfter: number
  emailAttempts: number
  ipAttempts: number
}

type AttemptWindow = {
  count: number
  retryAfter: number
}

/**
 * Calculates when a particular email/IP limit will expire.
 *
 * We need to wait until enough old attempts expire
 * for the count to fall below MAX_FAILED_ATTEMPTS.
 */
const calculateAttemptWindow = (timestamps: Date[], now: number): AttemptWindow => {
  const count = timestamps.length

  if (count < MAX_FAILED_ATTEMPTS)
    return { count, retryAfter: 0}


  // The attempt at this index must expire before
  // the number of active failed attempts drops below 10.
  const expirationIndex = count - MAX_FAILED_ATTEMPTS
  const retryAt = timestamps[expirationIndex].getTime() + WINDOW_MS

  return { count, retryAfter: Math.max(1, Math.ceil((retryAt - now) / 1000) + 1) }
}

/**
 * Checks email and IP limits independently.
 */
const getLoginRateLimit = async (
  email: string,
  ipAddress: string | null
): Promise<RateLimitResult> => {
  const now = Date.now()
  const since = new Date(now - WINDOW_MS)

  const emailAttemptsPromise = prisma.loginAttempt.findMany({
    where: {
      email,
      success: false,
      createdAt: {gte: since}
    },
    select: {createdAt: true},
    orderBy: { createdAt: "asc"}
  })

  const ipAttemptsPromise = ipAddress
    ? prisma.loginAttempt.findMany({
        where: {
          ipAddress,
          success: false,
          createdAt: {
            gte: since,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    : Promise.resolve([])

  const [emailAttempts, ipAttempts] = await Promise.all([
    emailAttemptsPromise, ipAttemptsPromise
  ])

  const emailWindow = calculateAttemptWindow(emailAttempts.map((attempt) => attempt.createdAt), now)

  const ipWindow = calculateAttemptWindow(
    ipAttempts.map((attempt) => attempt.createdAt), now
  )

  const limited = emailWindow.count >= MAX_FAILED_ATTEMPTS || ipWindow.count >= MAX_FAILED_ATTEMPTS

  // Both restrictions must expire before login is allowed.
  const retryAfter = limited
    ? Math.max(emailWindow.retryAfter, ipWindow.retryAfter)
    : 0

  const attemptsRemaining = Math.max(
    0,
    MAX_FAILED_ATTEMPTS - Math.max(emailWindow.count, ipWindow.count)
  )

  return {
    limited, attemptsRemaining, retryAfter, emailAttempts: emailWindow.count, ipAttempts: ipWindow.count
  }
}

/**
 * Records a login attempt.
 */
const recordLoginAttempt = async ({email, ipAddress, success}: {
  email: string
  ipAddress: string | null
  success: boolean
}) => {
  await prisma.loginAttempt.create({data: {email, ipAddress, success}})
}

export {getLoginRateLimit, recordLoginAttempt}
