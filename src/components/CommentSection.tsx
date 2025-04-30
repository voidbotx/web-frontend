"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";

// Define types for better type safety
interface Comment {
    _id: string;
    text: string;
    createdAt: string;
    user: {
        _id: string;
        username: string;
        avatar: string;
    };
}

interface CommentSectionProps {
    postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is undefined. Ensure AuthProvider is wrapping the component.");
    }

    const { user, token } = authContext;
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_URL}/posts/${postId}/comments`,
                    {
                        headers: { "x-auth-token": token || localStorage.getItem("token") },
                    }
                );
                setComments(response.data);
            } catch (err) {
                console.error("Error fetching comments:", err);
                setError("Failed to load comments");
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId, token, API_URL]);

    const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;

        setSubmitting(true);
        try {
            const response = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                { text: commentText },
                {
                    headers: { "x-auth-token": token || localStorage.getItem("token") },
                }
            );
            setComments([response.data, ...comments]);
            setCommentText("");
        } catch (err) {
            console.error("Error posting comment:", err);
            setError("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(
                `${API_URL}/posts/${postId}/comments/${commentId}`,
                {
                    headers: { "x-auth-token": token || localStorage.getItem("token") },
                }
            );
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError("Failed to delete comment");
        }
    };

    return (
        <div>
            {/* Comment form */}
            {user && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.username} />
                            <AvatarFallback>
                                {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <Textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="min-h-[80px] resize-none"
                                disabled={submitting}
                            />

                            <div className="mt-2 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!commentText.trim() || submitting}
                                    size="sm"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Post
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <p className="text-center text-red-500 py-4">{error}</p>
            ) : comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                    No comments yet. Be the first to comment!
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                            <Link href={`/profile/${comment.user._id}`}>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={comment.user.avatar}
                                        alt={comment.user.username}
                                    />
                                    <AvatarFallback>
                                        {comment.user.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg px-3 py-2">
                                    <div className="flex justify-between items-start">
                                        <Link
                                            href={`/profile/${comment.user._id}`}
                                            className="font-medium text-sm hover:underline"
                                        >
                                            {comment.user.username}
                                        </Link>

                                        {user && user._id === comment.user._id && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                <span className="sr-only">Delete</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 text-red-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </Button>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-800 mt-1 whitespace-pre-line break-words">
                                        {comment.text}
                                    </p>
                                </div>

                                <div className="mt-1 text-xs text-gray-500 pl-3">
                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                        addSuffix: true,
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;