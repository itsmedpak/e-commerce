import { requireAdmin } from "@/server/auth/require.admin"
import { ReactNode } from "react"
import AuthProvider from "../provider/AuthProvider"

const AdminLayout = async ({children}: {children: ReactNode}) => {
    const user = await requireAdmin()

    return (
        <AuthProvider user={user}>
            {children}
        </AuthProvider>
    )
}

export default AdminLayout