import { create } from "zustand";
import { Post } from "../lib/blog";

export enum PasswordProtectError {
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  UNKNOWN = "UNKNOWN",
}

export interface PostState {
  post: Post | null;
  posts: Post[] | null;
  postContent: any | null;
  setPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  setPostContent: (postContent: any) => void;
  protect: {
    password: string;
    decryptedPostContent: any;
    error: PasswordProtectError | null;
    setPassword: (password: string) => void;
    setError: (error: PasswordProtectError) => void;
    setDecryptedContent: (decryptedPostContent: any) => void;
  };
}

const usePostStore = create<PostState>((set) => ({
  post: null,
  posts: null,
  postContent: null,
  setPost: (post: Post) => set((state) => ({ post })),
  setPosts: (posts: Post[]) => set((state) => ({ posts })),
  setPostContent: (postContent: any) => set((state) => ({ postContent })),
  protect: {
    password: "",
    decryptedPostContent: null,
    error: null,
    setPassword: (password: string) =>
      set((state) => ({ protect: { ...state.protect, password } })),
    setError: (error: PasswordProtectError) =>
      set((state) => ({ protect: { ...state.protect, error } })),
    setDecryptedContent: (decryptedPostContent: any) =>
      set((state) => ({
        protect: { ...state.protect, decryptedPostContent },
      })),
  },
}));

export default usePostStore;
