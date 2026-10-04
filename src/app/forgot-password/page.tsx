"use client"

import { useRouter } from "next/navigation"
import { SubmitEvent, useState } from "react"

const ForgotPasswordPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setMessage("")
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail) {
            setError("Please enter your email address.")
            return
        }
        setLoading(true)
        try {
            const response = await fetch("/api/auth/password/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail })
            })
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                setError(data.message || "Something went wrong.")
                return
            }
            setMessage(data.message)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return <main className="min-h-screen bg-zinc-100 px-4 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="mb-8">
                    <button type="button"
                        onClick={() => router.back()}
                        className="cursor-pointer mb-6 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                    >
                        ← Back
                    </button>                    
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Forgot password?
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Enter your email address and we'll send you a
                        password reset link.
                    </p>
                </div>

                {/* Error */}
                {error &&
                    <div role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                }

                {/* Success */}
                {message &&
                    <div role="status"
                        className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    >
                        {message}
                    </div>
                }

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label htmlFor="email"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value)
                                setError("")
                            }}
                            placeholder="you@example.com"
                            disabled={loading}
                            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit"
                        disabled={loading}
                        className="mt-6 h-11 w-full rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

            </div>
        </div>
    </main>
}

export default ForgotPasswordPage