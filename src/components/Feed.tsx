"use client";

import { useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


const Feed = () => {
    const [feedMode, setFeedMode] = useState("following");

    const handlePostCreated = () => {
        // Handle new post creation if needed
    };

    return (
        <main className="flex justify-center py-8">
            <div className="w-full max-w-2xl space-y-6">
                <CreatePost onPostCreated={handlePostCreated} />

                <Tabs defaultValue={feedMode} onValueChange={setFeedMode}>
                    <TabsList className="w-full mb-4 grid grid-cols-2">
                        <TabsTrigger value="following" className="w-full">
                            Following
                        </TabsTrigger>
                        <TabsTrigger value="all" className="w-full">
                            All Posts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="following">
                        <h2 className="text-xl font-semibold mb-4">
                            Posts from people you follow
                        </h2>
                        <PostList />
                    </TabsContent>

                    <TabsContent value="all">
                        <h2 className="text-xl font-semibold mb-4">All posts</h2>
                        <PostList />
                        
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
};

export default Feed;
