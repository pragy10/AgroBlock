import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, TrendingUp, Users, Package, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable records ensure complete transparency and authenticity of every product.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Tracking',
      description: 'Track agricultural products from farm to table with live blockchain updates.'
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder',
      description: 'Connect farmers, distributors, retailers, and consumers in one ecosystem.'
    },
    {
      icon: Package,
      title: 'Product Verification',
      description: 'QR code scanning for instant product authenticity and journey verification.'
    }
  ];

  const stakeholders = [
    { role: '👨‍🌾 Farmers', description: 'Register products on blockchain', color: 'green' },
    { role: '🚚 Distributors', description: 'Transport & track shipments', color: 'blue' },
    { role: '🏪 Retailers', description: 'Sell verified products', color: 'purple' },
    { role: '🛒 Consumers', description: 'Verify product authenticity', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Agro<span className="text-primary-600">Block</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              <span>Powered by Ethereum Blockchain</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transparent Agricultural
              <br />
              <span className="text-primary-600">Supply Chain</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track every product from farm to table with blockchain technology. 
              Ensure authenticity, build trust, and revolutionize food supply chains.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button variant="blockchain" size="lg" icon={ArrowRight}>
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div>
                <div className="text-4xl font-bold text-primary-600">100%</div>
                <div className="text-gray-600 mt-2">Transparency</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">24/7</div>
                <div className="text-gray-600 mt-2">Real-time Tracking</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">Secure</div>
                <div className="text-gray-600 mt-2">Blockchain</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">QR</div>
                <div className="text-gray-600 mt-2">Verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgroBlock?
            </h2>
            <p className="text-xl text-gray-600">
              Built on cutting-edge blockchain technology for complete transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              For Every Stakeholder
            </h2>
            <p className="text-xl text-gray-600">
              Tailored dashboards for each role in the supply chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((stakeholder, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 border-t-4 border-primary-500">
                <div className="text-4xl mb-4">{stakeholder.role.split(' ')[0]}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stakeholder.role.split(' ').slice(1).join(' ')}
                </h3>
                <p className="text-gray-600 mb-4">{stakeholder.description}</p>
                <div className={`inline-block px-3 py-1 bg-${stakeholder.color}-100 text-${stakeholder.color}-700 rounded-full text-sm font-medium`}>
                  Blockchain Enabled
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join the blockchain revolution in agriculture. Start tracking products today.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" icon={ArrowRight}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  Agro<span className="text-primary-400">Block</span>
                </span>
              </div>
              <p className="text-gray-400">
                Blockchain-powered transparency for agricultural supply chains.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Ethereum Blockchain</li>
                <li>Smart Contracts</li>
                <li>IPFS Storage</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgroBlock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
