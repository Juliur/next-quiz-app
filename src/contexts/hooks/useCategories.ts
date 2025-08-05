import {
  CACHE_LIFETIME,
  CATEGORIES_STORAGE_KEY,
  STORAGE_TIMESTAMP_KEY,
} from "@/app/constants/quiz";
import { ICategory } from "@/contexts/types";
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesCachedData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      const now = Date.now();

      if (
        categoriesCachedData &&
        timestamp &&
        now - parseInt(timestamp) < CACHE_LIFETIME
      ) {
        setCategories(JSON.parse(categoriesCachedData));
        console.log("Categories loaded from LocalStorage.");
        return;
      }
      const response = await fetch("/api/get-categories");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: ICategory[] = await response.json();
      setCategories(data);
      console.log("Categories loaded from API.");

      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
  };
}
