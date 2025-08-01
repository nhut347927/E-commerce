import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeAgo(isoDateString: string): string {
  const now = new Date();
  const past = new Date(isoDateString);

  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minutes`;
  if (hours < 24) return `${hours} hours`;
  if (days < 7) return `${days} days`;
  if (weeks < 4) return `${weeks} weeks`;
  if (months < 12) return `${months} months`;
  return `${years} years`;
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // sẽ bao gồm cả header: data:image/png;base64,...
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function formatDateTime(input: string): string {
  // Cắt bớt phần microseconds nếu có (ví dụ: .825086)
  const safeInput = input.split(".")[0]; // "2025-08-01T20:19:45"

  const date = new Date(safeInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const pad = (n: number): string => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
