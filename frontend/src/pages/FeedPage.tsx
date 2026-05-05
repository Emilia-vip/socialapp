import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, LogOut, Search } from "lucide-react";
import type { Auth } from "../App";
import { API_URL } from "@/lib/utils";

type Post = {
  id: number;
  caption: string | null;
  image_url: string;
  username: string;
  created_at: string;
};

type Props = {
  auth: Auth;
  onLogout: () => void;
};

export default function FeedPage({ auth, onLogout }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [followInput, setFollowInput] = useState("");
  const [followMsg, setFollowMsg] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const authHeader = { Authorization: `Bearer ${auth.token}` };

  const fetchFeed = async () => {
    setFeedLoading(true);
    setFeedError("");
    try {
      const res = await fetch(`${API_URL}/feed`, { headers: authHeader });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data);
    } catch {
      setFeedError("Could not load feed.");
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: authHeader,
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setCreateError(data.message ?? "Failed to create post");
        return;
      }

      formRef.current?.reset();
      setShowCreate(false);
      fetchFeed();
    } catch {
      setCreateError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleFollow = async () => {
    const username = followInput.trim();
    if (!username) return;
    setFollowMsg("");

    try {
      const res = await fetch(`${API_URL}/toggle-follow/${username}`, {
        method: "POST",
        headers: authHeader,
      });
      const data = await res.json();
      setFollowMsg(data.message ?? "Done");
      setFollowInput("");
    } catch {
      setFollowMsg("Network error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50 w-full">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-10 px-4 py-3 flex items-center justify-between shadow-lg">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Georgia, serif", letterSpacing: "-1px" }}>
          socialapp
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/90">
            {auth.user.username}
          </span>
          <Button size="sm" variant="ghost" onClick={onLogout} className="p-1.5 text-white hover:bg-white/20">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-col gap-4 p-0 flex-1 w-full">
        {/* Toolbar */}
        <div className="border-b border-gray-300 px-6 py-3 flex gap-4 items-center flex-wrap bg-white sticky top-12 z-40 shadow-sm">
          <Button
            size="sm"
            className={showCreate ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90"}
            onClick={() => {
              setShowCreate((v) => !v);
              setCreateError("");
            }}
          >
            {showCreate ? "Cancel" : "New post"}
          </Button>

          <div className="flex gap-2 items-center ml-auto">
            <Input
              className="h-9 w-48 text-sm rounded-full px-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200"
              placeholder="Search users…"
              value={followInput}
              onChange={(e) => setFollowInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleToggleFollow()}
            />
            <Button size="sm" className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90" onClick={handleToggleFollow}>
              Follow
            </Button>
          </div>
        </div>

        {followMsg && (
          <p className="text-sm text-gray-600 px-6">{followMsg}</p>
        )}

        {/* Create post */}
        {showCreate && (
          <Card className="mx-6 border border-gray-200 rounded-lg shadow-lg">
            <CardHeader className="py-4 px-5 border-b border-gray-200">
              <h3 className="font-semibold text-center">Create a new post</h3>
            </CardHeader>
            <CardContent className="pt-5">
              <form
                ref={formRef}
                onSubmit={handleCreatePost}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    name="caption"
                    placeholder="Write a caption…"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="image">Image (JPEG or PNG)</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png"
                    required
                  />
                </div>
                {createError && (
                  <p className="text-sm text-destructive">{createError}</p>
                )}
                <Button type="submit" disabled={creating}>
                  {creating ? "Posting…" : "Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Feed */}
        {feedLoading && (
          <p className="text-sm text-gray-500 text-center py-8">
            Loading feed…
          </p>
        )}

        {feedError && (
          <p className="text-sm text-red-500 text-center py-4">
            {feedError}
          </p>
        )}

        {!feedLoading && !feedError && posts.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-12">
            No posts yet — follow someone to see their posts here.
          </p>
        )}

        <div className="flex-1 w-full">
          <div className="max-w-2xl mx-auto">
            {posts.map((post) => (
              <div key={post.id} className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-lg my-2 p-[2px] shadow-sm hover:shadow-md transition">
                <Card className="rounded-lg border-0 overflow-hidden">
                {/* Post header */}
                <CardHeader className="py-2 px-3 flex-row items-center gap-2 bg-white">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-xs font-semibold shrink-0 text-white">
                    {post.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">{post.username}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </CardHeader>

                {/* Post image */}
                <img
                  src={post.image_url}
                  alt={post.caption ?? "Post image"}
                  className="w-full aspect-square object-cover"
                />

                {/* Engagement buttons */}
                <div className="px-3 py-1.5 flex gap-3 border-b border-gray-200">
                  <button className="text-gray-600 hover:text-pink-500 p-1 hover:bg-pink-50 rounded transition">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-blue-500 p-1 hover:bg-blue-50 rounded transition">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-purple-500 p-1 hover:bg-purple-50 rounded transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption */}
                {post.caption && (
                  <CardContent className="py-2 px-3">
                    <p className="text-xs">
                      <span className="font-semibold mr-1">{post.username}</span>
                      {post.caption}
                    </p>
                  </CardContent>
                )}
              </Card>
            </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
