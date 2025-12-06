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
        if (!confirm("Are you sure? This will delete the user and all their logs forever.")) return;

        setIsDeleting(true);
        try {
            await deleteUser(selectedDeleteUserId);
            alert("User deleted.");
            setShowDeleteModal(false);
            setSelectedDeleteUserId("");
            router.refresh(); // Refresh server component updates
        } catch (error) {
            console.error(error);
            alert("Failed to delete user.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="text-center pt-12 border-t-2 border-[#fbcfe8] mt-12 pb-8">
            <button
                onClick={() => setShowDeleteModal(!showDeleteModal)}
                className="text-gray-400 hover:text-red-400 text-sm font-medium transition underline"
            >
                {showDeleteModal ? "Cancel Deletion" : "Delete User"}
            </button>

            {showDeleteModal && (
                <div className="mt-6 bg-white p-6 rounded-2xl border-2 border-gray-200 max-w-md mx-auto shadow-sm">
                    <h3 className="text-red-500 font-bold mb-4">Danger Zone</h3>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 border p-2 rounded-lg bg-gray-50"
                            value={selectedDeleteUserId}
                            onChange={(e) => setSelectedDeleteUserId(e.target.value)}
                        >
                            <option value="">Select user to delete...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || !selectedDeleteUserId}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
                        >
                            {isDeleting ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
