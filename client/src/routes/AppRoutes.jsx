import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AboutPage = lazy(() =>
  import("../pages/public/About.jsx").then((module) => ({ default: module.AboutPage })),
);
const ContactPage = lazy(() =>
  import("../pages/public/Contact.jsx").then((module) => ({ default: module.ContactPage })),
);
const ArticlePage = lazy(() =>
  import("../pages/public/ArticleDetails.jsx").then((module) => ({ default: module.ArticlePage })),
);
const JournalPage = lazy(() =>
  import("../pages/public/Journal.jsx").then((module) => ({ default: module.JournalPage })),
);
const DestinationDetailPage = lazy(() =>
  import("../pages/public/DestinationDetails.jsx").then((module) => ({
    default: module.DestinationDetailPage,
  })),
);
const DestinationsPage = lazy(() =>
  import("../pages/public/Destinations.jsx").then((module) => ({
    default: module.DestinationsPage,
  })),
);
const FinderPage = lazy(() =>
  import("../pages/public/Finder.jsx").then((module) => ({ default: module.FinderPage })),
);
const TreksPage = lazy(() =>
  import("../pages/public/ExploreTreks.jsx").then((module) => ({ default: module.TreksPage })),
);
const TrekkingGuidePage = lazy(() =>
  import("../pages/public/TrekkingGuide.jsx").then((module) => ({
    default: module.TrekkingGuidePage,
  })),
);
const HomePage = lazy(() =>
  import("../pages/public/Home.jsx").then((module) => ({ default: module.HomePage })),
);
const NotFoundPage = lazy(() =>
  import("../pages/public/MiscPages.jsx").then((module) => ({ default: module.NotFoundPage })),
);
const PolicyPage = lazy(() =>
  import("../pages/public/MiscPages.jsx").then((module) => ({ default: module.PolicyPage })),
);
const TrekDetailPage = lazy(() =>
  import("../pages/public/TrekDetails.jsx").then((module) => ({
    default: module.TrekDetailPage,
  })),
);
const AuthPage = lazy(() =>
  import("../pages/auth/AuthPage.jsx").then((module) => ({ default: module.AuthPage })),
);
const BookingPage = lazy(() =>
  import("../pages/traveler/BookingPage.jsx").then((module) => ({ default: module.BookingPage })),
);
const CustomizeTripPage = lazy(() =>
  import("../pages/traveler/CustomizeTripPage.jsx").then((module) => ({
    default: module.CustomizeTripPage,
  })),
);
const SavedPage = lazy(() =>
  import("../pages/traveler/SavedPage.jsx").then((module) => ({ default: module.SavedPage })),
);
const TravelerDashboard = lazy(() =>
  import("../pages/traveler/TravelerDashboard.jsx").then((module) => ({
    default: module.TravelerDashboard,
  })),
);
const AdminPage = lazy(() =>
  import("../pages/admin/AdminPage.jsx").then((module) => ({ default: module.AdminPage })),
);
const AdminLoginPage = lazy(() =>
  import("../pages/admin/AdminLoginPage.jsx").then((module) => ({
    default: module.AdminLoginPage,
  })),
);
const RegionPage = lazy(() =>
  import("../pages/public/RegionPage.jsx").then((module) => ({ default: module.RegionPage })),
);
const ReviewRequestPage = lazy(() =>
  import("../pages/public/ReviewRequest.jsx").then((module) => ({
    default: module.ReviewRequestPage,
  })),
);
const ReviewVerificationPage = lazy(() =>
  import("../pages/public/ReviewVerification.jsx").then((module) => ({
    default: module.ReviewVerificationPage,
  })),
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="route-loading" role="status">Checking your account...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}

export default function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="route-loading" role="status">Loading page...</div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/treks" element={<TreksPage />} />
            <Route path="/treks/:slug" element={<TrekDetailPage />} />
            <Route path="/trekking-guide" element={<TrekkingGuidePage />} />
            <Route path="/trekking-guide/:category" element={<TrekkingGuidePage />} />
            <Route path="/trekking-guides" element={<TrekkingGuidePage />} />
            <Route path="/trekking-guides/:category" element={<TrekkingGuidePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/regions/:slug" element={<RegionPage />} />
            <Route path="/find-my-trek" element={<FinderPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<ArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/auth/email/:token" element={<AuthPage mode="email-link" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
            <Route path="/reset-password/:token" element={<AuthPage mode="reset" />} />
            <Route path="/review/request" element={<ReviewRequestPage />} />
            <Route path="/review/verify/:token" element={<ReviewVerificationPage />} />
            <Route path="/dashboard" element={<TravelerDashboard />} />
            <Route path="/account" element={<TravelerDashboard />} />
            <Route path="/booking/:slug" element={<RequireAuth><BookingPage /></RequireAuth>} />
            <Route path="/treks/:slug/book" element={<RequireAuth><BookingPage /></RequireAuth>} />
            <Route path="/trip-booking" element={<RequireAuth><BookingPage /></RequireAuth>} />
            <Route path="/customize-trip" element={<RequireAuth><CustomizeTripPage /></RequireAuth>} />
            <Route path="/treks/:slug/customize" element={<RequireAuth><CustomizeTripPage /></RequireAuth>} />
            <Route path="/saved" element={<RequireAuth><SavedPage /></RequireAuth>} />
            <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
            <Route path="/terms" element={<PolicyPage kind="terms" />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/booking" element={<Navigate to="/admin/bookings" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/:tab" element={<AdminPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
    </>
  );
}
