"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import PostList from "@/components/PostList";
import UserConnections from "@/components/UserConnections";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ProfilePage = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("AuthContext is undefined. Make sure you are using AuthContextProvider.");
    }

    const { user: currentUser, logout } = authContext;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                });
                setUser(res.data);
                setFollowersCount(res.data.followers?.length || 0);
                setFollowingCount(res.data.following?.length || 0);
                setIsFollowing(
                    currentUser?.following?.includes(id) ||
                    res.data.followers?.includes(currentUser?._id)
                );
            } catch (err) {
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id, currentUser]);

    const handleFollow = async () => {
        try {
            setLoadingFollow(true);
            if (isFollowing) {
                await axios.put(
                    `http://localhost:5000/api/users/unfollow/${id}`,
                    {},
                    {
                        headers: {
                            "x-auth-token": localStorage.getItem("token"),
                        },
                    }
                );
                setFollowersCount((prev) => prev - 1);
            } else {
                await axios.put(
                    `http://localhost:5000/api/users/follow/${id}`,
                    {},
                    {
                        headers: {
                            "x-auth-token": localStorage.getItem("token"),
                        },
                    }
                );
                setFollowersCount((prev) => prev + 1);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Error following/unfollowing user", err);
        } finally {
            setLoadingFollow(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    variant="link"
                    className="text-primary-600"
                    onClick={() => router.push("/")}
                >
                    Return to home
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-600">User not found.</p>
                <Button
                    variant="link"
                    className="text-primary-600"
                    onClick={() => router.push("/")}
                >
                    Return to home
                </Button>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser._id === id;

    return (
        <div className="max-w-3xl mx-auto px-4">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                {/* Cover Photo */}
                <div className="h-40 bg-gradient-to-r from-primary-400 to-primary-600 relative"></div>

                {/* Profile Info */}
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row -mt-12 sm:-mt-16">
                        {/* Avatar */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0 mb-4 sm:mb-0">
                            <img
                                src={user.avatar || "https://via.placeholder.com/150?text=User"}
                                alt={user.username}
                                className="rounded-full border-4 border-white w-full h-full object-cover shadow-md"
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 sm:ml-6 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {user.username}
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        @{user.username.toLowerCase().replace(/\s/g, "")}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                                    {/* Follow Button */}
                                    {currentUser && !isOwnProfile && (
                                        <Button
                                            onClick={handleFollow}
                                            disabled={loadingFollow}
                                            variant={isFollowing ? "outline" : "default"}
                                            className="rounded-full"
                                        >
                                            {loadingFollow ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    {isFollowing ? "Unfollowing..." : "Following..."}
                                                </span>
                                            ) : (
                                                <>{isFollowing ? "Unfollow" : "Follow"}</>
                                            )}
                                        </Button>
                                    )}

                                    {/* Logout Button (only visible on own profile) */}
                                    {isOwnProfile && (
                                        <Button
                                            onClick={handleLogout}
                                            variant="destructive"
                                            className="rounded-full"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 flex justify-center sm:justify-start space-x-6">
                                <button
                                    className="text-center hover:opacity-80 transition-opacity"
                                    onClick={() => setActiveTab("connections")}
                                >
                                    <span className="block font-bold text-gray-900">
                                        {followersCount}
                                    </span>
                                    <span className="text-sm text-gray-600">Followers</span>
                                </button>
                                <button
                                    className="text-center hover:opacity-80 transition-opacity"
                                    onClick={() => setActiveTab("connections")}
                                >
                                    <span className="block font-bold text-gray-900">
                                        {followingCount}
                                    </span>
                                    <span className="text-sm text-gray-600">Following</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs for Posts and Connections */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                    <TabsTrigger value="posts" className="flex-1">
                        Posts
                    </TabsTrigger>
                    <TabsTrigger value="connections" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Connections
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts">
                    <PostList userId={id} />
                </TabsContent>

                <TabsContent value="connections">
                    <UserConnections userId={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;
