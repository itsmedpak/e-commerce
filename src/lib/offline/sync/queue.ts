import { addToOutbox } from "../stores/outbox"

type QueueOperationInput = {
    type: string
    entityId: string
    payload: unknown
}

export const queueOperation = async ({
    type,
    entityId,
    payload,
}: QueueOperationInput) =>
    addToOutbox({
        type,
        entityId,
        payload,
    })