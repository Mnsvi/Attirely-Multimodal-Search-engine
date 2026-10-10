import HandleFilter from "./HandleFilter";
import "./ResultHeader.css";

function ResultHeader({
  total,
  userQuery,
  products,
  onApplyFilters,
  onShopSimilarTop,
}) {
  return (
    <div className="result-header-container">
      <div className="result-header-text">
        <div className="result-breadcrumb">
          <span>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span>Catalog</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Search Results</span>
        </div>
        <h1 className="result-main-title">
          Showing results for <span className="query-highlight">"{userQuery}"</span>
        </h1>
        <p className="result-count">{total} curated items found</p>
      </div>

      <div className="result-header-filter">
        {products && products[0] && onShopSimilarTop && (
          <button
            type="button"
            className="result-top-match-similar-btn"
            onClick={() => onShopSimilarTop(products[0])}
            title="Find similar styles for top matching garment online"
          >
            <span>Shop Top Match</span>
            <span className="top-match-arrow">↗</span>
          </button>
        )}

        <HandleFilter
          products={products}
          onApply={onApplyFilters}
        />
      </div>
    </div>
  );
}

export default ResultHeader;
