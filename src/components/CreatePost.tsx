"use client";
import { useState, useContext, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, X, Loader2 } from "lucide-react";
import AuthContext from "@/context/AuthContext";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure you are using AuthContextProvider.");
  }
  const { user } = authContext;
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that either text or image is provided
    if (!text.trim() && !image) return;

    setIsSubmitting(true);

    try {
      // Create form data for text + image
      const formData = new FormData();

      if (text.trim()) {
        formData.append("text", text);
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form
      setText("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Add new post to the list
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={1}
              className="resize-none border focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
            />

            {imagePreview && (
              <div className="mt-4 relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="max-h-64 w-full object-contain bg-gray-100"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <div>
                <Label
                  htmlFor="picture"
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Add Photo</span>
                  <input
                    id="picture"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || (!text.trim() && !image)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
