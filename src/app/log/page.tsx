"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, addReadingLog } from "@/lib/db";
import Link from "next/link";

type UserOption = { id: string; name: string };

export default function LogPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserOption[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [pages, setPages] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const u = await getAllUsers();
                setUsers(u);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to load members.");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!selectedUserId) {
            setError("Who are you?");
            setSubmitting(false);
            return;
        }

        try {
            const pageCount = parseInt(pages, 10);
            if (isNaN(pageCount) || pageCount < 0) {
                alert("Please enter valid page number.");
                setSubmitting(false);
                return;
            }

            const selectedUser = users.find(u => u.id === selectedUserId);
            if (!selectedUser) throw new Error("User mismatch");

            // Logic updated to use absolute value (not increment)
            await addReadingLog(selectedUserId, selectedUser.name, pageCount);
            router.push(`/log/success?pages=${pageCount}`);
        } catch (error: any) {
            console.error("Error adding log:", error);
            setError(error.message || "Failed to record.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#f472b6] font-bold text-xl animate-pulse">Loading...</div>;

    return (
        <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#f0f9ff]">
            <div className="w-full max-w-md bg-white rounded-[2rem] border-4 border-[#bae6fd] p-8 space-y-8 shadow-xl">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-[#0284c7]">
                        Progress Log
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Update your thesis progress. 📈
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border-2 border-red-100">
                        🥺 {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="user" className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                            Select Your Name
                        </label>
                        <div className="relative">
                            <select
                                id="user"
                                required
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full px-6 py-4 bg-[#f0f9ff] border-2 border-[#bae6fd] rounded-2xl focus:border-[#0284c7] focus:ring-0 text-gray-700 outline-none transition font-medium text-lg appearance-none cursor-pointer"
                            >
                                <option value="">Choose...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-[#0284c7] font-bold">
                                ▼
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="pages" className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                            Current Page Number
                        </label>
                        <input
                            type="number"
                            id="pages"
                            required
                            min="0"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            className="w-full px-6 py-4 bg-[#f0f9ff] border-2 border-[#bae6fd] rounded-2xl focus:border-[#0284c7] focus:ring-0 text-gray-700 outline-none transition font-medium text-lg placeholder-gray-300"
                            placeholder="10p"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-4 bg-[#38bdf8] text-white font-bold rounded-2xl shadow-lg border-b-4 border-[#0ea5e9] active:border-b-0 active:translate-y-1 hover:bg-[#0ea5e9] transition-all text-lg ${submitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {submitting ? "Update Progress" : "Update!"}
                    </button>

                </form>
                <div className="text-center pt-2">
                    <Link href="/" className="text-sm text-gray-400 hover:text-[#0284c7] font-bold transition">
                        Back to Top
                    </Link>
                </div>
            </div>
        </main>
    );
}
