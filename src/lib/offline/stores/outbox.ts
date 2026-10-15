import { db } from "../db"

type AddOutboxInput = {
    type: string
    entityId: string
    payload: unknown
}

export const addToOutbox = async ({type, entityId, payload}: AddOutboxInput) => {
    const id = crypto.randomUUID()
    await db.outbox.add({
        id,
        type,
        entityId,
        payload: JSON.stringify(payload),
        status: "pending",
        retryCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })
    return id
}

export const getPendingOutbox = async () =>
    db.outbox
        .where("status")
        .anyOf("pending", "failed")
        .filter(item => item.retryCount < 5)
        .sortBy("createdAt")
        
export const removeFromOutbox = async (id: string) =>
    await db.outbox.delete(id)

export const markOutboxFailed = async (id: string, error: string) => {
    const item = await db.outbox.get(id)
    if (!item) return
    await db.outbox.update(id, {
        status: "failed",
        retryCount: item.retryCount + 1,
        lastError: error,
        updatedAt: Date.now()
    })
}

export const markOutboxSyncing = async (id: string) =>
    await db.outbox.update(id, { status: "syncing",  updatedAt: Date.now() })