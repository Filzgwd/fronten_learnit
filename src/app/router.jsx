import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";

import PrivateAuth from "../features/auth/PrivateAuth";
import PublicAuth from "../features/auth/PublicAuth";
import AllowRole from "../features/auth/AllowRole";

const Landing = React.lazy(() => import("../pages/Landing"));
const LandingLayout = React.lazy(() => import("../pages/LandingLayout"));
const AboutUs = React.lazy(() => import("../pages/AboutUs"));
const DashboardPage = React.lazy(() => import("../pages/dashboard"));
const MateriDetailPage = React.lazy(() => import("../pages/materi"));
const MateriReadPage = React.lazy(() => import("../pages/materi/Read"));
const QuizPage = React.lazy(() => import("../pages/materi/Quiz"));
const MateriOverviewPage = React.lazy(() => import("../pages/materi/Overview"));
const SigninPage = React.lazy(() => import("../pages/auth/Signin"));
const SignupPage = React.lazy(() => import("../pages/auth/Signup"));
const ForgotPasswordPage = React.lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPasswordPage = React.lazy(() => import("../pages/auth/ResetPassword"));
const GoogleCallbackPage = React.lazy(() => import("../pages/auth/GoogleCallback"));
const NilaiPage = React.lazy(() => import("../pages/Nilai"));
const ForumPage = React.lazy(() => import("../pages/Forum"));
const AdminPage = React.lazy(() => import("../pages/Admin"));
const AdminHomePage = React.lazy(() => import("../pages/admin/Home"));
const AdminMateriPage = React.lazy(() => import("../pages/admin/Materi"));
const AdminQuizPage = React.lazy(() => import("../pages/admin/Quiz"));
const AdminUsersPage = React.lazy(() => import("../pages/admin/Users"));
const AdminSettingsPage = React.lazy(() => import("../pages/admin/Settings"));
const UnauthorizedPage = React.lazy(() => import("../pages/Unauthorized"));
const NotFound = React.lazy(() => import("../pages/NotFound"));

function PageLoader({ children }) {
  return (
    <Suspense fallback={<div className="page-loader">Memuat...</div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageLoader>
        <LandingLayout />
      </PageLoader>
    ),
    children: [
      { index: true, element: <Landing /> },
      { path: "tentang-kami", element: <AboutUs /> },
    ],
  },
  {
    path: "/signin",
    element: (
      <PublicAuth>
        <PageLoader>
          <SigninPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/auth/google/callback",
    element: (
      <PublicAuth>
        <PageLoader>
          <GoogleCallbackPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicAuth>
        <PageLoader>
          <SignupPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/daftar-ulang",
    element: (
      <PublicAuth>
        <PageLoader>
          <SignupPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicAuth>
        <PageLoader>
          <ForgotPasswordPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/lupa-password",
    element: (
      <PublicAuth>
        <PageLoader>
          <ForgotPasswordPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <PublicAuth>
        <PageLoader>
          <ResetPasswordPage />
        </PageLoader>
      </PublicAuth>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateAuth>
        <PageLoader>
          <DashboardPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/materi",
    element: (
      <PrivateAuth>
        <PageLoader>
          <MateriOverviewPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/materi/:pathKey/:materialId",
    element: (
      <PrivateAuth>
        <PageLoader>
          <MateriReadPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/materi/:pathKey",
    element: (
      <PrivateAuth>
        <PageLoader>
          <MateriDetailPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/quiz/:pathKey",
    element: (
      <PrivateAuth>
        <PageLoader>
          <QuizPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/nilai",
    element: (
      <PrivateAuth>
        <PageLoader>
          <NilaiPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/forum",
    element: (
      <PrivateAuth>
        <PageLoader>
          <ForumPage />
        </PageLoader>
      </PrivateAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateAuth>
        <AllowRole allowedRoles={["admin"]}>
          <PageLoader>
            <AdminPage />
          </PageLoader>
        </AllowRole>
      </PrivateAuth>
    ),
    children: [
      {
        index: true,
        element: (
          <PageLoader>
            <AdminHomePage />
          </PageLoader>
        ),
      },
      {
        path: "materi",
        element: (
          <PageLoader>
            <AdminMateriPage />
          </PageLoader>
        ),
      },
      {
        path: "quiz",
        element: (
          <PageLoader>
            <AdminQuizPage />
          </PageLoader>
        ),
      },
      {
        path: "users",
        element: (
          <PageLoader>
            <AdminUsersPage />
          </PageLoader>
        ),
      },
      {
        path: "settings",
        element: (
          <PageLoader>
            <AdminSettingsPage />
          </PageLoader>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <PageLoader>
        <UnauthorizedPage />
      </PageLoader>
    ),
  },
  {
    path: "*",
    element: (
      <PageLoader>
        <NotFound />
      </PageLoader>
    ),
  },
]);
