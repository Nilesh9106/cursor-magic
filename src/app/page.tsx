"use client";
import Posts from "@/components/Posts";
import PostForm from "@/components/PostForm";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Posts</h1>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <PostForm
            onPostCreated={() => {
              // This will trigger a refresh of the posts list
              window.location.reload();
            }}
          />
        </div>
        <Posts />
      </div>
    </div>
  );
}
