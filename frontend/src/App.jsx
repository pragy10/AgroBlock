import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import BlockchainExplorer from './pages/BlockchainExplorer';
import Requests from './pages/Requests';
import ProductDetail from './pages/ProductDetail';
import SupplyChainAnalytics from './pages/SupplyChainAnalytics';


// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Shared Pages
import SmartContract from './pages/SmartContract';

// Old pages (we'll create role-specific versions)
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Farmer Routes */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/users"
        element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <Navbar />
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/products"
        element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <Navbar />
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Farmer Requests */}
      <Route
        path="/farmer/requests"
        element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <Navbar />
            <Requests />
          </ProtectedRoute>
        }
      />

      {/* Distributor Routes */}
      <Route
        path="/distributor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['distributor']}>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/distributor/users"
        element={
          <ProtectedRoute allowedRoles={['distributor']}>
            <Navbar />
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/distributor/products"
        element={
          <ProtectedRoute allowedRoles={['distributor']}>
            <Navbar />
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Distributor Requests */}
      <Route
        path="/distributor/requests"
        element={
          <ProtectedRoute allowedRoles={['distributor']}>
            <Navbar />
            <Requests />
          </ProtectedRoute>
        }
      />

      {/* Retailer Routes */}
      <Route
        path="/retailer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['retailer']}>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retailer/users"
        element={
          <ProtectedRoute allowedRoles={['retailer']}>
            <Navbar />
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retailer/products"
        element={
          <ProtectedRoute allowedRoles={['retailer']}>
            <Navbar />
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Retailer Requests */}
      <Route
        path="/retailer/requests"
        element={
          <ProtectedRoute allowedRoles={['retailer']}>
            <Navbar />
            <Requests />
          </ProtectedRoute>
        }
      />

      {/* Consumer Routes */}
      <Route
        path="/consumer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['consumer']}>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consumer/products"
        element={
          <ProtectedRoute allowedRoles={['consumer']}>
            <Navbar />
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Consumer Requests */}
      <Route
        path="/consumer/requests"
        element={
          <ProtectedRoute allowedRoles={['consumer']}>
            <Navbar />
            <Requests />
          </ProtectedRoute>
        }
      />

      {/* Smart Contract - Accessible to all authenticated users */}
      <Route
        path="/contract"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'distributor', 'retailer', 'consumer']}>
            <Navbar />
            <SmartContract />
          </ProtectedRoute>
        }
      />

      {/* Blockchain Explorer - Accessible to all authenticated users */}
      <Route
        path="/blockchain"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'distributor', 'retailer', 'consumer']}>
            <Navbar />
            <BlockchainExplorer />
          </ProtectedRoute>
        }
      />

      {/* Product Detail - Public to all authenticated users */}
      <Route
        path="/product/:productId"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'distributor', 'retailer', 'consumer']}>
            <Navbar />
            <ProductDetail />
          </ProtectedRoute>
        }
      />

      {/* Supply Chain Analytics - Accessible to all authenticated users */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'distributor', 'retailer', 'consumer']}>
            <Navbar />
            <SupplyChainAnalytics />
          </ProtectedRoute>
        }
      />


      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
