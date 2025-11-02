import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Users, Package, TrendingUp, Code, LogOut, Blocks, Inbox, ChevronDown, Menu, X, GitBranch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get role-specific base path
  const basePath = user ? `/${user.role}` : '';

  const navLinks = [
    { path: `${basePath}/dashboard`, label: 'Dashboard', icon: TrendingUp },
    { path: `${basePath}/products`, label: 'Products', icon: Package },
    { path: `${basePath}/requests`, label: 'Requests', icon: Inbox },
  ];

  // Blockchain links (in dropdown)
  const blockchainLinks = [
    { path: '/analytics', label: 'Supply Chain Analytics', icon: GitBranch },
    { path: '/blockchain', label: 'Blockchain DLT', icon: Blocks },
    { path: '/contract', label: 'Smart Contract', icon: Code },
  ];

  // Only show Users link for non-consumers
  if (user && user.role !== 'consumer') {
    navLinks.splice(1, 0, { path: `${basePath}/users`, label: 'Users', icon: Users });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={basePath ? `${basePath}/dashboard` : '/'} className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Agro<span className="text-primary-600">Block</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              );
            })}

            {/* Blockchain Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                <Blocks className="h-4 w-4" />
                <span className="font-medium text-sm">Blockchain</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {blockchainLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        isActive(link.path) ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Blockchain Status & User */}
          <div className="flex items-center space-x-4">
            {/* Blockchain Active Indicator */}
            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Chain Active</span>
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive(link.path)
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Blockchain</p>
              {blockchainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      isActive(link.path)
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
