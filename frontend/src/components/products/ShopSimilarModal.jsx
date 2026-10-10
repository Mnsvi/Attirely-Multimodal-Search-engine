import { useState, useEffect } from "react";
import { buildProductSearchQuery, ECOMMERCE_PLATFORMS } from "../../utils/queryBuilder.js";
import HeartButton from "../common/HeartButton";
import "./ShopSimilarModal.css";

function ShopSimilarModal({ product, isOpen, onClose }) {
  const [includeBrand, setIncludeBrand] = useState(true);
  const [customQueryOverride, setCustomQueryOverride] = useState(null);
  const [copied, setCopied] = useState(false);

  // Compute generated query based on current product and brand toggle
  const generatedQuery = product
    ? buildProductSearchQuery(product, { includeBrand })
    : "";

  // Use customized query if user edited it, otherwise default to generated
  const activeQuery = customQueryOverride !== null ? customQueryOverride : generatedQuery;

  // Handle ESC key to close & prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const price = product.discounted_price ?? product.price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  const handleCopyQuery = () => {
    if (!activeQuery) return;
    navigator.clipboard?.writeText(activeQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Collect attributes for metadata pills
  const attributes = [
    product.base_colour && { label: "Colour", val: product.base_colour },
    product.fabric && { label: "Fabric", val: product.fabric },
    product.fit && { label: "Fit", val: product.fit },
    product.pattern && { label: "Pattern", val: product.pattern },
    product.gender && { label: "Gender", val: product.gender },
    product.article_type && { label: "Category", val: product.article_type },
    product.season && { label: "Season", val: product.season },
    product.usage && { label: "Occasion", val: product.usage },
  ].filter(Boolean);

  return (
    <div
      className="shop-similar-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-similar-title"
    >
      <div className="shop-similar-modal">
        {/* Close Button */}
        <button
          type="button"
          className="shop-similar-close-btn"
          onClick={onClose}
          aria-label="Close similar styles finder"
        >
          ✕
        </button>

        {/* Modal Header */}
        <header className="shop-similar-header">
          <div className="shop-similar-kicker-row">
            <span className="shop-similar-kicker">EXTERNAL MARKETPLACE CURATION</span>
            <span className="shop-similar-leaves-attirely-tag">Opens External Stores ↗</span>
          </div>
          <h2 id="modal-similar-title" className="shop-similar-title">
            Find Similar Styles
          </h2>
          <p className="shop-similar-subtitle">
            Search for this aesthetic, silhouette, and fabric on leading fashion e-commerce platforms.
          </p>
        </header>

        {/* Modal Main Content */}
        <div className="shop-similar-body">
          {/* LEFT: Selected Garment Context */}
          <aside className="shop-similar-product-card">
            <div className="shop-similar-img-wrap">
              {product.base_colour && (
                <span className="shop-similar-badge">{product.base_colour}</span>
              )}

              <HeartButton
                product={product}
                size="md"
                className="shop-similar-heart-btn"
              />

              <img
                src={product.image_url}
                alt={product.product_display_name || "Garment match"}
                className="shop-similar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/corset.jpg";
                }}
              />
            </div>

            <div className="shop-similar-details">
              <span className="shop-similar-brand">
                {product.brand_name || "Editorial Collection"}
              </span>
              <h3 className="shop-similar-garment-name">
                {product.product_display_name || "Curated Garment"}
              </h3>

              <div className="shop-similar-pricing">
                {hasDiscount && (
                  <span className="shop-similar-actual-price">
                    INR {product.price?.toLocaleString()}
                  </span>
                )}
                <span className="shop-similar-current-price">
                  INR {typeof price === "number" ? price.toLocaleString() : price || "—"}
                </span>
              </div>

              {/* Attributes Chips */}
              {attributes.length > 0 && (
                <div className="shop-similar-attrs">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className="shop-similar-attr-pill">
                      <span className="attr-label">{attr.label}:</span>
                      <span className="attr-val">{attr.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Style Note */}
              {product.style_note && (
                <div className="shop-similar-styling-advice">
                  <span className="styling-advice-label">AI STYLING NOTE</span>
                  <p className="styling-advice-text">{product.style_note}</p>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT: Search Query & Shopping Platforms */}
          <section className="shop-similar-platforms-section">
            {/* Search Phrase Box */}
            <div className="shop-similar-query-box">
              <div className="query-box-top">
                <span className="query-box-label">OPTIMIZED SEARCH PHRASE</span>
                <div className="query-actions">
                  {product.brand_name && (
                    <button
                      type="button"
                      className={`query-toggle-btn ${includeBrand ? "query-toggle-btn--active" : ""}`}
                      onClick={() => {
                        setCustomQueryOverride(null);
                        setIncludeBrand(!includeBrand);
                      }}
                      title="Include or omit the brand name from the search query"
                    >
                      {includeBrand ? "✓ Brand Included" : "+ Include Brand"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="query-copy-btn"
                    onClick={handleCopyQuery}
                    title="Copy query phrase to clipboard"
                  >
                    {copied ? "Copied!" : "Copy Phrase"}
                  </button>
                </div>
              </div>

              <div className="query-input-wrap">
                <input
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setCustomQueryOverride(e.target.value)}
                  className="query-editable-input"
                  placeholder="Enter or customize query phrase..."
                  aria-label="Search query phrase for external platforms"
                />
              </div>

              <p className="query-help-text">
                This search phrase is constructed using the item's silhouette, color, fabric, and attributes.
                You can edit this phrase anytime to refine third-party search results.
              </p>
            </div>

            {/* Platform Options Grid */}
            <div className="shop-similar-platforms-header">
              <h4 className="platforms-heading">Select Shopping Platform</h4>
              <span className="platforms-count">{ECOMMERCE_PLATFORMS.length} destinations</span>
            </div>

            <div className="shop-similar-platforms-grid">
              {ECOMMERCE_PLATFORMS.map((platform) => {
                const targetUrl = platform.getUrl(activeQuery);

                return (
                  <a
                    key={platform.id}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-card"
                    title={`Search for "${activeQuery}" on ${platform.name} (Opens in new tab)`}
                  >
                    <div className="platform-card-main">
                      <div className="platform-header-row">
                        <div className="platform-name-wrap">
                          <span
                            className="platform-color-indicator"
                            style={{ backgroundColor: platform.brandColor }}
                          />
                          <h5 className="platform-name">{platform.name}</h5>
                        </div>
                        <span className="platform-badge">{platform.badge}</span>
                      </div>

                      <p className="platform-tagline">{platform.tagline}</p>
                    </div>

                    <div className="platform-card-action">
                      <span className="platform-cta-text">Search on {platform.name}</span>
                      <span className="platform-external-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Disclaimer / Notice */}
            <footer className="shop-similar-disclaimer">
              <span className="disclaimer-icon">ℹ</span>
              <p>
                <strong>Disclosure:</strong> Clicking these options directs you to external third-party
                marketplaces. These links perform live stylistic searches based on available garment metadata.
                Product availability, pricing, and exact silhouette matches are determined independently by each
                platform.
              </p>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShopSimilarModal;
