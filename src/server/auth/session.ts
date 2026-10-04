import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7

type CreateUserSessionOptions = {
  ipAddress?: string | null
  userAgent?: string | null
}

const createUserSession = async (userId: string, options?: CreateUserSessionOptions) => {
  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await prisma.userSession.create({
    data: {userId, tokenHash, expiresAt, ipAddress: options?.ipAddress, userAgent: options?.userAgent}
  })

  return {token, expiresAt}
}

const getUserFromSession = async (token: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const session = await prisma.userSession.findUnique({
      where: { tokenHash },
      include: {
          user: {
              select: {
                  id: true, name: true, email: true, status: true, phone:true, avatarUrl: true, createdAt: true, updatedAt: true
              }
          }
      }
  })

  if (!session) return null
  if (session.revokedAt) return null
  if (session.expiresAt <= new Date()) return null

  await prisma.userSession.update({
      where: { id: session.id }, data: { lastUsedAt: new Date() },
  })
  return session.user
}

const revokeUserSession = async (token: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  await prisma.userSession.updateMany({
    where: {tokenHash, revokedAt: null},
    data: {revokedAt: new Date()}
  })
}

export {createUserSession, getUserFromSession, revokeUserSession}