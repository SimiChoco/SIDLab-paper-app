"use client";

import { useState } from "react";
import { createUser } from "@/lib/db";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<"B4" | "M2">("B4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUser(name, grade);
      alert("登録しました！");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Error registering:", error);
      setError(error.message || "登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm card p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">新規メンバー登録</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ニックネーム
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="名前を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              学年
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="grade"
                  value="B4"
                  checked={grade === "B4"}
                  onChange={(e) => setGrade(e.target.value as "B4")}
                  className="radio radio-primary"
                />
                <span className="text-gray-900">学部4年 (B4)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="grade"
                  value="M2"
                  checked={grade === "M2"}
                  onChange={(e) => setGrade(e.target.value as "M2")}
                  className="radio radio-primary"
                />
                <span className="text-gray-900">修士2年 (M2)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
