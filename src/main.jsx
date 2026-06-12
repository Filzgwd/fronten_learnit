import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../css/auth.css";

import { RouterProvider } from "react-router";
import { router } from "./app/router";
import AppErrorBoundary from "./app/AppErrorBoundary";

import { AuthProvider } from "./features/auth/authContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AppErrorBoundary>

      <GoogleOAuthProvider
        clientId={
          import.meta.env
            .VITE_GOOGLE_CLIENT_ID
        }
      >

        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>

      </GoogleOAuthProvider>

    </AppErrorBoundary>

  </React.StrictMode>
);
