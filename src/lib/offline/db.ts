import Dexie, { type Table } from "dexie"

type SyncState = {
    key: string
    value: string
}

type OutboxItem = {
    id: string
    type: string
    entityId: string
    payload: string
    status: "pending" | "syncing" | "failed"
    retryCount: number
    lastError?: string
    createdAt: number
    updatedAt: number
}

type OfflineFile = {
    id: string
    blob: Blob
    fileName: string
    mimeType: string
    entityType: string
    entityId: string
    status: "pending" | "synced"
    createdAt: number
}

class OfflineDatabase extends Dexie {
    syncState!: Table<SyncState, string>
    outbox!: Table<OutboxItem, string>
    files!: Table<OfflineFile, string>


    constructor() {
        super("ecommerce")

        this.version(1).stores({
            syncState: "key",
            outbox: "id, type, entityId, status, createdAt",
            files: "id, entityType, entityId, status, createdAt"
        })

    }
}

export const db = new OfflineDatabase()