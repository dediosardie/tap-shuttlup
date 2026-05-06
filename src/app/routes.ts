import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { NotFound } from "./components/NotFound";
import { ProfilePage } from "./components/tap/ProfilePage";
import { QrPage } from "./components/tap/QrPage";
import { TapRedirectPage } from "./components/tap/TapRedirectPage";
import { RequireAuth } from "./components/RequireAuth";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { DashboardAnalyticsPage } from "./components/dashboard/DashboardAnalyticsPage";
import { DashboardCardsPage } from "./components/dashboard/DashboardCardsPage";
import { DashboardProfilePage } from "./components/dashboard/DashboardProfilePage";
import { DashboardModesPage } from "./components/dashboard/DashboardModesPage";
import { DashboardThemesPage } from "./components/dashboard/DashboardThemesPage";
import { DashboardSettingsPage } from "./components/dashboard/DashboardSettingsPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { OnboardingPage } from "./components/auth/OnboardingPage";

export const router = createBrowserRouter([
  // Marketing site (with Navbar / Footer)
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },

  // Auth routes — must be before the /:username catch-all
  { path: "/login",           Component: LoginPage },
  { path: "/auth/sign-in",    Component: LoginPage },
  { path: "/register",        Component: RegisterPage },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/onboarding",      Component: OnboardingPage },

  // NFC shortcode redirect  →  /t/:shortcode
  { path: "/t/:shortcode", Component: TapRedirectPage },

  // Public NFC profile     →  /:username
  { path: "/qr/:username", Component: QrPage },
  { path: "/:username",    Component: ProfilePage },

  // Dashboard — protected by RequireAuth
  {
    Component: RequireAuth,
    children: [
      { path: "/dashboard",            Component: DashboardPage },
      { path: "/dashboard/analytics",  Component: DashboardAnalyticsPage },
      { path: "/dashboard/cards",      Component: DashboardCardsPage },
      { path: "/dashboard/profile",    Component: DashboardProfilePage },
      { path: "/dashboard/modes",      Component: DashboardModesPage },
      { path: "/dashboard/themes",     Component: DashboardThemesPage },
      { path: "/dashboard/settings",   Component: DashboardSettingsPage },
    ],
  },
]);