    "use client"

    import { useEffect, useRef, useState } from "react"
    import ChangeAvatar from "../../components/profile/ChangeAvatar"
    import { queueOperation } from "@/lib/offline/sync/queue"
    import { auth } from "@/lib/firebase"
    import {RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult} from "firebase/auth"
    import { FirebaseError } from "firebase/app"

    type Profile = {
        id: string
        name: string | null
        email: string
        phone: string | null
        avatarUrl: string | null
        phoneVerifiedAt: string | null
    }

    const ProfilePage = () => {
        const [profile, setProfile] = useState<Profile | null>(null)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState("")
        const [editing, setEditing] = useState<"name" | "phone" | null>(null)
        const [editValue, setEditValue] = useState("")
        const [saving, setSaving] = useState(false)
        const [otp, setOtp] = useState("")
        const [sendingOtp, setSendingOtp] = useState(false)
        const [verifyingOtp, setVerifyingOtp] = useState(false)
        const [otpError, setOtpError] = useState("")
        const [otpSent, setOtpSent] = useState(false)
        const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
        const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
        const updateProfile = async (data: Partial<Pick<Profile, "name" | "phone">>) => {
            if (!profile) return
            await queueOperation({
                type: "profile.update",
                entityId: profile.id,
                payload: data
            })
            setProfile((current) =>
                current ? { ...current, ...data } : current
            )
        }
        const sendVerificationCode = async () => {
            const phone = profile?.phone?.trim()
            if (!phone) {
                setOtpError("Please save your phone number first.")
                return
            }
            if (profile?.phoneVerifiedAt) {
                setOtpError("This phone number is already verified.")
                return
            }
            setSendingOtp(true)
            setOtpError("")
            try {
                if (!recaptchaRef.current)
                    recaptchaRef.current = new RecaptchaVerifier(auth, "phone-recaptcha", {})
                const confirmationResult = await signInWithPhoneNumber(
                    auth, phone, recaptchaRef.current
                )
                setConfirmation(confirmationResult)
                setOtpSent(true)
            } catch (error) {
                console.error("Send phone verification code:", error)
                if (error instanceof FirebaseError) {
                    switch (error.code) {
                        case "auth/invalid-app-credential":
                            setOtpError("Invalid App Credential. Please try again later")
                            break
                        case "auth/too-many-requests":
                            setOtpError("Too many attempts. Please try again later.")
                            break
                        case "auth/operation-not-allowed":
                            setOtpError("Phone verification is not enabled for this region.")
                            break
                        default:
                            setOtpError("Could not send the code. Please try again.")
                    }
                } else {
                    setOtpError("An unexpected error occurred.")
                }

                recaptchaRef.current?.clear()
                recaptchaRef.current = null
            } finally {
                setSendingOtp(false)
            }
        }
        const verifyPhoneCode = async () => {
            if (!confirmation || !otp.trim()) {
                setOtpError("Please enter the verification code.")
                return
            }

            setVerifyingOtp(true)
            setOtpError("")

            try {
                const result = await confirmation.confirm(otp.trim())
                const idToken = await result.user.getIdToken()

                const response = await fetch("/api/auth/profile/verify-phone", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ idToken }),
                })

                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.error || "Phone verification failed")

                setProfile((current) =>
                    current
                        ? {
                            ...current,
                            phone: data.user.phone,
                            phoneVerifiedAt: data.user.phoneVerifiedAt,
                        }
                        : current
                )

                setOtp("")
                setOtpSent(false)
                setConfirmation(null)
                await auth.signOut()
            } catch (error) {
                console.error("Verify phone code:", error)
                setOtpError(
                    error instanceof Error
                        ? error.message
                        : "Invalid verification code. Please try again."
                )
            } finally {
                setVerifyingOtp(false)
            }
        }

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

            return () => {
                recaptchaRef.current?.clear()
                recaptchaRef.current = null
            }
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
            profile.name ?.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?"

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
                                <ChangeAvatar avatarUrl={profile.avatarUrl}
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
                        <div className="border-t border-zinc-100 py-5">
                            {editing === "name" ?
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                        Name
                                    </p>
                                    <input type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                                    />
                                    <div className="mt-3 flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={async () => {
                                                setSaving(true)
                                                try {
                                                    await updateProfile({
                                                        name: editValue.trim() || null,
                                                    })
                                                    setEditing(null)
                                                } finally {
                                                    setSaving(false)
                                                }
                                            }}
                                            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button type="button"
                                            disabled={saving}
                                            onClick={() => setEditing(null)}
                                            className="cursor-pointer text-sm font-medium text-zinc-500 transition hover:text-zinc-900 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            :
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                            Name
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-900">
                                            {profile.name || "Not set"}
                                        </p>
                                    </div>
                                    <button type="button"
                                        onClick={() => {
                                            setEditing("name")
                                            setEditValue(profile.name || "")
                                        }}
                                        className="cursor-pointer text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
                                    >
                                        Edit
                                    </button>
                                </div>
                            }
                        </div>
                        {/* Phone */}
                        <div className="border-t border-zinc-100 py-5">
                            {editing === "phone" ?
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                        Phone
                                    </p>
                                    <input type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                                    />
                                    <div className="mt-3 flex items-center gap-3">
                                        <button type="button"
                                            disabled={saving}
                                            onClick={async () => {
                                                setSaving(true)
                                                try {
                                                    await updateProfile({
                                                        phone: editValue.trim() || null
                                                    })
                                                    setEditing(null)
                                                } finally {
                                                    setSaving(false)
                                                }
                                            }}
                                            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button type="button"
                                            disabled={saving}
                                            onClick={() => setEditing(null)}
                                            className="cursor-pointer text-sm font-medium text-zinc-500 transition hover:text-zinc-900 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            :
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                            PHONE
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-900">
                                            {profile.phone || "Not set"}
                                        </p>
                                    </div>

                                    <button type="button"
                                        onClick={() => {
                                            setEditing("phone")
                                            setEditValue(profile.phone || "")
                                        }}
                                        className="cursor-pointer text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
                                    >
                                        Edit
                                    </button>
                                </div>
                            }
                            {profile.phone &&
                                <p className={`mt-1 text-xs ${
                                    profile.phoneVerifiedAt ? "text-green-700" : "text-amber-600"
                                }`}>
                                    {profile.phoneVerifiedAt ? "Verified" : "Not verified"}
                                </p>
                            }    
                            {!profile.phoneVerifiedAt && profile.phone &&
                                <div className="mt-4 space-y-3">
                                    {!otpSent ?
                                        <button type="button"
                                            onClick={sendVerificationCode}
                                            disabled={sendingOtp}
                                            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50"
                                        >
                                            {sendingOtp ? "Sending..." : "Send verification code"}
                                        </button>
                                        :
                                        <>
                                            <input type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                                            />

                                            <div className="flex items-center gap-3">
                                                <button type="button"
                                                    onClick={verifyPhoneCode}
                                                    disabled={verifyingOtp || otp.trim().length !== 6}
                                                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                                                >
                                                    {verifyingOtp ? "Verifying..." : "Verify code"}
                                                </button>
                                                <button type="button"
                                                    onClick={sendVerificationCode}
                                                    disabled={sendingOtp}
                                                    className="text-sm font-medium text-zinc-600 disabled:opacity-50"
                                                >
                                                    {sendingOtp ? "Sending..." : "Resend code"}
                                                </button>
                                            </div>
                                        </>
                                    }
                                    {otpError &&
                                        <p className="text-sm text-red-600">{otpError}</p>
                                    }
                                </div>
                            }                        
                        </div>
                        <div id="phone-recaptcha" />                    
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