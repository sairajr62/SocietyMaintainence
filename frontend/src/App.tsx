import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Layout from "./Layout"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { useEffect } from "react"
import ComplaintForm from "./pages/ComplaintForm"
import AddSocietyForm from "./pages/AddSocietyForm"
import ManageSocieties from "./pages/ManageSocieties"
import AddMembers from "./pages/AddMembers"
import ManageMembers from "./pages/ManageMembers"
import UploadDocument from "./pages/UploadDocument"
import AddPayments from "./pages/AddPayments"
import AdminDashboard from "./pages/AdminDashboard"
import AdminExpense from "./pages/AdminExpense"
import PaymentHandler from "./pages/PaymentHandler"

const AppRoutes = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Current user:", user?.role);
  }, [user]);

  // No user (not logged in)
  if (!user) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={
          <div className="flex flex-col flex-1 justify-center items-center h-screen space-y-2">
            <h1 className="text-2xl">welcome to the society maintenance app</h1>
            <Link to='/login' className="bg-primary/80 hover:bg-primary transition-all text-card px-4 py-2 rounded-lg">Click here to Login</Link>
          </div>
        } />
      </Routes>
    );
  }

  // User is logged in, show role-based routes
  return (
    <Routes>
      {user.role === "superAdmin" && (
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={<AdminDashboard/>}
          />
          <Route
            path="add-society"
            element={<AddSocietyForm />}
          />
          <Route
            path="manage-societies"
            element={<ManageSocieties />}
          />

        </Route>
      )}

      {user.role === "admin" && (
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={<AdminDashboard/>}
          />
          <Route
            path="add-members"
            element={<AddMembers />}
          />
          <Route
            path="/manage-members"
            element={<ManageMembers />}
          />
          <Route path="upload-documents" element={<UploadDocument />} />
          <Route path="payments" element={<AddPayments/>} />
          <Route path="expenses" element={<AdminExpense/>} />
        </Route>
      )}

      {user.role === "member" && (
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={<AdminDashboard/>}
          />
          <Route
            path="complaint-form"
            element={<ComplaintForm />}
          />
          <Route
            path="my-payments"
            element={<PaymentHandler/>}
          />
        </Route>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );

}

export default App
