"use client"

import { getPasswordRules, isStrongPassword } from "@/lib/auth/password"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { SubmitEvent, useState } from "react"
import { PasswordRule } from "../components/password/PasswordRule"

const ResetPasswordPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const rules = getPasswordRules(password)
    const passedRules = Object.values(rules).filter(Boolean).length
    const strength = passedRules <= 2 ? "weak" : passedRules <= 4 ? "medium" : "strong"

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError("")
        setMessage("")

        if (!token || !email) {
            setError("This password reset link is invalid.")
            return
        }

        if (!password) {
            setError("Please enter your new password.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)

        try {
            const response = await fetch(
                "/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email, token, password
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Something went wrong.")
                return
            }

            setMessage("Password has been reset successfully.")
            setTimeout(() => {
                router.replace("/login")
            }, 1500)
        } catch (error) {
            console.error("Reset password request failed:", error)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!token || !email) {
        <main className="min-h-screen bg-zinc-100 px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Invalid reset link
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        This password reset link is invalid or incomplete.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-flex text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-900 hover:decoration-zinc-900"
                    >
                        Request a new reset link
                    </Link>

                </div>
            </div>
        </main>
    }

    return (
        <main className="min-h-screen bg-zinc-100 px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                            Reset your password
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                            Enter a new password for your account.
                        </p>
                    </div>
                    {error &&
                        <div role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    }
                    {message &&
                        <div role="status"
                            className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                        >
                            {message}
                        </div>
                    }
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-700"
                            >
                                New password
                            </label>

                            <input id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    setError("")
                                }}
                                disabled={loading}
                                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                            />
                        </div>
                        <div className="mt-5">
                            <label htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-zinc-700"
                            >
                                Confirm new password
                            </label>
                            <input id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value)
                                    setError("")
                                }}
                                disabled={loading}
                                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                            />
                        </div>
                        <div className="mt-4 space-y-2">
                            <PasswordRule passed={rules.hasMinLength} text="At least 8 characters" />
                            <PasswordRule passed={rules.hasUppercase} text="One Uppercase letter" />
                            <PasswordRule passed={rules.hasLowercase} text="One lowercase letter" />
                            <PasswordRule passed={rules.hasNumber} text="One number" />
                            <PasswordRule passed={rules.hasSpecial} text="One special character" />
                        </div>                        
                        <div className="mt-3">                            
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-500">
                                    Password strength
                                </span>
                                {password &&
                                    <span
                                        className={
                                            strength === "weak"
                                                ? "text-xs font-medium text-red-600"
                                                : strength === "medium"
                                                    ? "text-xs font-medium text-amber-600"
                                                    : "text-xs font-medium text-emerald-600"
                                        }
                                    >
                                        {strength === "strong"
                                            ? "Strong"
                                            : strength === "medium"
                                                ? "Medium"
                                                : "Weak"}
                                    </span>
                                }
                            </div>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div
                                        key={index}
                                        className={`h-1 flex-1 rounded-full transition ${
                                            index < passedRules
                                                ? strength === "weak"
                                                    ? "bg-red-500"
                                                    : strength === "medium"
                                                        ? "bg-amber-500"
                                                        : "bg-emerald-500"
                                                : "bg-zinc-200"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit"
                        disabled={loading || !isStrongPassword(password) || password !== confirmPassword}
                        className="mt-6 h-11 w-full rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Resetting..." : "Reset password"}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-900 hover:decoration-zinc-900"
                        >
                            ← Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default ResetPasswordPage