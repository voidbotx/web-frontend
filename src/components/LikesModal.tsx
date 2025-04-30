"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface User {
    _id: string;
    username: string;
    avatar: string;
}

interface LikesModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
}

const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLikes = async () => {
            if (!isOpen || !postId) return;

            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:5000/api/posts/${postId}/likes`,
                    {
                        headers: { "x-auth-token": localStorage.getItem("token") },
                    }
                );
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching likes:", err);
                setError("Could not load users who liked this post");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchLikes();
        }
    }, [isOpen, postId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Likes</DialogTitle>
                    <DialogDescription>Users who liked this post</DialogDescription>
                </DialogHeader>

                <div className="py-4 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p className="text-center text-gray-500">No likes yet</p>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li
                                    key={user._id}
                                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <Link
                                        href={`/profile/${user._id}`}
                                        className="flex items-center w-full"
                                        onClick={onClose}
                                    >
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <span className="font-medium">{user.username}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LikesModal;