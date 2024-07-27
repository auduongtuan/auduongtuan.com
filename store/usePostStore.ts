import { create } from "zustand";
import { Post } from "@lib/notion";

export interface PostState {
  post: Post | null;
  posts: Post[] | null;
  postContent: any | null;
  setPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  setPostContent: (postContent: any) => void;
}

const usePostStore = create<PostState>((set) => ({
  post: null,
  posts: null,
  postContent: null,
  setPost: (post: Post) => set((state) => ({ post })),
  setPosts: (posts: Post[]) => set((state) => ({ posts })),
  setPostContent: (postContent: any) => set((state) => ({ postContent })),
}));

export default usePostStore;
