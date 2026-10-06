import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ReviewsProvider } from "./context/ReviewsContext.jsx";
import { ReservationsProvider } from "./context/ReservationsContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <ReviewsProvider>
            <ReservationsProvider>
              <App />
              <Toaster position="top-center" />
            </ReservationsProvider>
          </ReviewsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
