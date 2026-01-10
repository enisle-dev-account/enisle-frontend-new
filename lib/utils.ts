import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalizeNames(...names: Array<string | null | undefined>): string {
    return names
        .filter((n): n is string => typeof n === "string" && n.trim().length > 0)
        .map(n => {
            const s = n.trim()
            return s[0].toUpperCase() + s.slice(1)
        })
        .join(" ")
}