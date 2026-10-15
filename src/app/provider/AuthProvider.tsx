"use client"

import { createContext, useContext, type ReactNode, useEffect } from "react"
import { startOnlineSync } from "@/lib/offline/sync/online"

export type AuthUser = {
    id: string
    name: string | null
    email: string
    phone: string | null
    avatarUrl: string | null
}

type AuthContextType = {
    user: AuthUser
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
    user: AuthUser
    children: ReactNode
}

const AuthProvider = ({ user, children }: AuthProviderProps) => {
    useEffect(() => {
        return startOnlineSync()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context)
        throw new Error("useAuth must be used within AuthProvider")

    return context
}

export default AuthProvider