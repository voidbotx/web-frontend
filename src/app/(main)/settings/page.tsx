"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router version
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
    const router = useRouter();

    const [user, setUser] = useState({
        name: "",
        username: "",
        bio: "",
        avatar: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordChange, setPasswordChange] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("username", user.username);
            formData.append("bio", user.bio);
            if (avatarFile) formData.append("avatar", avatarFile);

            const response = await axios.put("/api/user/profile", formData, {
                headers: { "x-auth-token": localStorage.getItem("token") ?? "" },
            });

            setUser(response.data);
            router.push(`/profile/${response.data._id}`); // ✅ App Router push still works similarly
        } catch (err) {
            console.error("Error updating profile", err);
            setError("Failed to update profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordChange.newPassword !== passwordChange.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await axios.put("/api/user/password", passwordChange, {
                headers: { "x-auth-token": localStorage.getItem("token") ?? "" },
            });

            setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setError("Password successfully changed!");
        } catch (err) {
            console.error("Error changing password", err);
            setError("Failed to change password. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file); // Save file for FormData
            setAvatarPreview(URL.createObjectURL(file)); // Preview
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">Profile Settings</h2>

            {/* Profile Info */}
            <div className="space-y-4 mb-6">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />

                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />

                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    placeholder="Enter your bio"
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
            </div>

            {/* Avatar */}
            <div className="mb-6 flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Avatar" />
                    ) : (
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                </Avatar>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="file:cursor-pointer file:px-4 file:py-2 file:bg-primary file:text-white file:rounded-md"
                />
            </div>

            {/* Password Change */}
            <div className="space-y-4 mb-6">
                <h3 className="text-xl text-zinc-900 dark:text-white">Change Password</h3>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={passwordChange.currentPassword}
                    onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                />

                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={passwordChange.newPassword}
                    onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                />

                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordChange.confirmPassword}
                    onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                />
            </div>

            {/* Error / Success Message */}
            {error && <p className={`text-sm mb-4 ${error.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{error}</p>}

            {/* Save Changes Button */}
            <div className="flex justify-end space-x-4">
                <Button onClick={handleProfileUpdate} disabled={loading}>
                    Save Changes
                </Button>
                <Button onClick={handlePasswordChange} disabled={loading} variant="outline">
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default Settings;
