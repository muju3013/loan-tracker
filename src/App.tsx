import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppProvider } from "./hooks/useAppStore";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoansPage } from "./pages/LoansPage";
import { AddLoanPage } from "./pages/AddLoanPage";
import { LoanDetailPage } from "./pages/LoanDetailPage";
import { EditLoanPage } from "./pages/EditLoanPage";
import { HolidaysPage } from "./pages/HolidaysPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { DataLoader } from "./components/DataLoader";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AppProvider>
                  <Layout />
                </AppProvider>
              }
            >
              <Route element={<DataLoader />}>
                <Route index element={<DashboardPage />} />
                <Route path="loans" element={<LoansPage />} />
                <Route path="loans/new" element={<AddLoanPage />} />
                <Route path="loans/:id" element={<LoanDetailPage />} />
                <Route path="loans/:id/edit" element={<EditLoanPage />} />
                <Route path="holidays" element={<HolidaysPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
