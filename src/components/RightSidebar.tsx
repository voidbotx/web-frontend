"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserPlus } from "lucide-react";

import AuthContext from "@/context/AuthContext";
import SuggestedUsers from "@/components/SuggestedUsers";
import UserSearch from "@/components/UserSearch";
import { Card, CardContent } from "@/components/ui/card";

const RightSidebar = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    return (
        <aside className="fixed top-20 right-4 w-96 h-[calc(100vh-5rem)] bg-white dark:bg-zinc-900 hidden lg:flex flex-col space-y-6 overflow-y-auto">
            {/* User Profile Card */}
            <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                    <Link
                        href={`/profile/${user?._id}`}
                        className="flex items-center gap-4 group"
                    >
                        <div className="relative">
                            <img
                                src={user?.avatar || "/media/images/default-avatar.jpg"}
                                alt={user?.username}
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-zinc-900 dark:text-white group-hover:underline transition-colors">
                                {user?.username}
                            </p>
                            <div className="flex gap-3 text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                <span>
                                    <strong className="text-zinc-800 dark:text-white">
                                        {user?.followers?.length || 0}
                                    </strong>{" "}
                                    followers
                                </span>
                                <span>
                                    <strong className="text-zinc-800 dark:text-white">
                                        {user?.following?.length || 0}
                                    </strong>{" "}
                                    following
                                </span>
                            </div>
                        </div>
                    </Link>
                </CardContent>
            </Card>

            {/* User Search */}
            <UserSearch />

            {/* Suggested Users */}
            <SuggestedUsers />
        </aside>
    );
};

export default RightSidebar;
