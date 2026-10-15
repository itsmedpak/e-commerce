const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

if (!R2_PUBLIC_URL)
    throw new Error("R2_PUBLIC_URL is not configured")

export const getFileUrl = (key: string) => `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`