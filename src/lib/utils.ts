import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Like, File, Comment, Member as User } from "@prisma/client";
import { db } from "@/db";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3);
}

export async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function generateGroupCode(): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const currentGroup = await db.group.findUnique({
    where: {
      groupCode: result,
    },
  });

  if (currentGroup) {
    return generateGroupCode();
  }

  return result;
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
