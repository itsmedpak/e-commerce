"use client"

import { SubmitEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { getPasswordRules, isStrongPassword} from "@/lib/auth/password"
import { PasswordRule } from "@/app/components/password/PasswordRule"
import Link from "next/link"

const ChangePasswordPage = () => {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const rules = getPasswordRules(newPassword)
    const passedRules = Object.values(rules).filter(Boolean).length
    const strength = passedRules <= 2 ? "Weak" : passedRules <= 4 ? "Medium" : "Strong"
    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.")
            return
        }
        if (!isStrongPassword(newPassword)) {
            setError("Please meet all password requirements.")
            return
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.")
            return
        }
        try {
            setLoading(true)
            const response = await fetch(
                "/api/auth/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ currentPassword, newPassword, confirmPassword})
                }
            )
            const data = await response.json()
            if (!response.ok) {
                setError( data.message || "Unable to change password.")
                return
            }
            setSuccess( data.message || "Password changed successfully.")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            setTimeout(() => {
                router.push("/admin")
            }, 1200)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
                <button type="button"
                    onClick={() => router.back()}
                    className="cursor-pointer mb-6 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Change password
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Update your account password to keep
                    your account secure.
                </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Current password */}
                    <div>
                        <label htmlFor="currentPassword"
                            className="mb-2 block text-sm font-medium text-zinc-800"
                        >
                            Current password
                        </label>

                        <input id="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(event) =>
                                setCurrentPassword(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            placeholder="Enter your current password"
                            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                        />
                    </div>

                    {/* New password */}
                    <div>
                        <label htmlFor="newPassword"
                            className="mb-2 block text-sm font-medium text-zinc-800"
                        >
                            New password
                        </label>

                        <input id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            placeholder="Enter your new password"
                            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                        />

                        {newPassword &&
                            <div className="mt-3">

                                {/* Strength label */}
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-500">
                                        Password strength
                                    </span>

                                    <span
                                        className={
                                            strength === "Strong"
                                                ? "text-xs font-semibold text-emerald-600"
                                                : strength === "Medium"
                                                    ? "text-xs font-semibold text-amber-600"
                                                    : "text-xs font-semibold text-red-500"
                                        }
                                    >
                                        {strength}
                                    </span>
                                </div>

                                {/* Strength bars */}
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map(
                                        (bar) =>
                                            <div key={bar}
                                                className={`h-1.5 flex-1 rounded-full ${
                                                    bar <= passedRules
                                                        ? strength === "Strong"
                                                            ? "bg-emerald-500"
                                                            : strength === "Medium"
                                                                ? "bg-amber-500"
                                                                : "bg-red-500"
                                                        : "bg-zinc-200"
                                                }`}
                                            />
                                    )}
                                </div>

                                {/* Rules */}
                                <ul className="mt-4 space-y-2">
                                    <PasswordRule passed={rules.hasMinLength} text="At least 8 characters"
                                    />
                                    <PasswordRule passed={rules.hasUppercase} text="One uppercase letter"
                                    />
                                    <PasswordRule passed={rules.hasLowercase} text="One lowercase letter"
                                    />
                                    <PasswordRule passed={rules.hasNumber} text="One number"
                                    />
                                    <PasswordRule passed={rules.hasSpecial} text="One special character"
                                    />
                                </ul>
                            </div>
                        }
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-zinc-800"
                        >
                            Confirm new password
                        </label>

                        <input id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            placeholder="Re-enter your new password"
                            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50 ${
                                confirmPassword &&
                                !passwordsMatch
                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                    : confirmPassword &&
                                        passwordsMatch
                                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                        : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                            }`}
                        />

                        {confirmPassword &&
                            !passwordsMatch &&
                                <p className="mt-2 text-xs text-red-500">
                                    Passwords do not match.
                                </p>
                            }
                    </div>

                    {/* Error */}
                    {error &&
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    }

                    {/* Success */}
                    {success &&
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                            {success}
                        </div>
                    }

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !currentPassword ||
                            !isStrongPassword(newPassword) ||
                            !passwordsMatch
                        }
                        className="cursor-pointer h-11 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                    >
                        {loading ? "Changing password..." : "Change password"}
                    </button>
                </form>

                {/* Forgot password */}
                <div className="mt-6 border-t border-zinc-100 pt-5 text-center">
                    <p className="text-sm text-zinc-500">
                        Forgot your current password?
                    </p>

                    <Link
                        href="/forgot-password"
                        className="mt-1 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 transition hover:text-zinc-600"
                    >
                        Reset it instead
                    </Link>
                </div>
            </div>
        </div>
    </main>
}

export default ChangePasswordPage