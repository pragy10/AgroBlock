import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Eye, Send, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import BlockchainBadge from '../components/BlockchainBadge';
import TransferRequestModal from '../components/TransferRequestModal';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    originLocation: '',
    originLatitude: '',
    originLongitude: '',
    harvestDate: '',
    expiryDate: '',
    images: null
  });

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user.role === 'farmer') {
        // Farmers see their own products
        response = await productAPI.getProductsByOwner(user.id);
      } else {
        // Others see available products they can request
        response = await productAPI.getAvailableProducts(user.role);
      }
      
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await productAPI.register({
        ...registerFormData,
        ownerId: user.id
      });
      
      alert('Product registered successfully on blockchain!');
      setRegisterFormData({
        name: '',
        description: '',
        category: '',
        quantity: '',
        unit: 'kg',
        price: '',
        originLocation: '',
        originLatitude: '',
        originLongitude: '',
        harvestDate: '',
        expiryDate: '',
        images: null
      });
      setShowRegisterForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error registering product:', error);
      alert(error.response?.data?.message || 'Failed to register product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setRegisterFormData({ ...registerFormData, images: e.target.files });
  };

  const canRequestProduct = (product) => {
    if (product.currentOwner._id === user.id) return false;
    
    if (user.role === 'distributor' && product.status === 'registered') return true;
    if (user.role === 'retailer' && product.status === 'at_distributor') return true;
    if (user.role === 'consumer' && product.status === 'at_retailer') return true;
    
    return false;
  };

  const openRequestModal = (product) => {
    setSelectedProduct(product);
    setShowRequestModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user.role === 'farmer' ? 'My Products' : 'Available Products'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'farmer' 
              ? 'Manage your agricultural products on blockchain'
              : 'Browse and request products in the supply chain'}
          </p>
        </div>
        {user.role === 'farmer' && (
          <Button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            variant="blockchain"
            icon={Plus}
          >
            {showRegisterForm ? 'Cancel' : 'Register Product'}
          </Button>
        )}
      </div>

      {/* Registration Form (Farmer Only) */}
      {showRegisterForm && user.role === 'farmer' && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Register New Product on Blockchain
          </h2>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={registerFormData.name}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={registerFormData.category}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Pulses">Pulses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={registerFormData.quantity}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, quantity: e.target.value })}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                  <select
                    value={registerFormData.unit}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, unit: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="liters">liters</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={registerFormData.price}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, price: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Location *
                </label>
                <input
                  type="text"
                  value={registerFormData.originLocation}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, originLocation: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  value={registerFormData.harvestDate}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, harvestDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={registerFormData.description}
                  onChange={(e) => setRegisterFormData({ ...registerFormData, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Product description..."
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Product Images (Max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRegisterForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="blockchain"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register on Blockchain'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {user.role === 'farmer' 
                ? 'Register your first product to get started'
                : 'No products available for your role at this time'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} hover={true} className="flex flex-col">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <StatusBadge status={product.status} />
              </div>

              {/* Product Info */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description || 'No description'}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-primary-600">₹{product.price}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{product.currentLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Current Owner</p>
                  <p className="text-sm font-semibold text-gray-800">{product.currentOwner?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{product.currentOwner?.role}</p>
                </div>

                <BlockchainBadge txHash={product.blockchainTxHash} />
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 mt-auto">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/product/${product.productId}`)}
                    icon={Eye}
                  >
                    View Details
                  </Button>
                  {canRequestProduct(product) && product.isAvailable && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => openRequestModal(product)}
                      icon={Send}
                    >
                      Request
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Transfer Request Modal */}
      {showRequestModal && selectedProduct && (
        <TransferRequestModal
          product={selectedProduct}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            fetchProducts();
            setShowRequestModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Helper Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    registered: { color: 'bg-green-500', label: 'Registered' },
    'pending_distribution': { color: 'bg-yellow-500', label: 'Pending' },
    'in_transit': { color: 'bg-blue-500', label: 'In Transit' },
    'at_distributor': { color: 'bg-purple-500', label: 'At Distributor' },
    'at_retailer': { color: 'bg-orange-500', label: 'At Retailer' },
    sold: { color: 'bg-gray-500', label: 'Sold' },
    delivered: { color: 'bg-teal-500', label: 'Delivered' },
  };

  const config = statusConfig[status] || statusConfig.registered;

  return (
    <div className={`absolute top-3 right-3 ${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
      {config.label}
    </div>
  );
};

export default Products;
