"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReplyForm from "./ReplyForm";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  replies: Post[];
}

function PostCard({ post, level = 0 }: { post: Post; level?: number }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Post[]>(post.replies);
  const [loading, setLoading] = useState(false);

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`);
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
    setLoading(false);
  };

  const toggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplyCreated = () => {
    setShowReplyForm(false);
    fetchReplies();
    setShowReplies(true);
  };

  return (
    <Card className={`mb-4 ${level > 0 ? "ml-8" : ""}`}>
      <CardHeader className="py-3">
        <p className="text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleReplies}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : showReplies
              ? "Hide Comments"
              : `Show Comments (${post?.replies?.length})`}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </Button>
        </div>

        {showReplyForm && (
          <div className="mt-4">
            <ReplyForm
              parentId={post.id}
              onReplyCreated={handleReplyCreated}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {showReplies && (
          <div className="mt-4">
            {replies?.map((reply) => (
              <PostCard key={reply.id} post={reply} level={level + 1} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
