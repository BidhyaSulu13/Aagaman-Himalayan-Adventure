import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { AboutPage } from "../pages/public/About.jsx";
import { ContactPage } from "../pages/public/Contact.jsx";
import { ArticlePage } from "../pages/public/ArticleDetails.jsx";
import { JournalPage } from "../pages/public/Journal.jsx";
import { DestinationDetailPage } from "../pages/public/DestinationDetails.jsx";
import { DestinationsPage } from "../pages/public/Destinations.jsx";
import { FinderPage } from "../pages/public/Finder.jsx";
import { TreksPage } from "../pages/public/ExploreTreks.jsx";
import { TrekkingGuidePage } from "../pages/public/TrekkingGuide.jsx";
import { HomePage } from "../pages/public/Home.jsx";
import { NotFoundPage, PolicyPage } from "../pages/public/MiscPages.jsx";
import { TrekDetailPage } from "../pages/public/TrekDetails.jsx";
import { AuthPage } from "../pages/auth/AuthPage.jsx";
import { BookingPage } from "../pages/traveler/BookingPage.jsx";
import { CustomizeTripPage } from "../pages/traveler/CustomizeTripPage.jsx";
import { SavedPage } from "../pages/traveler/SavedPage.jsx";
import { TravelerDashboard } from "../pages/traveler/TravelerDashboard.jsx";
import { AdminPage } from "../pages/admin/AdminPage.jsx";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/treks" element={<TreksPage />} />
          <Route path="/treks/:slug" element={<TrekDetailPage />} />
          <Route path="/trekking-guide" element={<TrekkingGuidePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/find-my-trek" element={<FinderPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="/reset-password/:token" element={<AuthPage mode="reset" />} />
          <Route path="/dashboard" element={<TravelerDashboard />} />
          <Route path="/account" element={<TravelerDashboard />} />
           <Route path="/booking/:slug" element={<BookingPage />} />
          <Route path="/treks/:slug/book" element={<BookingPage />} />
          <Route path="/trip-booking" element={<BookingPage />} />
          <Route path="/customize-trip" element={<CustomizeTripPage />} />
          <Route path="/treks/:slug/customize" element={<CustomizeTripPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
          <Route path="/terms" element={<PolicyPage kind="terms" />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
    </>
  );
}
