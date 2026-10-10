import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSavedItems } from "../../context/SavedItemsContext";
import SavedItemsDrawer from "../saved/SavedItemsDrawer";
import ShopSimilarModal from "../products/ShopSimilarModal";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedCount, openDrawer } = useSavedItems();
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopSimilarProduct, setShopSimilarProduct] = useState(null);
  const lastScrollYRef = useRef(0);

  // Always show navbar on route change
  useEffect(() => {
    setNavHidden(false);
    lastScrollYRef.current = window.scrollY;
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;
    const threshold = 10; // Scroll threshold to avoid flickering

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        const delta = currentScrollY - lastScrollY;

        setScrolled(currentScrollY > 20);

        if (mobileMenuOpen) {
          setNavHidden(false);
        } else if (currentScrollY <= 40) {
          // At the top of each page, show navbar normally
          setNavHidden(false);
        } else if (Math.abs(delta) >= threshold) {
          if (delta > 0 && currentScrollY > 80) {
            // Scrolling down -> smoothly slide upward and out of view
            setNavHidden(true);
          } else if (delta < 0) {
            // Scrolling up -> smoothly bring it back into view
            setNavHidden(false);
          }
        }

        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const handleSearchClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#search");
    }
  };

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
    }
  };

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryNav = (cat) => {
    setMobileMenuOpen(false);
    navigate(`/category/${cat}`);
  };

  return (
    <>
      <div className={`navbar-master ${navHidden ? "navbar-hidden" : ""}`}>
        {/* Top Editorial Announcement Ribbon */}
        <aside className="announcement-bar" aria-label="Announcement">
          <div className="announcement-content">
            <span className="announcement-tag">AI MULTIMODAL</span>
            <span className="announcement-text">Curated fashion discovery with semantic neural search & styling</span>
            <span className="announcement-link" onClick={() => navigate("/explore")}>Explore Lookbook →</span>
          </div>
        </aside>

        <header className={`category-header ${scrolled ? "header-scrolled" : ""}`}>
          <div className="header-inner">
            {/* Left Navigation Links */}
            <nav className="nav-links desktop-only" aria-label="Main Navigation">
              <button className="nav-link" onClick={handleHomeClick}>
                Home
              </button>
              <div className="nav-dropdown-wrapper">
                <button className="nav-link nav-link--has-dropdown" onClick={() => handleCategoryNav("Corset")}>
                  Categories <span className="dropdown-caret">▾</span>
                </button>
                <div className="nav-dropdown-menu">
                  <button className="dropdown-item" onClick={() => handleCategoryNav("Corset")}>Corsets</button>
                  <button className="dropdown-item" onClick={() => handleCategoryNav("Skirt")}>Skirts</button>
                  <button className="dropdown-item" onClick={() => handleCategoryNav("Bag")}>Handbags</button>
                  <button className="dropdown-item" onClick={() => handleCategoryNav("Boots")}>Boots & Shoes</button>
                  <button className="dropdown-item" onClick={() => handleCategoryNav("Accessories")}>Accessories</button>
                </div>
              </div>
              <button className="nav-link" onClick={() => navigate("/explore")}>
                Lookbook
              </button>
              <button className="nav-link" onClick={handleSearchClick}>
                AI Search
              </button>
              <button className="nav-link" onClick={handleContactClick}>
                Atelier Concierge
              </button>
            </nav>

            {/* Centered Brand Logo */}
            <div
              className="brand-logo"
              onClick={handleHomeClick}
              role="button"
              tabIndex={0}
              aria-label="ATTIRELY Home"
            >
              <span className="brand-logo-text">ATTIRELY</span>
              <span className="brand-logo-sub">STUDIO</span>
            </div>

            {/* Right Action Icons */}
            <div className="header-icons">
              {/* SEARCH */}
              <button
                className="nav-icon"
                onClick={handleSearchClick}
                title="Search fashion items"
                aria-label="Search"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6.5" />
                  <line x1="16" y1="16" x2="21" y2="21" />
                </svg>
                <span className="visually-hidden">Search</span>
              </button>

              {/* HOME */}
              <button
                className="nav-icon desktop-only"
                onClick={handleHomeClick}
                title="Return to Home"
                aria-label="Home"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 11.5L12 4l9 7.5" />
                  <path d="M5.5 10.5V20h13v-9.5" />
                  <path d="M9.5 20v-5.5h5V20" />
                </svg>
                <span className="visually-hidden">Home</span>
              </button>

              {/* SAVED ITEMS / WISHLIST */}
              <button
                className="nav-icon saved-icon-btn"
                onClick={openDrawer}
                title={`Saved Items (${savedCount})`}
                aria-label={`Saved Items (${savedCount} pieces saved)`}
              >
                <svg viewBox="0 0 24 24" className="saved-nav-heart">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {savedCount > 0 && <span className="saved-badge">{savedCount}</span>}
                <span className="visually-hidden">Saved Items</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="nav-icon mobile-toggle mobile-only"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <nav className="mobile-menu" aria-label="Mobile Navigation">
              <button className="mobile-nav-link" onClick={handleHomeClick}>Home</button>
              <button className="mobile-nav-link" onClick={handleSearchClick}>AI Search</button>
              <button
                className="mobile-nav-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDrawer();
                }}
              >
                Saved Items {savedCount > 0 ? `(${savedCount})` : ""}
              </button>
              <button className="mobile-nav-link" onClick={handleContactClick}>Atelier Concierge</button>
              <div className="mobile-categories-group">
                <span className="mobile-cat-header">CATEGORIES</span>
                <div className="mobile-cat-grid">
                  <button onClick={() => handleCategoryNav("Corset")}>Corsets</button>
                  <button onClick={() => handleCategoryNav("Skirt")}>Skirts</button>
                  <button onClick={() => handleCategoryNav("Bag")}>Handbags</button>
                  <button onClick={() => handleCategoryNav("Boots")}>Boots</button>
                  <button onClick={() => handleCategoryNav("Accessories")}>Accessories</button>
                </div>
              </div>
              <button className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); navigate("/explore"); }}>
                Lookbook
              </button>
            </nav>
          )}
        </header>
      </div>

      {/* Dedicated Saved Items Drawer */}
      <SavedItemsDrawer onOpenShopSimilar={(item) => setShopSimilarProduct(item)} />

      {/* Connected Shop Similar Modal from Saved Items */}
      <ShopSimilarModal
        product={shopSimilarProduct}
        isOpen={Boolean(shopSimilarProduct)}
        onClose={() => setShopSimilarProduct(null)}
      />
    </>
  );
}

export default Navbar;