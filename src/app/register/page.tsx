"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/db";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createUser(name);
            alert("Welcome to the Guild!");
            window.location.href = "/"; // Force navigation
        } catch (error: any) {
            console.error("Error registering:", error);
            setError(error.message || "Failed to register.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#fff1f2] flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 space-y-8 border-4 border-[#fbcfe8]">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-[#db2777]">
                        New Member
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Join the thesis writing group! 🖊️
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border-2 border-red-100">
                        🥺 {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                            Nickname
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 bg-[#fdf2f8] border-2 border-[#fbcfe8] rounded-2xl focus:border-[#db2777] focus:ring-0 text-gray-700 outline-none transition font-medium text-lg placeholder-gray-300"
                            placeholder="e.g. Alice"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-[#f472b6] text-white font-bold rounded-2xl shadow-lg border-b-4 border-[#ec4899] active:border-b-0 active:translate-y-1 hover:bg-[#ec4899] transition-all text-lg ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Joining..." : "Join Now!"}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <Link href="/" className="text-sm text-gray-400 hover:text-[#db2777] font-bold transition">
                        Back to Top
                    </Link>
                </div>
            </div>
        </main>
    );
}
