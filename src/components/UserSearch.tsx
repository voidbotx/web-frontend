"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserCheck } from "lucide-react";

interface User {
    _id: string;
    username: string;
    avatar: string;
    followers?: string[];
    isFollowing?: boolean;
}

interface FollowingStatus {
    [key: string]: boolean;
}

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [following, setFollowing] = useState<FollowingStatus>({});

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users/search?username=${searchTerm}`,
                {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                }
            );
            setResults(response.data);

            // Initialize following status
            const followStatus: FollowingStatus = {};
            response.data.forEach((user: User) => {
                followStatus[user._id] = user.isFollowing || false;
            });
            setFollowing(followStatus);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId: string) => {
        const isFollowing = following[userId];
        try {
            const url = `http://localhost:5000/api/users/${isFollowing ? "unfollow" : "follow"
                }/${userId}`;
            await axios.put(
                url,
                {},
                {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                }
            );

            setFollowing((prev) => ({
                ...prev,
                [userId]: !isFollowing,
            }));
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Find People</h2>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </form>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                </div>
            )}

            {results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((user) => (
                        <li
                            key={user._id}
                            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <Link
                                href={`/profile/${user._id}`}
                                className="flex items-center flex-1"
                            >
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={user.avatar} alt={user.username} />
                                    <AvatarFallback>
                                        {user.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-xs text-gray-500">
                                        {user.followers?.length || 0} followers
                                    </p>
                                </div>
                            </Link>

                            <Button
                                size="sm"
                                variant={following[user._id] ? "outline" : "default"}
                                className="ml-2"
                                onClick={() => handleFollow(user._id)}
                            >
                                {following[user._id] ? (
                                    <>
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Following
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        Follow
                                    </>
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {results.length === 0 && searchTerm && !loading && (
                <p className="text-center py-4 text-gray-500">
                    No users found matching "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default UserSearch;
