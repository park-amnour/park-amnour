import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import CookieConsent from './components/CookieConsent';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Attractions from './pages/Attractions';
import Visit from './pages/Visit';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageHero from './pages/admin/ManageHero';
import ManageAttractions from './pages/admin/ManageAttractions';
import ManageGallery from './pages/admin/ManageGallery';
import ManagePricing from './pages/admin/ManagePricing';
import ManageFooter from './pages/admin/ManageFooter';
import ManageInfo from './pages/admin/ManageInfo';
import ManageSEO from './pages/admin/ManageSEO';
import Settings from './pages/admin/Settings';
import PageTracker from './components/PageTracker';
import { SiteProvider } from './context/SiteContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "attractions", element: <Attractions /> },
      { path: "visit", element: <Visit /> },
      { path: "gallery", element: <Gallery /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "manage-hero", element: <ManageHero /> },
          { path: "manage-attractions", element: <ManageAttractions /> },
          { path: "manage-gallery", element: <ManageGallery /> },
          { path: "manage-pricing", element: <ManagePricing /> },
          { path: "manage-footer", element: <ManageFooter /> },
          { path: "manage-info", element: <ManageInfo /> },
          { path: "manage-seo", element: <ManageSEO /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <LanguageProvider>
          <PageTracker />
          <CookieConsent />
          <RouterProvider router={router} />
        </LanguageProvider>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;
