import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const API_URL = import.meta.env.BUN_PUBLIC_API_URL;
export const API_URL = "https://socialapp-u7hp.onrender.com";
