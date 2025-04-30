"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import AuthContext from "@/context/AuthContext";
import LikesModal from "./LikesModal";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import SharePost from "./SharePost";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, MessageCircle } from "lucide-react";

interface User {
    _id: string;
    username: string;
    avatar: string;
}

interface PostImage {
    url: string;
}

interface PostProps {
    post: {
        _id: string;
        text: string;
        createdAt: string;
        image?: PostImage;
        likes: string[];
        user: User;
    };
    onDelete: (postId: string) => void;
}

const Post = ({ post, onDelete }: PostProps) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error(
            "AuthContext is undefined. Ensure AuthProvider is wrapping the component."
        );
    }

    const { user } = authContext;
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showLikes, setShowLikes] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        // Fetch comment count when component mounts
        const fetchCommentCount = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/posts/${post._id}/comments/count`,
                    {
                        headers: { "x-auth-token": localStorage.getItem("token") },
                    }
                );
                setCommentCount(response.data.count);
            } catch (error) {
                console.error("Error fetching comment count:", error);
            }
        };

        fetchCommentCount();
    }, [post._id]);

    const handleLike = async () => {
        if (isLoading || !user) return;

        setIsLoading(true);
        try {
            const url = `http://localhost:5000/api/posts/${isLiked ? "unlike" : "like"
                }/${post._id}`;
            const response = await axios.put(
                url,
                {},
                {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                }
            );

            setLikeCount(response.data.length);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
                headers: { "x-auth-token": localStorage.getItem("token") },
            });

            if (onDelete) {
                onDelete(post._id);
            }

            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
    });
    const hasImage = post.image && post.image.url && !imageError;
    const hasText = post.text && post.text.trim().length > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 transition-all hover:shadow-md">
            <div className="flex items-start">
                <Link href={`/profile/${post.user._id}`} className="flex-shrink-0">
                    <img
                        src={post.user.avatar}
                        alt={post.user.username}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link
                                href={`/profile/${post.user._id}`}
                                className="font-medium text-gray-900 hover:underline"
                            >
                                {post.user.username}
                            </Link>
                            <p className="text-xs text-gray-500">
                                <Link href={`/post/${post._id}`} className="hover:underline">
                                    {formattedDate}
                                </Link>
                            </p>
                        </div>

                        {user && user._id === post.user._id && (
                            <Button
                                onClick={() => setShowDeleteDialog(true)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-full"
                                aria-label="Delete post"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {hasText && (
                        <p className="mt-2 text-gray-800 whitespace-pre-line break-words">
                            {post.text}
                        </p>
                    )}

                    {hasImage && (
                        <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={post.image?.url}
                                alt="Post"
                                className="w-full object-contain max-h-[500px]"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    )}

                    <div className="mt-3 flex items-center space-x-2 border-t pt-3">
                        {/* Like Button */}
                        <Button
                            onClick={handleLike}
                            disabled={isLoading || !user}
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1.5 rounded-full h-8 ${isLiked
                                    ? "text-primary-600 bg-primary-50 hover:bg-primary-100"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
                            <span>{likeCount}</span>
                        </Button>

                        {likeCount > 0 && (
                            <Button
                                onClick={() => setShowLikes(true)}
                                variant="link"
                                size="sm"
                                className="text-sm text-gray-500 hover:text-primary-600"
                            >
                                See who liked
                            </Button>
                        )}

                        {/* Comment Button/Link */}
                        <Link href={`/post/${post._id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1.5 rounded-full h-8 text-gray-500 hover:bg-gray-100"
                            >
                                <MessageCircle className="size-4" />
                                <span>{commentCount}</span>
                            </Button>
                        </Link>

                        {commentCount > 0 && (
                            <Link href={`/post/${post._id}`}>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-sm text-gray-500 hover:text-primary-600"
                                >
                                    {commentCount === 1 ? "View comment" : "View comments"}
                                </Button>
                            </Link>
                        )}

                        {/* Share Button */}
                        <div className="ml-auto">
                            <SharePost post={post} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Likes Modal */}
            <LikesModal
                isOpen={showLikes}
                onClose={() => setShowLikes(false)}
                postId={post._id}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Post;