"use client"

import {ChangeEvent, useEffect, useRef, useState} from "react"
import ImageEditor from "../image-editor/ImageEditor"
import type { ImageEditState } from "../image-editor/image-editor.types"

type ChangeAvatarProps = {
    avatarUrl: string | null
    name: string | null
    onUpdated: (avatarUrl: string | null) => void
}

const ChangeAvatar = ({avatarUrl, name, onUpdated}: ChangeAvatarProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [editorFile, setEditorFile] = useState<File | null>(null)
    const [loadingCurrent, setLoadingCurrent] = useState(false)
    const [preview, setPreview] = useState<string | null>(avatarUrl)
    const [file, setFile] = useState<File | null>(null)
    const [originalFile, setOriginalFile] = useState<File | null>(null)
    const [editedFile, setEditedFile] = useState<File | null>(null)
    const [editState, setEditState] = useState<ImageEditState | null>(null)
    const [editingCurrent, setEditingCurrent] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:"))
                URL.revokeObjectURL(preview)
        }
    }, [preview])

    const resetState = () => {
        setPreview(avatarUrl)
        setFile(null)
        setOriginalFile(null)
        setEditedFile(null)
        setEditorFile(null)
        setEditState(null)
        setEditingCurrent(false)
        setError("")
    }

    const handleOpen = () => {
        resetState()
        setOpen(true)
    }

    const handleClose = () => {
        if (saving || loadingCurrent) return
        setOpen(false)
        resetState()
    }

    const validateFile = (selectedFile: File) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Please choose a JPG, PNG or WebP image.")
            return false
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB.")
            return false
        }
        return true
    }

    const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (!selectedFile) return
        event.target.value = ""
        if (!validateFile(selectedFile)) return
        setError("")
        setOriginalFile(selectedFile)
        setFile(selectedFile)
        setEditedFile(null)
        setEditState(null)
        setEditorFile(selectedFile)
        const nextPreview = URL.createObjectURL(selectedFile)
        setPreview(nextPreview)
    }

    const handleEditorCancel = () => {
        setEditorFile(null)
        setError("")
    }

    const handleEditorSave = async (editedFile: File, state: ImageEditState) => {
        if (editingCurrent) {
            try {
                setSaving(true)
                setError("")
                const formData = new FormData()
                formData.append("avatar", editedFile)
                const response = await fetch(
                    "/api/auth/profile/avatar", { method: "POST", body: formData}
                )
                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.error || "Failed to update profile picture.")

                onUpdated(data.avatarUrl)
                setEditorFile(null)
                setEditingCurrent(false)
                setOpen(false)
                resetState()
            } catch (error) {
                console.error("Save edited profile picture:", error)
                setError(
                    error instanceof Error ? error.message : "Failed to update profile picture."
                )
            } finally {
                setSaving(false)
            }
            return
        }

        setEditedFile(editedFile)
        setFile(editedFile)
        setEditState(state)
        const nextPreview = URL.createObjectURL(editedFile)
        setPreview(nextPreview)
        setEditorFile(null)
        setError("")
    }

    const handleEditCurrent = async () => {
        if (!avatarUrl || loadingCurrent || saving) return
        try {
            setLoadingCurrent(true)
            setEditingCurrent(true)
            setError("")
            const response = await fetch(avatarUrl, {cache: "no-store"})
            if (!response.ok)
                throw new Error("Failed to load current profile picture.")
            const blob = await response.blob()
            const file = new File(
                [blob], "profile-picture.jpg", { type: blob.type || "image/jpeg" }
            )
            setOriginalFile(file)
            setFile(file)
            setEditedFile(null)
            setEditState(null)
            setEditorFile(file)
        } catch (error) {
            console.error("Load current profile picture:", error)
            setEditingCurrent(false)
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load current profile picture."
            )
        } finally {
            setLoadingCurrent(false)
        }
    }

    const handleEditAgain = () => {
        if (!originalFile) return
        setError("")
        setEditorFile(originalFile)
    }

    const handleSave = async () => {
        if (!file) {
            setError("Please choose a profile picture.")
            return
        }
        try {
            setSaving(true)
            setError("")
            const formData = new FormData()
            formData.append("avatar", file)
            const response = await fetch(
                "/api/auth/profile/avatar",
                { method: "POST", body: formData}
            )
            const data = await response.json()
            if (!response.ok)
                throw new Error(data.error || "Failed to update profile picture.")

            onUpdated(data.avatarUrl)
            setOpen(false)
            resetState()
        } catch (error) {
            console.error("Profile picture update:", error)
            setError(
                error instanceof Error ? error.message : "Failed to update profile picture."
            )
        } finally {
            setSaving(false)
        }
    }

    return <>
        <div className="mt-1 flex items-center gap-3">
            <button type="button"
                onClick={handleOpen}
                className="cursor-pointer text-sm font-medium text-zinc-500 underline underline-offset-4 transition hover:text-zinc-900"
            >
                Change picture
            </button>

            {avatarUrl &&
                <button type="button"
                    onClick={handleEditCurrent}
                    disabled={loadingCurrent || saving}
                    className="cursor-pointer text-sm font-medium text-zinc-500 underline underline-offset-4 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loadingCurrent ? "Loading..." : "Edit picture"}
                </button>
            }
        </div>

        {open &&
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                onMouseDown={event => {
                    if (event.target === event.currentTarget)
                        handleClose()
                }}
            >
                <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Change profile picture
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Choose or edit a picture for your profile.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="h-32 w-32 overflow-hidden rounded-full bg-zinc-100">
                            {preview ?
                                <img src={preview}
                                    alt={
                                        name ? `${name} profile picture` : "Profile picture"
                                    }
                                    className="h-full w-full object-cover"
                                />
                                :
                                <div className="flex h-full w-full items-center justify-center text-3xl font-medium text-zinc-400">
                                    {name ?.trim() .charAt(0) .toUpperCase() || "?"}
                                </div>
                            }
                        </div>

                        <div className="mt-5 flex items-center gap-2">
                            <button type="button"
                                onClick={() => inputRef.current?.click() }
                                disabled={saving || loadingCurrent}
                                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {originalFile ? "Choose another image" : "Choose image"}
                            </button>

                            {originalFile && editedFile && (
                                <button type="button"
                                    onClick={handleEditAgain}
                                    disabled={saving}
                                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Edit again
                                </button>
                            )}
                        </div>

                        <input ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileSelected}
                            className="hidden"
                        />

                        <p className="mt-3 text-center text-xs text-zinc-400">
                            JPG, PNG or WebP · Maximum 5 MB
                        </p>
                    </div>

                    {error &&
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    }

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button"
                            onClick={handleClose}
                            disabled={saving || loadingCurrent}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button type="button"
                            onClick={handleSave}
                            disabled={!file || saving || loadingCurrent}
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        }

        {editorFile &&
            <ImageEditor
                file={editorFile}
                initialState={editState ?? undefined}
                onCancel={handleEditorCancel}
                onSave={handleEditorSave}
            />
        }

    </>
}

export default ChangeAvatar