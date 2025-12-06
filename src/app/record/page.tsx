"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addReadingLog } from "@/lib/db";
import Link from "next/link";
// import { ArrowLeft } from "lucide-react"; // Removed dependency

export default function RecordPage() {
    const router = useRouter();
    const [name, setName] = useState(""); // Ideally this would be from Auth
    const [pages, setPages] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const pageCount = parseInt(pages, 10);
            if (isNaN(pageCount) || pageCount <= 0) {
                alert("Please enter a valid number of pages.");
                setLoading(false);
                return;
            }

            await addReadingLog(name, pageCount, title);
            router.push("/");
        } catch (error: any) {
            console.error("Error adding log:", error);
            setError(error.message || "Failed to record. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 transition mb-4"
                >
                    ← Back to Dashboard
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Record Progress</h1>
                    <p className="text-gray-500">Log the pages you've read today.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="e.g. Alice"
                        />
                    </div>

                    <div>
                        <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                            Pages Read
                        </label>
                        <input
                            type="number"
                            id="pages"
                            required
                            min="1"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="e.g. 15"
                        />
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Paper Title (Optional)
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="e.g. Attention Is All You Need"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-sm ${loading ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Recording..." : "Submit Record"}
                    </button>
                </form>
            </div>
        </main>
    );
}
