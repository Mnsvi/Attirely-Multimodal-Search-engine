import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedItems } from "../../context/SavedItemsContext";
import "./SavedItemsDrawer.css";

function SavedItemsDrawer({ onOpenShopSimilar }) {
  const navigate = useNavigate();
  const { savedItems, savedCount, unsaveItem, clearSavedItems, isDrawerOpen, closeDrawer } = useSavedItems();

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  const handleExploreClick = () => {
    closeDrawer();
    navigate("/products?query=corset");
  };

  const handleItemShopSimilar = (item) => {
    if (onOpenShopSimilar) {
      onOpenShopSimilar(item);
    } else {
      closeDrawer();
      navigate(`/products?query=${encodeURIComponent(item.product_display_name || "fashion")}`);
    }
  };

  return (
    <div
      className="saved-drawer-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drawer-title"
    >
      <aside className="saved-drawer" aria-label="Saved Items Drawer">
        {/* Drawer Header */}
        <div className="saved-drawer-header">
          <div className="saved-drawer-title-group">
            <span className="saved-drawer-kicker">CURATED CAPSULE</span>
            <div className="saved-drawer-heading-row">
              <h2 id="saved-drawer-title" className="saved-drawer-title">
                Saved Items
              </h2>
              <span className="saved-count-pill" aria-label={`${savedCount} items saved`}>
                {savedCount} {savedCount === 1 ? "piece" : "pieces"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="saved-close-btn"
            onClick={closeDrawer}
            aria-label="Close Saved Items drawer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="saved-drawer-content">
          {savedCount === 0 ? (
            /* Empty State */
            <div className="saved-empty-state">
              <div className="saved-empty-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="saved-empty-heart-icon">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="saved-empty-title">No saved styles yet</h3>
              <p className="saved-empty-subtitle">
                Save the pieces you love to build your personal aesthetic capsule and revisit them anytime.
              </p>
              <button
                type="button"
                className="saved-empty-cta-btn"
                onClick={handleExploreClick}
              >
                <span>EXPLORE CURATED CATALOG</span>
                <span className="cta-arrow">→</span>
              </button>
            </div>
          ) : (
            /* List of Saved Items */
            <div className="saved-items-list" role="list">
              {savedItems.map((item) => {
                const price = item.discounted_price ?? item.price;
                const hasDiscount = item.discounted_price && item.discounted_price < item.price;

                return (
                  <article key={item.id} className="saved-item-card" role="listitem">
                    {/* Thumbnail Image */}
                    <div className="saved-item-img-wrap">
                      <img
                        src={item.image_url}
                        alt={item.product_display_name || "Saved piece"}
                        className="saved-item-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/corset.jpg";
                        }}
                      />
                      {item.base_colour && (
                        <span className="saved-item-color-tag">{item.base_colour}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="saved-item-info">
                      <div className="saved-item-header">
                        <span className="saved-item-brand">
                          {item.brand_name || "Designer Studio"}
                        </span>
                        {/* Remove / Unsave Button */}
                        <button
                          type="button"
                          className="saved-item-remove-btn"
                          onClick={() => unsaveItem(item.id)}
                          aria-label={`Remove ${item.product_display_name} from saved items`}
                          title="Remove from saved items"
                        >
                          <svg viewBox="0 0 24 24" className="remove-icon" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      <h4 className="saved-item-name" title={item.product_display_name}>
                        {item.product_display_name}
                      </h4>

                      <div className="saved-item-pricing">
                        {hasDiscount && (
                          <span className="saved-actual-price">
                            INR {item.price?.toLocaleString()}
                          </span>
                        )}
                        <span className="saved-discount-price">
                          INR {typeof price === "number" ? price.toLocaleString() : price || "—"}
                        </span>
                      </div>

                      {/* Action CTAs */}
                      <div className="saved-item-actions">
                        <button
                          type="button"
                          className="saved-shop-similar-btn"
                          onClick={() => handleItemShopSimilar(item)}
                          title="Search for similar items on external e-commerce platforms"
                        >
                          <span>Shop Similar</span>
                          <span className="shop-similar-arrow">↗</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {savedCount > 0 && (
          <footer className="saved-drawer-footer">
            <div className="saved-footer-meta">
              <span className="saved-footer-note">
                Stored in this browser • Ready to search online
              </span>
              <button
                type="button"
                className="saved-clear-all-btn"
                onClick={clearSavedItems}
                title="Clear all saved items"
              >
                Clear all
              </button>
            </div>
            <button
              type="button"
              className="saved-continue-btn"
              onClick={closeDrawer}
            >
              CONTINUE DISCOVERY
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

export default SavedItemsDrawer;
