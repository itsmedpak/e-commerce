import { syncOutbox } from "./outbox"

export const startOnlineSync = () => {
    const handleOnline = () => void syncOutbox()
    window.addEventListener("online", handleOnline)
    if (navigator.onLine) void syncOutbox()
    return () => window.removeEventListener("online", handleOnline)
}