import type { New } from "@/types";

export const cache = new Map<string, New[]>();

export const addToCache = (key: string, value: New[]) => {
	cache.set(key, value);
};

export const getFromCache = (key: string): New[] | undefined => {
	return cache.get(key);
};

export const isCached = (key: string): boolean => {
	return cache.has(key);
};
