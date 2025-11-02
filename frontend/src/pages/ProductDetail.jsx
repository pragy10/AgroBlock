import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Calendar, Thermometer, Droplets, QrCode } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import BlockchainBadge from '../components/BlockchainBadge';
import SupplyChainJourney from '../components/SupplyChainJourney';
import LocationMap from '../components/LocationMap';
import LoadingSpinner from '../components/LoadingSpinner';
import TransferRequestModal from '../components/TransferRequestModal';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(productId);
      setProduct(response.data.data.product);
      setHistory(response.data.data.history);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const canRequestProduct = () => {
    if (!user || !product) return false;
    
    const isOwner = product.currentOwner._id === user.id;
    if (isOwner) return false;

    // Distributor can request from farmer
    if (user.role === 'distributor' && product.status === 'registered') return true;
    
    // Retailer can request from distributor
    if (user.role === 'retailer' && product.status === 'at_distributor') return true;
    
    // Consumer can request from retailer
    if (user.role === 'consumer' && product.status === 'at_retailer') return true;

    return false;
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        icon={ArrowLeft}
        className="mb-6"
      >
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </Card>

          {/* Product Info */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <InfoBox label="Category" value={product.category} />
              <InfoBox label="Quantity" value={`${product.quantity} ${product.unit}`} />
              <InfoBox label="Price" value={`₹${product.price}`} />
              <InfoBox label="Product ID" value={product.productId} mono />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Origin: {product.originLocation}</span>
              </div>
            </div>

            {product.qualityMetrics && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Quality Metrics</p>
                <div className="grid grid-cols-2 gap-4">
                  {product.qualityMetrics.temperature && (
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                      <Thermometer className="h-4 w-4" />
                      <span>{product.qualityMetrics.temperature}°C</span>
                    </div>
                  )}
                  {product.qualityMetrics.humidity && (
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                      <Droplets className="h-4 w-4" />
                      <span>{product.qualityMetrics.humidity}% Humidity</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Blockchain Info */}
          <Card>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Blockchain Information</h3>
            <BlockchainBadge txHash={product.blockchainTxHash} />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Smart Contract:</span>
                <span className="font-mono text-gray-800">{product.smartContractAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IPFS Hash:</span>
                <span className="font-mono text-gray-800">{product.ipfsHash?.slice(0, 20)}...</span>
              </div>
            </div>
          </Card>

          {/* Supply Chain Journey */}
          {product.supplyChain && product.supplyChain.length > 0 && (
            <Card>
              <SupplyChainJourney supplyChain={product.supplyChain} />
            </Card>
          )}
        </div>

        {/* Right: Actions & Map */}
        <div className="space-y-6">
          {/* Current Owner */}
          <Card>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Current Owner</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">
                  {product.currentOwner.role === 'farmer' ? '👨‍🌾' :
                   product.currentOwner.role === 'distributor' ? '🚚' :
                   product.currentOwner.role === 'retailer' ? '🏪' : '🛒'}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{product.currentOwner.name}</p>
                <p className="text-sm text-gray-600 capitalize">{product.currentOwner.role}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-mono break-all">
              {product.currentOwnerWallet}
            </p>

            {canRequestProduct() && product.isAvailable && (
              <Button
                variant="blockchain"
                className="w-full mt-4"
                onClick={() => setShowRequestModal(true)}
              >
                Request This Product
              </Button>
            )}
          </Card>

          {/* QR Code */}
          {product.qrCode && (
            <Card>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Product QR Code
              </h3>
              <img 
                src={product.qrCode} 
                alt="QR Code" 
                className="w-full border-2 border-gray-200 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Scan to verify authenticity
              </p>
            </Card>
          )}

          {/* Location Map */}
          <LocationMap
            latitude={product.currentLatitude}
            longitude={product.currentLongitude}
            location={product.currentLocation}
            locationHistory={product.locationHistory}
          />
        </div>
      </div>

      {/* Transfer Request Modal */}
      {showRequestModal && (
        <TransferRequestModal
          product={product}
          onClose={() => setShowRequestModal(false)}
          onSuccess={fetchProductDetails}
        />
      )}
    </div>
  );
};

// Helper Components
const StatusBadge = ({ status }) => {
  const statusConfig = {
    registered: { color: 'bg-green-100 text-green-800', label: 'Registered' },
    'pending_distribution': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    'in_transit': { color: 'bg-blue-100 text-blue-800', label: 'In Transit' },
    'at_distributor': { color: 'bg-purple-100 text-purple-800', label: 'At Distributor' },
    'at_retailer': { color: 'bg-orange-100 text-orange-800', label: 'At Retailer' },
    sold: { color: 'bg-gray-100 text-gray-800', label: 'Sold' },
    delivered: { color: 'bg-teal-100 text-teal-800', label: 'Delivered' },
  };

  const config = statusConfig[status] || statusConfig.registered;

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

const InfoBox = ({ label, value, mono }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`font-semibold text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>
      {value}
    </p>
  </div>
);

export default ProductDetail;
