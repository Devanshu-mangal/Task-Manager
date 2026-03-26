import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { LoadingSpinner } from "./components/common/LoadingSpinner.jsx";
import { useDocumentTitle } from "./hooks/useDocumentTitle.js";

const Tasks = lazy(() => import("./pages/Tasks.jsx").then((m) => ({ default: m.Tasks })));
const Login = lazy(() => import("./pages/Login.jsx").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("./pages/Register.jsx").then((m) => ({ default: m.Register })));
const NotFound = lazy(() => import("./pages/NotFound.jsx").then((m) => ({ default: m.NotFound })));
const ServerError = lazy(() => import("./pages/ServerError.jsx").then((m) => ({ default: m.ServerError })));

function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner fullPage label="Loading dashboard" />}>
        <Tasks />
      </Suspense>
    </ProtectedRoute>
  );
}

function AppShell() {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage = ["/login", "/register"].includes(pathname);
  const showNavbar = ["/", "/tasks", "/dashboard"].includes(pathname);

  useDocumentTitle();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {showNavbar && <Navbar />}
      <main
        className={`flex-1 transition-opacity duration-300 ${isAuthPage ? "flex min-h-0 flex-col bg-transparent p-0" : ""}`}
        key={location.pathname}
        id="main-content"
        tabIndex={-1}
      >
        <Routes>
          <Route path="/" element={<DashboardRoutes />} />
          <Route path="/tasks" element={<DashboardRoutes />} />
          <Route path="/dashboard" element={<DashboardRoutes />} />
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingSpinner fullPage label="Loading" />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<LoadingSpinner fullPage label="Loading" />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/500"
            element={
              <Suspense fallback={<LoadingSpinner fullPage label="Loading" />}>
                <ServerError />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner fullPage label="Loading" />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className:
            "!bg-slate-800 !text-slate-100 !border !border-slate-600 dark:!bg-slate-800 dark:!text-slate-100",
          style: { fontSize: "14px" },
        }}
      />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
