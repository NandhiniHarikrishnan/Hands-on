import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import SalesLeads from './components/SalesLeads';
import Tasks from './components/Tasks';
import Reports from './components/Reports';
import ContactHistory from './components/ContactHistory';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Layout Component
const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">CRM System</h1>
          <nav className="nav">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/customers" className="nav-link">Customers</a>
            <a href="/sales-leads" className="nav-link">Sales Leads</a>
            <a href="/tasks" className="nav-link">Tasks</a>
            <a href="/contact-history" className="nav-link">Contact History</a>
            <a href="/reports" className="nav-link">Reports</a>
          </nav>
          <div className="user-menu">
            <span className="username">Welcome, {user?.username}</span>
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales-leads" element={<SalesLeads />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/contact-history" element={<ContactHistory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
