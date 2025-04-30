"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Facebook,
    Twitter,
    Linkedin,
    Link as LinkIcon,
    Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Post {
    _id: string;
}

interface SharePostProps {
    post: Post;
}

const SharePost = ({ post }: SharePostProps) => {
    const [showShareDialog, setShowShareDialog] = useState(false);
    const postUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/post/${post._id}`
        : '';

    const handleCopyLink = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(postUrl);
            toast("Post link has been copied to clipboard");
        }
    };

    const shareToSocial = (platform: "twitter" | "facebook" | "linkedin") => {
        let shareUrl: string;
        const text = "Check out this post on MemedIn!";

        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    postUrl
                )}&text=${encodeURIComponent(text)}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    postUrl
                )}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    postUrl
                )}`;
                break;
            default:
                return;
        }

        if (typeof window !== 'undefined') {
            window.open(shareUrl, "_blank", "width=600,height=400");
            setShowShareDialog(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="text-gray-500 hover:text-gray-700"
            >
                <Share2 className="h-4 w-4 mr-1" />
                Share
            </Button>

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Post</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Input readOnly value={postUrl} className="flex-1" />
                        </div>
                        <Button size="sm" onClick={handleCopyLink}>
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex justify-center space-x-4 py-4">
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full h-10 w-10 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
                            onClick={() => shareToSocial("twitter")}
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Share to Twitter</span>
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full h-10 w-10 bg-[#4267B2] hover:bg-[#4267B2]/90 text-white"
                            onClick={() => shareToSocial("facebook")}
                        >
                            <Facebook className="h-5 w-5" />
                            <span className="sr-only">Share to Facebook</span>
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full h-10 w-10 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
                            onClick={() => shareToSocial("linkedin")}
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">Share to LinkedIn</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SharePost;
