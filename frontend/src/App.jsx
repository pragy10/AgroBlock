import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header with Tailwind styling */}
        <header className="bg-white shadow-lg border-b-2 border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-3xl">🌾</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Agri Supply Chain
                  </h1>
                  <p className="text-sm text-green-600 font-medium">Blockchain Powered</p>
                </div>
              </div>
              
              {/* Navigation with hover effects */}
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-50">
                  Dashboard
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-50">
                  Track
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-50">
                  History
                </a>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md">
                  Connect Wallet
                </button>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-600 hover:text-green-600 p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚜</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-green-600">Blockchain Agricultural</span>{' '}
              Supply Chain
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your agricultural produce from farm to consumer with complete transparency, 
              security, and trust using blockchain technology.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                🚀 Get Started
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 font-semibold">
                📖 Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {/* Farmer Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🚜</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Farmer Dashboard</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Register new produce, set initial conditions, and start the blockchain journey of your crops.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Register</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Track</span>
              </div>
              <button className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium">
                Access Dashboard →
              </button>
            </div>
            
            {/* Distributor Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🚛</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Distributor Dashboard</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Update location, transfer ownership, and maintain quality records during transportation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Update</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Transfer</span>
              </div>
              <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium">
                Access Dashboard →
              </button>
            </div>
            
            {/* Retailer Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Retailer Dashboard</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage inventory, handle final transfers, and provide transparency to consumers.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Inventory</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">QR Generate</span>
              </div>
              <button className="w-full bg-orange-50 text-orange-700 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 font-medium">
                Access Dashboard →
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Platform Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1,245</div>
                <div className="text-gray-600 font-medium">Products Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">89</div>
                <div className="text-gray-600 font-medium">Active Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
                <div className="text-gray-600 font-medium">Distributors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">234</div>
                <div className="text-gray-600 font-medium">Retailers</div>
              </div>
            </div>
          </div>

          {/* Consumer QR Section */}
          <div className="mt-20 text-center">
            <div className="bg-gray-900 text-white p-12 rounded-2xl">
              <span className="text-6xl mb-6 block">📱</span>
              <h3 className="text-3xl font-bold mb-4">Scan & Verify</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Consumers can scan QR codes to see the complete journey of their food from farm to table
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold">
                📱 Try QR Scanner
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-bold">Agri Supply Chain</span>
              </div>
              <p className="text-gray-400">Powered by Blockchain Technology</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
