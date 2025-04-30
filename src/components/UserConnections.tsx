"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";

interface User {
    _id: string;
    username: string;
    avatar: string;
    isFollowing?: boolean;
    followers?: string[];
}

interface UserConnectionsProps {
    userId: string;
}

const UserConnections = ({ userId }: UserConnectionsProps) => {
    const [activeTab, setActiveTab] = useState("followers");
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
                const response = await axios.get(
                    `http://localhost:5888/api/users/${userId}/connections`,
                    {
                        headers: token ? { "Authorization": `Bearer ${token}` } : {}
                    }
                );

                setFollowers(response.data.followers);
                setFollowing(response.data.following);

                // Initialize follow status
                const status: Record<string, boolean> = {};
                [...response.data.followers, ...response.data.following].forEach(
                    (user: User) => {
                        status[user._id] = !!user.isFollowing;
                    }
                );
                setFollowStatus(status);
            } catch (error) {
                console.error("Error fetching connections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [userId]);

    const handleFollow = async (targetUserId: string) => {
        const isFollowing = followStatus[targetUserId];
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            const url = `http://localhost:5888/api/users/${isFollowing ? "unfollow" : "follow"
                }/${targetUserId}`;

            await axios.put(
                url,
                {},
                {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                }
            );

            setFollowStatus((prev) => ({
                ...prev,
                [targetUserId]: !isFollowing,
            }));
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        }
    };

    const renderUserList = (users: User[]) => {
        if (loading) {
            return (
                <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (users.length === 0) {
            return (
                <p className="text-center py-6 text-gray-500">
                    {activeTab === "followers"
                        ? "No followers yet"
                        : "Not following anyone yet"}
                </p>
            );
        }

        return (
            <ul className="space-y-3">
                {users.map((user) => (
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
                            variant={followStatus[user._id] ? "outline" : "default"}
                            className="ml-2"
                            onClick={() => handleFollow(user._id)}
                        >
                            {followStatus[user._id] ? (
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
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Tabs defaultValue="followers" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="followers">
                        Followers ({followers.length})
                    </TabsTrigger>
                    <TabsTrigger value="following">
                        Following ({following.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="followers">{renderUserList(followers)}</TabsContent>

                <TabsContent value="following">{renderUserList(following)}</TabsContent>
            </Tabs>
        </div>
    );
};

export default UserConnections;
