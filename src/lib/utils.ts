import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Like, File, Comment, User } from '@prisma/client';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3);
}

export type Reply = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  replyToId: string | null;
  replies: Comment[];
  author: User;
  likes: Like[];
};

export type Post = {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: Like[];
  comments: {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    timestamp: Date;    
  }[];
  Files: File[];
  author: User;
};

export type Posts = Post[];
