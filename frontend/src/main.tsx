import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

// ✅ ProtectedRoute Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // --- This line is now corrected ---
  const accessToken = localStorage.getItem("accessToken"); 
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// ✅ Email Verified Page
const EmailVerifiedPage = () => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <h2>Email Verified</h2>
    <p>Your email has been successfully verified.</p>
    <Link to="/login">Click here to Login</Link>
  </div>
);

// ✅ App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Protected Pages --- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Public Pages --- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

// ✅ Wrap in reCAPTCHA Provider
createRoot(document.getElementById('root')!).render(
  <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
    <App />
  </GoogleReCaptchaProvider>
);