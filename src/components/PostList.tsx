"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import  Spinner from "./Spinner";

interface PostData {
    _id: string;
    text: string;
    createdAt: string;
    image?: {
        url: string;
        alt?: string;
    };
    likes: string[];
    user: {
        _id: string;
        name: string;
        username: string;
        avatar: string;
        avatarUrl?: string;
    };
}

interface PostListProps {
    userId?: string;
    feedMode?: boolean;
    newPost?: PostData | null;
}

const PostList = ({ userId, feedMode = false, newPost }: PostListProps) => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                let url = "http://localhost:5000/api/posts";

                if (userId) {
                    url = `http://localhost:5000/api/posts/user/${userId}`;
                } else if (feedMode) {
                    url = "http://localhost:5000/api/posts/feed";
                }

                const response = await axios.get(url, {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                });

                setPosts(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId, feedMode]);

    // When a new post is added, update the list
    useEffect(() => {
        if (newPost) {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        }
    }, [newPost]);

    const handlePostDelete = (postId: string) => {
        setPosts(posts.filter((post) => post._id !== postId));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-primary-600 hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
                <p className="text-gray-500">
                    {userId
                        ? "This user has not posted anything yet."
                        : "No posts available. Follow users or create a post!"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Post key={post._id} post={post} onDelete={handlePostDelete} />
            ))}
        </div>
    );
};

export default PostList;
