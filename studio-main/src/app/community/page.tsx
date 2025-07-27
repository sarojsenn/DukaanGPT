
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send, Image as ImageIcon, X, Camera } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CameraCapture } from "@/components/camera-capture";


interface Post {
  id: number;
  username: string;
  avatarUrl: string;
  postImageUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const initialCommunityPosts: Post[] = [
  {
    id: 1,
    username: "Mumbai Chaat Corner",
    avatarUrl: "https://placehold.co/100x100.png",
    postImageUrl: "https://placehold.co/600x400.png",
    caption: "Business is booming today! Thanks to the fresh tomatoes from Krishna Vegetables. #DukaanGPT #StreetFood",
    likes: 42,
    comments: 5,
    isLiked: false,
  },
  {
    id: 2,
    username: "Bangalore Dosa Hub",
    avatarUrl: "https://placehold.co/100x100.png",
    postImageUrl: "https://placehold.co/600x400.png",
    caption: "Experimenting with a new dosa recipe. What do you all think? Anyone have a good chutney recipe to share?",
    likes: 128,
    comments: 23,
    isLiked: true,
  },
   {
    id: 3,
    username: "Delhi Parathe Wali",
    avatarUrl: "https://placehold.co/100x100.png",
    postImageUrl: "https://placehold.co/600x400.png",
    caption: "Looking for a reliable supplier for high-quality paneer in West Delhi. Any recommendations?",
    likes: 15,
    comments: 8,
    isLiked: false,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialCommunityPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check local storage for new posts from other pages
    const newPostsFromStorage = JSON.parse(localStorage.getItem('newCommunityPosts') || '[]');
    if (newPostsFromStorage.length > 0) {
      setPosts(prevPosts => [...newPostsFromStorage, ...prevPosts]);
      localStorage.removeItem('newCommunityPosts'); // Clear after adding
    }
  }, []);


  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCreatePost = () => {
    if (!newPostContent.trim() && !newPostImage) return;

    const newPost: Post = {
      id: Date.now(),
      username: "You",
      avatarUrl: "https://placehold.co/100x100.png",
      caption: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      postImageUrl: newPostImage || undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        };
      }
      return post;
    }));
  };
  
  const handleCapture = (imageDataUri: string) => {
    setNewPostImage(imageDataUri);
    setIsCameraDialogOpen(false);
  }


  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            DukaanGPT Community
            </h1>
            <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
            Connect, share, and grow with fellow vendors.
            </p>
        </div>

        {/* Create Post Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="Your avatar"/>
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="w-full space-y-4">
                <Input 
                  placeholder="What's on your mind?" 
                  className="h-12 text-base"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                />
                {newPostImage && (
                    <div className="relative aspect-video rounded-lg border">
                        <Image src={newPostImage} alt="Preview" fill className="object-cover rounded-lg"/>
                         <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full"
                            onClick={() => setNewPostImage(null)}
                         >
                            <X className="h-4 w-4" />
                         </Button>
                    </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
                 <Button variant="ghost" onClick={handleImageSelect}>
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Add Photo
                </Button>
                <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <Camera className="mr-2 h-5 w-5" />
                            Use Camera
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                         <DialogHeader>
                            <DialogTitle>Capture Photo</DialogTitle>
                         </DialogHeader>
                        <CameraCapture onCapture={handleCapture} />
                    </DialogContent>
                </Dialog>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button onClick={handleCreatePost} disabled={!newPostContent.trim() && !newPostImage}>
              <Send className="mr-2 h-4 w-4" />
              Post
            </Button>
          </CardFooter>
        </Card>

        {/* Community Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatarUrl} alt={post.username}/>
                    <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{post.username}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{post.caption}</p>
                {post.postImageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                        src={post.postImageUrl}
                        alt="Community post"
                        fill
                        className="object-cover"
                    />
                    </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                    <Heart 
                      className={`mr-2 h-4 w-4 ${post.isLiked ? 'text-red-500 fill-red-500' : ''}`} 
                    /> {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" /> {post.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Send className="mr-2 h-4 w-4" /> Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
