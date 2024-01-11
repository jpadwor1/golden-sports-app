import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export type Post = {
  poster: { name: string; imageURL: string };
  postBody: string;
  image: string;
  date: string;
  usersLiked: string[];
  comments: {
    user: string;
    comment: string | null | undefined;
    date: string;
    likes: string[] | null | undefined;
    replies: {
      user: string;
      comment: string | null | undefined;
      date: string;
      likes: string[] | null | undefined;
    }[];
  }[];
};

export type Posts = Post[];
