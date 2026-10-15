import { cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function getAdminApp() {
    if (getApps().length) return getApp()

    const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    if (!b64) throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is missing")

    const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return initializeApp({ credential: cert(sa) })
}

export const getFirebaseAdminAuth = () => getAuth(getAdminApp())