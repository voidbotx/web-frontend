"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AuthContext from "@/context/AuthContext";

interface User {
    _id: string;
    username: string;
    avatar: string;
}

const SuggestedUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is undefined. Make sure you are using AuthContextProvider.");
    }

    const { token } = authContext;

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:5888/api/users/suggestions",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchSuggestions();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleFollow = async (userId: string, index: number) => {
        try {
            await axios.put(
                `http://localhost:5888/api/users/follow/${userId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Remove user from suggestions after following
            setUsers(users.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (users.length === 0) {
        return null; // Don't show anything if no suggestions
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Suggested for you</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <ul className="space-y-3">
                    {users.slice(0, 5).map((user, index) => (
                        <li key={user._id} className="flex justify-between items-center">
                            <Link
                                href={`/profile/${user._id}`}
                                className="flex items-center flex-1"
                            >
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={user.avatar} alt={user.username} />
                                    <AvatarFallback>
                                        {user.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm truncate">
                                    {user.username}
                                </span>
                            </Link>

                            <Button
                                size="sm"
                                variant="ghost"
                                className="px-2 h-8"
                                onClick={() => handleFollow(user._id, index)}
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="sr-only">Follow</span>
                            </Button>
                        </li>
                    ))}
                </ul>

                {users.length > 5 && (
                    <Link
                        href="/explore"
                        className="block text-center text-sm text-primary hover:underline mt-4"
                    >
                        See more suggestions
                    </Link>
                )}
            </CardContent>
        </Card>
    );
};

export default SuggestedUsers;
