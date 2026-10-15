
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ?.replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .trim()

if (!projectId || !clientEmail || !privateKey)
    throw new Error("Firebase Admin environment variables are missing")

const app = getApps().length ? getApp()
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })

export const firebaseAdminAuth = getAuth(app)
