"use client"
import { useEffect, useState, type SubmitEvent } from "react"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Credentials = {
    email: string
    password: string
}

type LoginFormProps = {
    /** Iconic image shown on the left. Falls back to an abstract dark panel. */
    onSubmit?: (credentials: Credentials) => Promise<void> | void
}

const formatCountdown = (seconds: number) => {
    const mnt = Math.floor(seconds / 60)
    const rmngScnds = seconds % 60
    return `${mnt.toString().padStart(2, "0")}:${rmngScnds.toString().padStart(2, "0")}`
}

const fieldWrap =
    "rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900"
const fieldLabel = "block text-xs text-zinc-500"
const fieldInput =
    "mt-0.5 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [retryAfter, setRetryAfter] = useState(0)
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)    
    const router = useRouter()
    const [errors, setErrors] = useState<{
        email?: string
        password?: string
        form?: string
    }>({})
    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors: typeof errors = {}
        if (!email.trim())
            newErrors.email = "Email is required."
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Enter a valid email address."
        if (!password)
            newErrors.password = "Password is required."
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setErrors({})
        try {
            setLoading(true)
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email: email.trim(), password})
            })
            const data = await response.json()
            if (response.status === 429) {
                setErrors({form: data.message})
                setAttemptsRemaining(0)
                setRetryAfter(data.retryAfter)
                return
            }
            if (response.status === 401) {
                setErrors({form: data.message})
                setAttemptsRemaining(data.attemptsRemaining)
                return
            }            
            if (!response.ok) {
                setErrors({ form:data.message ?? "Email or password is incorrect." })
                return
            }
            router.push("/admin")
            router.refresh()
        } catch {
            setErrors({
                form: "Unable to connect to the server.",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (retryAfter <= 0) return
        const timer = setInterval(() => {
            setRetryAfter((current) => {
                if (current <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return current - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [retryAfter])
    

    return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-100 px-4 py-12">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-zinc-200/70 blur-3xl" />
        <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 md:min-h-[30rem] md:grid-cols-2">
            <section className="relative h-48 overflow-hidden bg-zinc-950 md:h-auto">
                <img src={'/static/login_item.jpg'} alt='' className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3 md:bottom-8 md:left-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-semibold text-zinc-900 shadow-lg">
                        <img src={'/static/logo.webp'} alt='' className="absolute inset-0 h-full w-full object-contain" />
                    </div>
                </div>
            </section>
            {/* Right: login */}
            <section className="flex flex-col p-8 pb-0 md:p-10 md:pb-0">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Welcome back</h1>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
                    Sign in to manage your dashboard and see what's new.
                </p>
                <form className="mt-8 flex flex-1 flex-col" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-3">
                        <label htmlFor="email" className={`${fieldWrap} block cursor-text`}>
                            <span className={fieldLabel}>Email</span>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email)
                                        setErrors((prev) => ({
                                            ...prev, email: undefined
                                        }))
                                    
                                }}
                                placeholder="admin@example.com"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                className={fieldInput}
                            />

                            {errors.email &&
                                <p id="email-error"
                                    role="alert"
                                    className="mt-1 text-xs text-red-600"
                                >
                                    {errors.email}
                                </p>
                            }
                        </label>
                        <div className={`${fieldWrap} flex items-center gap-2`}>
                            <label htmlFor="password" className="block flex-1 cursor-text">
                                <span className={fieldLabel}>Password</span>
                                <input id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password)
                                            setErrors((prev) => ({
                                                ...prev, password: undefined
                                            }))
                                    }}
                                    placeholder="Enter your password"
                                    aria-invalid={!!errors.password}
                                    aria-describedby={
                                        errors.password ? "password-error" : undefined
                                    }
                                    className={fieldInput}
                                />
                                {errors.password &&
                                    <p id="password-error"
                                        role="alert"
                                        className="mt-1 text-xs text-red-600"
                                    >
                                        {errors.password}
                                    </p>
                                }
                            </label>
                            {/* eye button */}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <label className="flex cursor-pointer items-center gap-2 text-zinc-600">
                            <input type="checkbox"
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
                            />
                            Remember me
                        </label>
                        <Link href="/forgot-password"
                            className="text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-900 hover:decoration-zinc-900"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    {errors.form &&
                        <div className="mt-3">
                            <p className="text-sm text-red-500">
                            {errors.form}
                            </p>

                            {retryAfter > 0 ? (
                                <p className="mt-1 text-sm text-zinc-500">
                                    You can try again in{" "}
                                    <span className="font-medium text-zinc-700">
                                        {formatCountdown(retryAfter)}
                                    </span>
                                </p>
                            ) : attemptsRemaining !== null &&
                            attemptsRemaining > 0 ? (
                                <p className="mt-1 text-sm text-zinc-500">
                                    {attemptsRemaining}{" "}
                                    {attemptsRemaining === 1
                                    ? "attempt"
                                    : "attempts"}{" "}
                                    remaining
                                </p>
                            ) : null}
                        </div>
                    }
                    {/* Bottom row */}
                    <div className="mt-10 flex flex-1 items-end justify-between">
                        <div className="pb-6 text-sm">
                            <p className="text-zinc-500">Don't have an account?</p>
                            <a href="#" className="mt-1 inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline"
                            >
                                Request access <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group -mb-px -mr-8 flex cursor-pointer items-center gap-2 rounded-tl-3xl bg-zinc-900 px-10 py-6 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-70 md:-mr-10 md:px-12"
                        >
                            {loading ?
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>
                            : null}

                            {loading ? "Signing in" : "Sign in"}

                            {!loading &&
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            }
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </main>
}
export default LoginForm