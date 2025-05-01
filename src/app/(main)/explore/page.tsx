"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import UserSearch from "@/components/UserSearch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";

interface User {
    _id: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
    followers?: string[];
}

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("people");
    const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
    const [newUsers, setNewUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                // Get trending users (users with most followers)
                const trendingResponse = await axios.get(
                    "http://localhost:5000/api/users/trending",
                    {
                        headers: { "x-auth-token": localStorage.getItem("token") },
                    }
                );

                // Get newest users
                const newResponse = await axios.get(
                    "http://localhost:5000/api/users/newest",
                    {
                        headers: { "x-auth-token": localStorage.getItem("token") },
                    }
                );

                setTrendingUsers(trendingResponse.data);
                setNewUsers(newResponse.data);

                // Initialize follow status
                const status: Record<string, boolean> = {};
                [...trendingResponse.data, ...newResponse.data].forEach((user) => {
                    status[user._id] = user.isFollowing;
                });
                setFollowStatus(status);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleFollow = async (userId: string) => {
        const isFollowing = followStatus[userId];
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

            setFollowStatus((prev) => ({
                ...prev,
                [userId]: !isFollowing,
            }));
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        }
    };

    const renderUserList = (users: User[]) => {
        if (loading) {
            return (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (users.length === 0) {
            return <p className="text-center py-8 text-gray-500">No users found</p>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                    <Card key={user._id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <Link
                                    href={`/profile/${user._id}`}
                                    className="flex items-center flex-1"
                                >
                                    <Avatar className="h-12 w-12 mr-3">
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
                                    variant={followStatus[user._id] ? "outline" : "default"}
                                    onClick={() => handleFollow(user._id)}
                                >
                                    {followStatus[user._id] ? (
                                        "Following"
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 mr-1" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Explore</h1>

            <UserSearch />

            <Tabs
                defaultValue={activeTab}
                onValueChange={setActiveTab}
                className="mt-6"
            >
                <TabsList className="w-full mb-6">
                    <TabsTrigger value="people" className="flex-1">
                        Popular People
                    </TabsTrigger>
                    <TabsTrigger value="new" className="flex-1">
                        New Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="people">
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle>Popular users you might want to follow</CardTitle>
                        </CardHeader>
                        <CardContent>{renderUserList(trendingUsers)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="new">
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle>Recently joined users</CardTitle>
                        </CardHeader>
                        <CardContent>{renderUserList(newUsers)}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
