import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import BillList from './components/bills/BillList';
import BillForm from './components/bills/BillForm';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import Navbar from './components/layout/Navbar';
import authService from './services/authService';
import CustomerList from './components/customers/CustomerList';
import CustomerForm from './components/customers/CustomerForm';
import SalesReportText from './components/reports/text/SalesReportText';
import SalesReportSummary from './components/reports/summary/SalesReportSummary';
import ProfilePage from "./components/profile/ProfilePage";
import ReminderTrigger from './components/customers/ReminderTrigger';
import CustomerHistory from "./components/customers/CustomerHistory";
import CustomerEdit from './components/customers/CustomerEdit';



// ✅ Improved PrivateRoute with robust role handling
function PrivateRoute({ children, roles = [] }) {
  try {
    const user = authService.getUserFromToken();

    // If no user → redirect to login
    if (!user) {
      console.warn("PrivateRoute: No user found, redirecting to login.");
      return <Navigate to="/login" />;
    }

    // Normalize roles: ensure array even if single role
    const userRoles = user.roles?.length
      ? user.roles
      : user.role
      ? [user.role]
      : [];

    // Allow access if route doesn’t specify required roles or user has one of them
    const hasAccess =
      roles.length === 0 || roles.some(r => userRoles.includes(r));

    if (!hasAccess) {
      console.warn("PrivateRoute: Access denied for roles", userRoles);
      return (
        <div className="p-4 text-red-600 font-semibold text-center">
          Access denied — insufficient permissions.
        </div>
      );
    }

    return children;
  } catch (err) {
    console.error("PrivateRoute crashed:", err);
    return (
      <div className="p-4 text-red-600 font-semibold text-center">
        Something went wrong in PrivateRoute.
      </div>
    );
  }
}


export default function App() {
  return (
    <div>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>}
          />

          <Route
            path="/products"
            element={<PrivateRoute roles={['OWNER', 'MANAGER']}><ProductList /></PrivateRoute>}
          />
          <Route
            path="/products/new"
            element={<PrivateRoute roles={['OWNER', 'MANAGER']}><ProductForm /></PrivateRoute>}
          />

          <Route
            path="/bills"
            element={<PrivateRoute roles={['MANAGER', 'OWNER']}><BillList /></PrivateRoute>}
          />
          <Route
            path="/bills/new"
            element={<PrivateRoute roles={['MANAGER', 'OWNER']}><BillForm /></PrivateRoute>}
          />

          <Route
            path="/customers"
            element={<PrivateRoute roles={['OWNER', 'MANAGER']}><CustomerList /></PrivateRoute>}
          />
          <Route
            path="/customers/new"
            element={<PrivateRoute roles={['OWNER', 'MANAGER']}><CustomerForm /></PrivateRoute>}
          />

          <Route path="/reports" element={<Navigate to="/reports/summary" />} />
          <Route
            path="/reports/text"
            element={<PrivateRoute roles={['OWNER']}><SalesReportText /></PrivateRoute>}
          />
          <Route
            path="/reports/summary"
            element={<PrivateRoute roles={['OWNER']}><SalesReportSummary /></PrivateRoute>}
          />
          <Route
            path="/products/edit/:id"
            element={<PrivateRoute roles={['OWNER', 'MANAGER']}><ProductForm /></PrivateRoute>}
          />
          <Route path="/customers/reminders" element={<PrivateRoute roles={['OWNER','MANAGER']}><ReminderTrigger/></PrivateRoute>} />
          {/* <Route path="/customers/history/:id" element={<PrivateRoute roles={['OWNER','MANAGER','CASHIER']}><CustomerHistory/></PrivateRoute>} /> */}


          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route 
            path="/customers/:id/history"
            element={<PrivateRoute roles={['OWNER', 'MANAGER', 'CASHIER']}><CustomerHistory /></PrivateRoute>}
          />

          <Route
            path="/customers/:id"
            element={<PrivateRoute roles={['OWNER','MANAGER','CASHIER']}><CustomerEdit /></PrivateRoute>}
          />

          <Route
            path="/customers/edit/:id"
            element={<PrivateRoute roles={['OWNER','MANAGER']}><CustomerForm /></PrivateRoute>}
          />

          <Route path="/customers/edit/:id" element={<CustomerEdit />} />


        </Routes>
      </div>
    </div>
  );
}
