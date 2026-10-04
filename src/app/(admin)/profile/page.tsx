"use client"

import { useEffect, useState } from "react"
import ChangeAvatar from "../../components/profile/ChangeAvatar"

type Profile = {
    id: string
    name: string | null
    email: string
    phone: string | null
    avatarUrl: string | null
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch("/api/auth/profile", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store"
                })

                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.error || "Failed to load profile")

                setProfile(data)
            } catch (error) {
                console.error(error)
                setError(
                    error instanceof Error ? error.message : "Failed to load profile"
                )
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    if (loading)
        <main className="min-h-screen bg-zinc-50 px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="h-8 w-24 animate-pulse rounded bg-zinc-200" />
                <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-4 border-b border-zinc-100 px-6 py-6">
                        <div className="h-20 w-20 animate-pulse rounded-full bg-zinc-200" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                            <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="h-5 w-40 animate-pulse rounded bg-zinc-100 py-5" />

                        <div className="space-y-4 border-t border-zinc-100 py-5">
                            <div className="h-12 animate-pulse rounded bg-zinc-100" />
                            <div className="h-12 animate-pulse rounded bg-zinc-100" />
                            <div className="h-12 animate-pulse rounded bg-zinc-100" />
                        </div>
                    </div>
                </div>
            </div>
        </main>

    if (error)
        <main className="min-h-screen bg-zinc-50 px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            </div>
        </main>

    if (!profile) return null

    const initials =
        profile.name
            ?.trim()
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?"

    return <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Profile
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Manage your personal information.
                </p>
            </div>

            {/* Profile */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                {/* Avatar */}
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-6">
                    <div className="flex items-center gap-4">
                        {profile.avatarUrl ?
                            <img src={profile.avatarUrl}
                                alt={profile.name || "Profile picture"}
                                className="h-20 w-20 rounded-full object-cover"
                            />
                         : 
                            <div aria-hidden="true"
                                className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-xl font-medium text-white"
                            >
                                {initials}
                            </div>
                        }

                        <div>
                            <p className="font-medium text-zinc-900">
                                {profile.name || "Unnamed user"}
                            </p>

                            <ChangeAvatar
                                avatarUrl={profile.avatarUrl}
                                name={profile.name}
                                onUpdated={(avatarUrl) =>
                                    setProfile((current) =>
                                        current ? { ...current, avatarUrl } : current
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Personal information */}
                <div className="px-6">
                    <div className="py-5">
                        <h2 className="text-sm font-semibold text-zinc-900">
                            Personal information
                        </h2>
                    </div>

                    {/* Name */}
                    <div className="flex items-center justify-between border-t border-zinc-100 py-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Name
                            </p>
                            <p className="mt-1 text-sm text-zinc-900">
                                {profile.name || "Not set"}
                            </p>
                        </div>
                        <button type="button"
                            className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between border-t border-zinc-100 py-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Phone number
                            </p>

                            <p className="mt-1 text-sm text-zinc-900">
                                {profile.phone || "Not added"}
                            </p>
                        </div>

                        <button type="button"
                            className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between border-t border-zinc-100 py-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Email
                            </p>

                            <p className="mt-1 text-sm text-zinc-900">
                                {profile.email}
                            </p>
                        </div>

                        <span className="text-xs font-medium text-zinc-400">
                            Read-only
                        </span>
                    </div>
                </div>
            </section>
        </div>
    </main>
}

export default ProfilePage