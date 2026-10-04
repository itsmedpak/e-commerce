import { Suspense } from "react"
import ResetPasswordForm from "./ResetPasswordForm"

const ResetPasswordPage = () =>
    <Suspense fallback={
        <main className="min-h-screen bg-zinc-100 px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <p className="text-sm text-zinc-500">Loading...</p>
                </div>
            </div>
        </main>
    }>
        <ResetPasswordForm />
    </Suspense>

export default ResetPasswordPage