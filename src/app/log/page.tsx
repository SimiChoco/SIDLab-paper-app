"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, addReadingLog } from "@/lib/db";
import Link from "next/link";
import InputComment from "../components/InputComment";
import { User } from "@/lib/types";

const MAX_COMMENT_LENGTH = 10;

export default function LogPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [pages, setPages] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const u = await getAllUsers();
        setUsers(u);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("ユーザー情報の取得に失敗しました。");
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
      setError("ユーザーを選択してください。");
      setSubmitting(false);
      return;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      setError(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`);
      setSubmitting(false);
      return;
    }

    const pageCount = parseInt(pages, 10);
    if (isNaN(pageCount) || pageCount < 0) {
      alert("正しいページ数を入力してください。");
      setSubmitting(false);
      return;
    }

    try {
      const selectedUser = users.find((u) => u.id === selectedUserId);
      if (!selectedUser) throw new Error("User mismatch");

      await addReadingLog(
        selectedUserId,
        selectedUser.name,
        pageCount,
        selectedUser.likedNum || 0,
        comment
      );
      router.push(`/log/success?pages=${pageCount}`);
    } catch (error: any) {
      console.error("Error adding log:", error);
      setError(error.message || "記録に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm card p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">進捗を記録</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ユーザー
            </label>
            <select
              id="user"
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input-field"
            >
              <option value="">選択してください...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pages"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              現在の到達ページ数
            </label>
            <input
              type="number"
              id="pages"
              required
              min="0"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="input-field"
              placeholder="例: 10"
            />
          </div>
          <InputComment
            comment={comment}
            onChange={handleCommentChange}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="今の気持ちを記録しよう！"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary"
          >
            {submitting ? "記録中..." : "記録する"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
          >
            キャンセル
          </Link>
        </div>
      </div>
    </main>
  );
}
