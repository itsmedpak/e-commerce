"use client"

import { useAuth } from "@/app/provider/AuthProvider"
import {
    BarChart3,
    Bell,
    ChevronDown,
    CircleDollarSign,
    LayoutDashboard,
    Menu,
    Package,
    Search,
    Settings,
    ShoppingCart,
    Users,
    Camera,
    User,
    LockKeyhole,
    LogOut
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const stats = [
    {
        title: "Total Revenue",
        value: "$24,780",
        change: "+12.5%",
        icon: CircleDollarSign,
    },
    {
        title: "Total Orders",
        value: "1,248",
        change: "+8.2%",
        icon: ShoppingCart,
    },
    {
        title: "Total Products",
        value: "342",
        change: "+4.6%",
        icon: Package
    },
    {
        title: "Customers",
        value: "8,492",
        change: "+11.2%",
        icon: Users
    }
]

const recentOrders = [
    {
        id: "#ORD-1048",
        customer: "Aarav Sharma",
        product: "Premium Hoodie",
        amount: "$89.00",
        status: "Completed"
    },
    {
        id: "#ORD-1047",
        customer: "Sanjay Thapa",
        product: "Running Shoes",
        amount: "$124.00",
        status: "Processing"
    },
    {
        id: "#ORD-1046",
        customer: "Riya Karki",
        product: "Leather Wallet",
        amount: "$58.00",
        status: "Completed"
    },
    {
        id: "#ORD-1045",
        customer: "Bibek Gurung",
        product: "Classic Watch",
        amount: "$210.00",
        status: "Pending"
    },
    {
        id: "#ORD-1044",
        customer: "Nisha Shrestha",
        product: "Cotton T-Shirt",
        amount: "$42.00",
        status: "Completed"
    }
]

const Dashboard = () => {
    const {user} = useAuth()
    const router = useRouter()
    const [profileOpen, setProfileOpen] = useState(false)

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })

        if (response.ok) {
            router.replace("/login")
            router.refresh()
        }
    }
    return <div className="min-h-screen bg-zinc-50 text-zinc-900">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-5 lg:hidden">
            <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 hover:bg-zinc-100">
                    <Menu size={21} />
                </button>
                <span className="text-lg font-semibold tracking-tight">
                    Admin
                </span>
            </div>
            <button className="rounded-lg p-2 hover:bg-zinc-100">
                <Bell size={19} />
            </button>
        </header>
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white lg:flex lg:flex-col">

                {/* Logo */}
                <div className="flex h-20 items-center border-b border-zinc-100 px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Admin Panel
                            </p>
                            <p className="text-xs text-zinc-400">
                                Management
                            </p>
                        </div>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Overview
                    </p>
                    <div className="space-y-1">
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </a>
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            <ShoppingCart size={18} />
                            Orders
                        </a>
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            <Package size={18} />
                            Products
                        </a>
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            <Users size={18} />
                            Customers
                        </a>
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            <BarChart3 size={18} />
                            Analytics
                        </a>
                    </div>
                    <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        System
                    </p>
                    <div className="space-y-1">
                        <a href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            <Settings size={18} />
                            Settings
                        </a>
                    </div>
                </nav>


                {/* User */}
                <div className="relative border-t border-zinc-100 p-4 cursor-pointer">
                    {/* Profile trigger */}
                    <button
                        onClick={() => setProfileOpen((open) => !open)}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-zinc-50"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                            {(user.name ?? "Admin").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1 cursor-pointer">
                            <p className="truncate text-sm font-medium">
                                {user.name ?? "Admin User"}
                            </p>

                            <p className="truncate text-xs text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-zinc-400 transition-transform ${
                                profileOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Dropdown */}
                    {profileOpen &&
                        <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                            <Link href="/profile"
                                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
                            >
                                <User size={17} className="text-zinc-500" />
                                Profile
                            </Link>
                            <Link href="/change-password"
                                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
                            >
                                <LockKeyhole size={17} className="text-zinc-500" />
                                Change Password
                            </Link>
                            <div className="my-1.5 border-t border-zinc-100" />
                            <button onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 cursor-pointer"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </div>
                    }
                </div>
            </aside>


            {/* Main */}
            <main className="w-full lg:ml-64">
                {/* Desktop Header */}
                <header className="hidden h-20 items-center justify-between border-b border-zinc-200 bg-white px-8 lg:flex">

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="mt-0.5 text-sm text-zinc-500">
                            Welcome back. Here's what's happening today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="flex h-10 w-64 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3">
                            <Search size={17} className="text-zinc-400" />
                            <input type="text"
                                placeholder="Search..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                            />
                        </div>

                        {/* Notification */}
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white transition hover:bg-zinc-50">
                            <Bell size={18} />
                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-5 sm:p-7 lg:p-8">
                    {/* Page heading */}
                    <div className="mb-7 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">
                                Overview
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                                Good morning 👋
                            </h2>
                        </div>
                        <button className="hidden rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 sm:block">
                            Download Report
                        </button>
                    </div>


                    {/* Stats */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <div key={stat.title}
                                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-zinc-500">
                                                {stat.title}
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold tracking-tight">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                                            <Icon size={19} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs font-semibold text-emerald-600">
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-zinc-400">
                                            from last month
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Charts / Revenue */}
                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                        {/* Revenue */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        Revenue
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold">
                                        $24,780
                                    </p>
                                </div>
                                <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 outline-none">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>

                            {/* Simple chart placeholder */}
                            <div className="mt-8 flex h-56 items-end gap-3">
                                {[35, 52, 42, 68, 54, 76, 63, 82, 70, 91, 76, 88].map(
                                    (height, index) => (
                                        <div key={index}
                                            className="group flex h-full flex-1 items-end"
                                        >
                                            <div className="w-full rounded-t-md bg-zinc-900 transition group-hover:bg-zinc-700"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="mt-3 flex justify-between text-xs text-zinc-400">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        Order Summary
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold">
                                        1,248
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                                    <ShoppingCart size={19} />
                                </div>
                            </div>
                            <div className="mt-8 space-y-5">
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-zinc-600">
                                            Completed
                                        </span>
                                        <span className="font-medium">
                                            68%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                                        <div className="h-full rounded-full bg-zinc-900"
                                            style={{ width: "68%" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-zinc-600">
                                            Processing
                                        </span>
                                        <span className="font-medium">
                                            21%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                                        <div
                                            className="h-full rounded-full bg-zinc-500"
                                            style={{ width: "21%" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-zinc-600">
                                            Pending
                                        </span>
                                        <span className="font-medium">
                                            11%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                                        <div className="h-full rounded-full bg-zinc-300"
                                            style={{ width: "11%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                            <div>
                                <h3 className="font-semibold">
                                    Recent Orders
                                </h3>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Latest transactions from your store.
                                </p>
                            </div>
                            <button className="text-sm font-medium text-zinc-900 hover:underline">
                                View all
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead>
                                    <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                                        <th className="px-6 py-4 font-medium">
                                            Order
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}
                                            className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
                                        >

                                            <td className="px-6 py-4 text-sm font-medium">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600">
                                                {order.customer}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600">
                                                {order.product}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {order.amount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        order.status === "Completed"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : order.status === "Processing"
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
}

export default Dashboard