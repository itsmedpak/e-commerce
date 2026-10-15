"use client"

import { addFile, getFile } from "@/lib/offline/sync/files"
import { ChangeEvent, useState } from "react"

const OfflineTestPage = () => {
    const [message, setMessage] = useState("")
    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) return

        const id = await addFile({
            blob: file,
            fileName: file.name,
            mimeType: file.type,
            entityType: "test",
            entityId: "test-1"
        })

        const saved = await getFile(id)

        setMessage(
            saved ? `Saved: ${saved.fileName} (${saved.mimeType})` : "File not found"
        )
    }

    return <main className="p-8">
        <h1 className="mb-4 text-xl font-semibold">
            Offline Storage Test
        </h1>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {message &&
            <p className="mt-4 text-sm text-zinc-600">
                {message}
            </p>
        }
    </main>
}

export default OfflineTestPage