"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const pages = searchParams.get("pages");

    return (
        <main className="min-h-screen bg-[#fff1f2] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-[#fbcfe8] max-w-sm w-full animate-bounce-short">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-3xl font-bold text-[#db2777] mb-4">Great Work!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    You've reached <span className="font-bold text-[#db2777] text-xl">Page {pages}</span>!
                    <br />
                    Keep that momentum going! ✨
                </p>

                <Link
                    href="/"
                    className="inline-block w-full py-4 bg-[#f472b6] hover:bg-[#ec4899] text-white font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg"
                >
                    Back to Top
                </Link>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
