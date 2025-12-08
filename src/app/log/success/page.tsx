"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const pages = searchParams.get("pages");

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="card p-8 max-w-sm w-full text-center bg-white">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">
                        ✓
                    </div>
                </div>
                <h1 className="text-lg font-bold text-gray-900 mb-2">
                    記録完了
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                    お疲れ様です。<br />
                    現在 <span className="font-bold text-gray-900">{pages}ページ</span> に到達しました。
                </p>

                <Link
                    href="/"
                    className="btn btn-primary w-full"
                >
                    ダッシュボードに戻る
                </Link>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="text-gray-500 text-sm p-8 text-center">読み込み中...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
