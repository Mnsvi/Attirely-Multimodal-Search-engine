import searchsvg from "../../assets/icons/search.svg";
import homesvg from "../../assets/icons/home.svg";
import { useSavedItems } from "../../context/SavedItemsContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { savedCount, openDrawer } = useSavedItems();

  return (
    <header className="header">
      <h1 onClick={() => navigate("/")}>ATTIRELY</h1>
      <div className="header-buttons">
        <button
          className="search-button header-button"
          onClick={() => navigate("/#search")}
          title="Search"
          aria-label="Search"
        >
          <img className="icon" src={searchsvg} alt="Search" />
        </button>
        <button
          className="home-button header-button"
          onClick={() => navigate("/")}
          title="Home"
          aria-label="Home"
        >
          <img className="icon" src={homesvg} alt="Home" />
        </button>
        <button
          className="saved-button header-button"
          onClick={openDrawer}
          title={`Saved Items (${savedCount})`}
          aria-label={`Saved Items (${savedCount})`}
        >
          <svg viewBox="0 0 24 24" className="icon-heart">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {savedCount > 0 && <span className="header-saved-badge">{savedCount}</span>}
        </button>
      </div>
    </header>
  );
}

export default Header;
