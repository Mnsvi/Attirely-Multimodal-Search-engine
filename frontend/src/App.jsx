import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Category from "./pages/Category";
import ExploreMore from "./pages/ExploreMore";
import { SavedItemsProvider } from "./context/SavedItemsContext";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <SavedItemsProvider>
      <ScrollToTop />

      <Routes>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="category/:categoryName" element={<Category />} />
        <Route path="explore" element={<ExploreMore />} />
      </Routes>
    </SavedItemsProvider>
  );
}

export default App;