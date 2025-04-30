"use client";

import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import UserSearch from "@/components/UserSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import SuggestedUsers from "@/components/SuggestedUsers";

const Home = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided");
  }

  const { user } = authContext;
  const [newPost, setNewPost] = useState(null);
  const [feedMode, setFeedMode] = useState("following");

  const handleNewPost = (post: any) => {
    setNewPost(post);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 lg:px-20">
      <div className="lg:col-span-2 space-y-6">
        <CreatePost onPostCreated={handleNewPost} />

        <Tabs defaultValue={feedMode} onValueChange={setFeedMode}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="following" className="flex-1">
              Following
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              All Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following">
            <h2 className="text-xl font-semibold mb-4">
              Posts from people you follow
            </h2>
            <PostList feedMode={true} newPost={newPost} />
          </TabsContent>

          <TabsContent value="all">
            <h2 className="text-xl font-semibold mb-4">All posts</h2>
            <PostList feedMode={false} newPost={newPost} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Link href={`/profile/${user?._id}`} className="flex items-center">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-14 h-14 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{user?.username}</p>
                <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                  <span>{user?.followers?.length || 0} followers</span>
                  <span>{user?.following?.length || 0} following</span>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <SuggestedUsers />

        <UserSearch />

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="font-medium text-lg">Find people to follow</h3>
              <p className="text-gray-500 text-sm mt-1">
                Search for users and follow them to see their posts in your feed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
