import {
    getPendingOutbox,
    markOutboxSyncing,
    markOutboxFailed,
    removeFromOutbox,
} from "../stores/outbox"

let syncing = false

export const syncOutbox = async () => {
    if (syncing) return

    syncing = true

    try {
        const items = await getPendingOutbox()

        for (const item of items) {
            try {
                await markOutboxSyncing(item.id)

                const response = await fetch(
                    "/api/sync/outbox",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: item.id,
                            type: item.type,
                            entityId: item.entityId,
                            payload: JSON.parse(item.payload),
                        }),
                    }
                )

                if (!response.ok)
                    throw new Error(
                        `Sync failed: ${response.status}`
                    )

                await removeFromOutbox(item.id)
            } catch (error) {
                await markOutboxFailed(
                    item.id,
                    error instanceof Error
                        ? error.message
                        : "Unknown sync error"
                )
            }
        }
    } finally {
        syncing = false
    }
}