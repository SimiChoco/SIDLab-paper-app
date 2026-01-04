"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/db";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function DeleteUserSection({ users }: { users: User[] }) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeleteUserId, setSelectedDeleteUserId] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!selectedDeleteUserId) return;
        if (!confirm("本当にこのユーザーを削除しますか？この操作は取り消せません。")) return;

        setIsDeleting(true);
        try {
            await deleteUser(selectedDeleteUserId);
            alert("削除しました。");
            setShowDeleteModal(false);
            setSelectedDeleteUserId("");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("削除に失敗しました。");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="pt-8 border-t border-gray-200 mt-8">
            <div className="flex justify-center items-center gap-6 text-xs text-gray-400">
                <button
                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                    className="hover:text-red-600 hover:underline transition"
                >
                    {showDeleteModal ? "キャンセル" : "ユーザー管理（削除）"}
                </button>
                <span>|</span>
                <a href="/settings" className="hover:text-gray-600 hover:underline transition">
                    設定
                </a>
            </div>

            {showDeleteModal && (
                <div className="mt-4 bg-white p-6 border border-gray-200 rounded-md max-w-md mx-auto shadow-sm">
                    <h3 className="text-gray-800 font-bold mb-4 text-sm">
                        ユーザー削除
                    </h3>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 input-field text-sm"
                            value={selectedDeleteUserId}
                            onChange={(e) => setSelectedDeleteUserId(e.target.value)}
                        >
                            <option value="">ユーザーを選択...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || !selectedDeleteUserId}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isDeleting ? "..." : "削除"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
