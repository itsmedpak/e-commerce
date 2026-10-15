import { db } from "../db"

type AddFileInput = {
    blob: Blob
    fileName: string
    mimeType: string
    entityType: string
    entityId: string
}

export const addFile = async ({blob, fileName, mimeType, entityType, entityId}: AddFileInput) => {
    const id = crypto.randomUUID()
    await db.files.add({
        id, blob, fileName, mimeType, entityType, entityId, status: "pending", createdAt: Date.now()
    })
    return id
}

export const getFile = async (id: string) => db.files.get(id)
export const removeFile = async (id: string) => await db.files.delete(id)
export const markFileSynced = async (id: string) => await db.files.update(id, {status: "synced"})
export const getFiles = async () => db.files.toArray()