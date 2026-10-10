/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const STORAGE_KEY = "attirely_saved_items_v1";

const SavedItemsContext = createContext(null);

/**
 * Returns a stable, deterministic identifier for any product.
 * Falls back to product display name and brand if ID is missing.
 */
export function getStableProductId(product) {
  if (!product) return "";
  if (product.id !== undefined && product.id !== null && String(product.id).trim() !== "") {
    return String(product.id);
  }
  const name = (product.product_display_name || "").trim().toLowerCase();
  const brand = (product.brand_name || "").trim().toLowerCase();
  const price = product.price ?? "";
  const fallback = `${name}::${brand}::${price}`.replace(/[^a-z0-9_-]/g, "_");
  return fallback || "item_unknown";
}

/**
 * Sanitizes a product object to ensure it has all required display fields
 * and can be stored in localStorage safely.
 */
function createSavedProduct(product) {
  const stableId = getStableProductId(product);
  return {
    id: stableId,
    originalId: product.id ?? null,
    product_display_name: product.product_display_name || "Curated Fashion Piece",
    brand_name: product.brand_name || "Designer Studio",
    price: product.price ?? null,
    discounted_price: product.discounted_price ?? null,
    image_url: product.image_url || "/images/corset.jpg",
    base_colour: product.base_colour || null,
    article_type: product.article_type || product.sub_category || null,
    sub_category: product.sub_category || null,
    gender: product.gender || null,
    season: product.season || null,
    usage: product.usage || null,
    fabric: product.fabric || null,
    fit: product.fit || null,
    style_note: product.style_note || null,
    savedAt: Date.now(),
  };
}

/**
 * Safely loads saved items from localStorage.
 */
function loadInitialSavedItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === "object" && item.id);
  } catch (err) {
    console.warn("Attirely: Unable to read saved items from localStorage:", err);
    return [];
  }
}

export function SavedItemsProvider({ children }) {
  const [savedItems, setSavedItems] = useState(loadInitialSavedItems);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Synchronize changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    } catch (err) {
      console.warn("Attirely: Failed to persist saved items:", err);
    }
  }, [savedItems]);

  // Synchronize across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setSavedItems(updated);
          }
        } catch {
          // ignore corrupted cross-tab payload
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Quick lookup set for O(1) membership checks
  const savedItemIds = useMemo(() => {
    return new Set(savedItems.map((item) => String(item.id)));
  }, [savedItems]);

  const isSaved = useCallback(
    (product) => {
      if (!product) return false;
      const targetId = typeof product === "string" || typeof product === "number"
        ? String(product)
        : getStableProductId(product);
      return savedItemIds.has(targetId);
    },
    [savedItemIds]
  );

  const toggleSave = useCallback((product) => {
    if (!product) return false;
    const stableId = getStableProductId(product);

    setSavedItems((prev) => {
      const exists = prev.some((item) => String(item.id) === stableId);
      if (exists) {
        return prev.filter((item) => String(item.id) !== stableId);
      } else {
        const newItem = createSavedProduct(product);
        return [newItem, ...prev];
      }
    });

    return !savedItemIds.has(stableId);
  }, [savedItemIds]);

  const saveItem = useCallback((product) => {
    if (!product) return;
    const stableId = getStableProductId(product);
    setSavedItems((prev) => {
      if (prev.some((item) => String(item.id) === stableId)) {
        return prev;
      }
      return [createSavedProduct(product), ...prev];
    });
  }, []);

  const unsaveItem = useCallback((productOrId) => {
    if (!productOrId) return;
    const targetId = typeof productOrId === "string" || typeof productOrId === "number"
      ? String(productOrId)
      : getStableProductId(productOrId);

    setSavedItems((prev) => prev.filter((item) => String(item.id) !== targetId));
  }, []);

  const clearSavedItems = useCallback(() => {
    setSavedItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      savedItems,
      savedCount: savedItems.length,
      isSaved,
      toggleSave,
      saveItem,
      unsaveItem,
      clearSavedItems,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      savedItems,
      isSaved,
      toggleSave,
      saveItem,
      unsaveItem,
      clearSavedItems,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ]
  );

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider");
  }
  return context;
}
