import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/themes/variables.css";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastProvider } from "./contexts/ToastContext";
import ToastDisplay from "./components/common/ToastProvider";

import MainLayout from "./layouts/MainLayout";
import NotFound from "./features/errors/NotFound";
import Dashboard from "./features/dashboard/Dashboard";
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import ResetPasswordForm from "./features/auth/ResetPasswordForm";
import Messages from "./features/users/Messages";
import AdjustPlan from "./features/adjustPlan/AdjustPlan";
import RegisterClientForm from "./features/auth/RegisterClientForm";
import AllClients from "./features/users/AllClients";
import ClientDetails from "./features/users/ClientDetails";
import LandingPage from "./features/landing/LandingPage";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import { TermsAndConditions, PrivacyPolicy, ContactUs, CancellationPolicy } from "./features/static";
import { TrainerDashboard } from "./features/trainer";
import { MealPlanManager } from "./features/mealPlans";
import { ClientMessaging } from "./features/messaging";
import { ProgressTracker } from "./features/progress";
import { SubscriptionManager } from "./features/subscription";

// SocietyCare imports
import SocietyLoginForm from "./features/societyCare/auth/SocietyLoginForm";
import SocietyRegisterForm from "./features/societyCare/auth/SocietyRegisterForm";
import ResidentDashboard from "./features/societyCare/dashboard/EnhancedResidentDashboard";
import SocietyAdminDashboard from "./features/societyCare/dashboard/AdminDashboard";
import PaymentsPage from "./features/societyCare/payments/PaymentsPage";
import ComplaintsPage from "./features/societyCare/complaints/ComplaintsPage";
import NoticesPage from "./features/societyCare/notices/NoticesPage";
import SocietyLandingPage from "./features/societyCare/landing/SocietyLandingPage";
import AuthInitializer from "./components/auth/AuthInitializer";
import UserProfile from "./features/societyCare/userManagement/UserProfile";
import UserManagement from "./features/societyCare/userManagement/UserManagement";
// import createDemoUsers from "./utils/createDemoUsers"; // Uncomment to create demo users
function ProtectedLayout({ children, config }) {
  return (
    <ProtectedRoute>
      <MainLayout config={config}>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <ToastProvider>
              <AuthInitializer>
                <Routes>
          {/* Public routes */}
          <Route path="/" element={<SocietyLandingPage />} />
          <Route path="/login" element={<SocietyLoginForm />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />     
          <Route path="/register" element={<SocietyRegisterForm />} />
          <Route path="/register-client" element={<RegisterClientForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          
          {/* Legacy auth routes */}
          <Route path="/legacy-login" element={<LoginForm />} />
          <Route path="/legacy-register" element={<RegisterForm />} />
          
          {/* Static Pages */}
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />


          {/* SocietyCare Protected routes */}
          <Route
            path="/resident-dashboard"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <ResidentDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <SocietyAdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <PaymentsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <ComplaintsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/notices"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <NoticesPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <UserProfile />
              </ProtectedLayout>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <UserManagement />
              </ProtectedLayout>
            }
          />
          
          {/* Legacy Protected routes */}
          <Route
            path="/trainer-dashboard"
            element={
              <ProtectedLayout config={{ showTopbar: true, showSidebar: false, showFooter: false }}>
                <TrainerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/AllClients"
            element={
              <ProtectedLayout>
                <AllClients />
              </ProtectedLayout>
            }
          />
          <Route
            path="/client-details/:clientId"
            element={
              <ProtectedLayout>
                <ClientDetails />
              </ProtectedLayout>
            }
          />


            <Route
            path="/messages/:clientId"
            element={
              <ProtectedLayout>
              <Messages isTrainer={true} />
              </ProtectedLayout>
            }
          />
            <Route
            path="/adjust-plan/:clientId"
            element={
              <ProtectedLayout>
                <AdjustPlan />
              </ProtectedLayout>
            }
          />
           <Route
            path="/admin-dashboard"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />

          {/* Trainer Features */}
          <Route
            path="/meal-plans"
            element={
              <ProtectedLayout>
                <MealPlanManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/messages/:clientId"
            element={
              <ProtectedLayout>
                <ClientMessaging />
              </ProtectedLayout>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedLayout>
                <ProgressTracker />
              </ProtectedLayout>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedLayout>
                <SubscriptionManager />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<NotFound />} />
                </Routes>
                <ToastDisplay />
              </AuthInitializer>
            </ToastProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
