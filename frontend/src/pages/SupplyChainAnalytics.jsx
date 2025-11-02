import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, DollarSign, GitBranch, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI } from '../services/api';

const SupplyChainAnalytics = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = statusFilter === 'all' 
    ? products 
    : products.filter(p => p.status === statusFilter);

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price || 0), 0),
    activeProducts: products.filter(p => p.status !== 'sold' && p.status !== 'delivered').length,
    completedJourneys: products.filter(p => p.supplyChain?.length >= 3).length,
    totalTransactions: products.reduce((sum, p) => sum + (p.supplyChain?.length || 0), 0)
  };

  const statusOptions = [
    { value: 'all', label: 'All Products', color: 'gray' },
    { value: 'registered', label: 'Registered', color: 'green' },
    { value: 'at_distributor', label: 'At Distributor', color: 'blue' },
    { value: 'at_retailer', label: 'At Retailer', color: 'purple' },
    { value: 'sold', label: 'Sold', color: 'orange' },
    { value: 'delivered', label: 'Delivered', color: 'teal' },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading supply chain data..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <GitBranch className="h-8 w-8 text-primary-600" />
          <span>Supply Chain Analytics</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Complete visibility of all products across the agricultural supply chain
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={`₹${stats.totalValue.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Products"
          value={stats.activeProducts}
          color="purple"
        />
        <StatCard
          icon={GitBranch}
          label="Complete Journeys"
          value={stats.completedJourneys}
          color="orange"
        />
        <StatCard
          icon={Users}
          label="Total Transfers"
          value={stats.totalTransactions}
          color="teal"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === option.value
                  ? `bg-${option.color}-500 text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Current Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Journey
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No products found for this filter
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {product.images?.[0] && (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{product.productId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{product.currentOwner?.name}</div>
                        <div className="text-gray-500 capitalize">{product.currentOwner?.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <JourneyProgress supplyChain={product.supplyChain} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{product.price?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.quantity} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">TX:</span>
                          <span className="font-mono text-blockchain-blue">
                            {product.blockchainTxHash?.slice(0, 8)}...
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {product.supplyChain?.length || 0} transfers
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center space-x-1 ml-auto"
                      >
                        <span>View Journey</span>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Journey Modal */}
      {selectedProduct && (
        <ProductJourneyModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className={`bg-gradient-to-br from-${color}-50 to-white border-${color}-200`}>
    <div className="flex items-center space-x-3">
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    registered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Registered' },
    'at_distributor': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'At Distributor' },
    'at_retailer': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'At Retailer' },
    'sold': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Sold' },
    'delivered': { color: 'bg-teal-100 text-teal-800 border-teal-200', label: 'Delivered' },
  };

  const config = statusConfig[status] || statusConfig.registered;

  return (
    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

const JourneyProgress = ({ supplyChain }) => {
  const stages = ['👨‍🌾', '🚚', '🏪', '🛒'];
  const currentStage = supplyChain?.length || 0;

  return (
    <div className="flex items-center space-x-1">
      {stages.map((emoji, idx) => (
        <div
          key={idx}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            idx < currentStage
              ? 'bg-primary-100 border-2 border-primary-500'
              : 'bg-gray-100 border-2 border-gray-300'
          }`}
        >
          {emoji}
        </div>
      ))}
      <span className="text-xs text-gray-500 ml-2">
        {currentStage}/4
      </span>
    </div>
  );
};

const ProductJourneyModal = ({ product, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500 font-mono">{product.productId}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoBox label="Category" value={product.category} />
            <InfoBox label="Quantity" value={`${product.quantity} ${product.unit}`} />
            <InfoBox label="Price" value={`₹${product.price}`} />
            <InfoBox label="Status" value={<StatusBadge status={product.status} />} />
          </div>

          {/* Blockchain Info */}
          <Card className="bg-gradient-to-r from-blockchain-blue/5 to-blockchain-purple/5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-blockchain-blue">⛓️</span>
              <span>Blockchain Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Transaction Hash</p>
                <p className="font-mono text-xs text-blockchain-blue break-all">
                  {product.blockchainTxHash}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Smart Contract</p>
                <p className="font-mono text-xs text-gray-800">
                  {product.smartContractAddress}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Transfers</p>
                <p className="font-semibold text-gray-900">{product.supplyChain?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">IPFS Hash</p>
                <p className="font-mono text-xs text-gray-800">
                  {product.ipfsHash?.slice(0, 20)}...
                </p>
              </div>
            </div>
          </Card>

          {/* Supply Chain Journey */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Supply Chain Journey</h3>
            <div className="space-y-4">
              {product.supplyChain?.map((item, index) => (
                <div key={index} className="flex items-start">
                  {/* Timeline */}
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 border-4 border-primary-500 flex items-center justify-center text-lg z-10">
                      {item.role === 'farmer' ? '👨‍🌾' :
                       item.role === 'distributor' ? '🚚' :
                       item.role === 'retailer' ? '🏪' : '🛒'}
                    </div>
                    {index < product.supplyChain.length - 1 && (
                      <div className="w-1 h-16 bg-gray-300"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 capitalize">{item.role}</h4>
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{item.user?.name || 'Unknown'}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Received:</span>{' '}
                        {new Date(item.receivedAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Wallet:</span>{' '}
                        <span className="font-mono">{item.wallet?.slice(0, 10)}...</span>
                      </div>
                    </div>
                    {item.blockchainTxHash && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Transaction Hash</p>
                        <p className="text-xs font-mono text-blockchain-blue">{item.blockchainTxHash}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View Full Details Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                navigate(`/product/${product.productId}`);
                onClose();
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

export default SupplyChainAnalytics;
