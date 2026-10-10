/**
 * queryBuilder.js
 * 
 * Utilities to build high-precision, natural e-commerce search queries
 * from available product metadata, and generate outbound shopping links.
 */

const STOP_VALUES = new Set([
  "",
  "na",
  "n/a",
  "null",
  "none",
  "not applicable",
  "not_available",
  "undefined",
  "nan",
]);

/**
 * Sanitizes an attribute value and returns null if invalid/placeholder
 */
function sanitize(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (STOP_VALUES.has(s.toLowerCase())) return null;
  return s;
}

/**
 * Builds an intelligent, natural search phrase from available product metadata.
 * Example: "black oversized women's blazer" or "Turtle men navy blue cotton shirt"
 * 
 * Gracefully falls back when attributes are missing, avoiding keyword duplication.
 *
 * @param {Object} product - Product data object
 * @param {Object} [options]
 * @param {boolean} [options.includeBrand=true] - Whether to include the brand name
 * @returns {string} - Clean search query
 */
export function buildProductSearchQuery(product, options = {}) {
  if (!product) return "";

  const { includeBrand = true } = options;
  const seenTokens = new Set();
  const tokens = [];

  const addTerm = (term) => {
    const clean = sanitize(term);
    if (!clean) return;

    // Split words while preserving meaningful phrases
    const words = clean.split(/[\s,/_+-]+/);
    for (const rawWord of words) {
      const w = rawWord.trim();
      if (!w) continue;
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!lower) continue;

      if (!seenTokens.has(lower)) {
        seenTokens.add(lower);
        tokens.push(w);
      }
    }
  };

  // 1. Brand (if requested and present)
  if (includeBrand && product.brand_name) {
    addTerm(product.brand_name);
  }

  // 2. Gender normalization (e.g. Women -> Women, Men -> Men)
  const gender = sanitize(product.gender);
  if (gender && !["unisex", "all"].includes(gender.toLowerCase())) {
    addTerm(gender);
  }

  // 3. Color
  if (product.base_colour) {
    addTerm(product.base_colour);
  }

  // 4. Fit / Silhouette (e.g. Oversized, Slim Fit)
  if (product.fit) {
    addTerm(product.fit);
  }

  // 5. Pattern (e.g. Checked, Striped, Floral)
  const pattern = sanitize(product.pattern);
  if (pattern && pattern.toLowerCase() !== "solid") {
    addTerm(pattern);
  }

  // 6. Fabric / Material (e.g. Cotton, Linen, Denim)
  if (product.fabric) {
    addTerm(product.fabric);
  }

  // 7. Garment / Article Type or Product Display Name
  if (product.product_display_name) {
    addTerm(product.product_display_name);
  } else if (product.article_type) {
    addTerm(product.article_type);
  } else if (product.sub_category) {
    addTerm(product.sub_category);
  } else if (product.master_category) {
    addTerm(product.master_category);
  }

  // 8. Style or Occasion context if still short
  if (tokens.length < 3 && product.usage) {
    addTerm(product.usage);
  }

  return tokens.join(" ").trim();
}

/**
 * External e-commerce platforms supported for fashion searches.
 */
export const ECOMMERCE_PLATFORMS = [
  {
    id: "myntra",
    name: "Myntra",
    tagline: "India's premier fashion portal",
    badge: "Fashion First",
    brandColor: "#ff3f6c",
    getUrl: (query) => {
      const slug = query.trim().replace(/\s+/g, "-").toLowerCase();
      return `https://www.myntra.com/${encodeURIComponent(slug)}`;
    },
  },
  {
    id: "amazon",
    name: "Amazon",
    tagline: "Extensive catalogue & fast delivery",
    badge: "Wide Catalog",
    brandColor: "#ff9900",
    getUrl: (query) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
  },
  {
    id: "ajio",
    name: "AJIO",
    tagline: "Curated styles & indie fashion labels",
    badge: "Trending Styles",
    brandColor: "#2c4152",
    getUrl: (query) => `https://www.ajio.com/search/?text=${encodeURIComponent(query)}`,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    tagline: "Popular marketplace fashion collections",
    badge: "Marketplace",
    brandColor: "#2874f0",
    getUrl: (query) => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
  },
  {
    id: "zara",
    name: "Zara",
    tagline: "Contemporary & high-street silhouettes",
    badge: "Haute Ready-to-Wear",
    brandColor: "#1c1b19",
    getUrl: (query) => `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(query)}`,
  },
  {
    id: "hm",
    name: "H&M",
    tagline: "Modern conscious everyday essentials",
    badge: "Modern Basics",
    brandColor: "#e50010",
    getUrl: (query) => `https://www2.hm.com/en_in/search-results.html?q=${encodeURIComponent(query)}`,
  },
  {
    id: "google_shopping",
    name: "Google Shopping",
    tagline: "Compare prices across all web retailers",
    badge: "All Retailers",
    brandColor: "#4285f4",
    getUrl: (query) => `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`,
  },
];
