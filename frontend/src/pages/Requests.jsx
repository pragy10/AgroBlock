import React, { useState, useEffect } from 'react';
import { Inbox, Send, CheckCircle, XCircle, Clock, Package, MapPin } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { transferRequestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Requests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [activeTab, user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await transferRequestAPI.getAll(user.id, activeTab);
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!confirm('Are you sure you want to accept this request?')) return;

    try {
      await transferRequestAPI.accept(requestId, {
        location: user.location,
        latitude: 0,
        longitude: 0
      });
      alert('Request accepted! Transaction recorded on blockchain.');
      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Enter reason for rejection (optional):');
    
    try {
      await transferRequestAPI.reject(requestId, { reason });
      alert('Request rejected.');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'distributor_request': return 'Distribution Request';
      case 'retailer_request': return 'Retail Request';
      case 'consumer_purchase': return 'Purchase Request';
      default: return 'Transfer Request';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <Inbox className="h-8 w-8 text-primary-600" />
          <span>Transfer Requests</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Manage product transfer requests across the supply chain
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'received'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <Inbox className="inline h-5 w-5 mr-2" />
          Received ({requests.filter(r => activeTab === 'received').length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'sent'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <Send className="inline h-5 w-5 mr-2" />
          Sent ({requests.filter(r => activeTab === 'sent').length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <LoadingSpinner message="Loading requests..." />
      ) : requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Requests</h3>
            <p className="text-gray-500">
              {activeTab === 'received' 
                ? "You haven't received any transfer requests yet"
                : "You haven't sent any transfer requests yet"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request._id} hover={true}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Left: Product & User Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Product Image */}
                  {request.product?.images?.[0] && (
                    <img
                      src={request.product.images[0].url}
                      alt={request.product.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                  )}
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-800">
                        {request.product?.name || 'Product Deleted'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-700`}>
                        {request.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {getRequestTypeLabel(request.requestType)}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">
                          {activeTab === 'received' ? 'From' : 'To'}:
                        </p>
                        <p className="font-medium text-gray-800">
                          {activeTab === 'received' 
                            ? request.toUser?.name 
                            : request.fromUser?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {activeTab === 'received' 
                            ? request.toUser?.role 
                            : request.fromUser?.role}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Product ID:</p>
                        <p className="font-mono text-xs text-gray-800">
                          {request.productId}
                        </p>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      {request.proposedPrice && (
                        <span className="flex items-center space-x-1">
                          <span>Price:</span>
                          <span className="font-semibold">₹{request.proposedPrice}</span>
                        </span>
                      )}
                      {request.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{request.location}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {request.blockchainTxHash && (
                      <div className="mt-2">
                        <p className="text-xs text-blockchain-blue font-mono">
                          TX: {request.blockchainTxHash.slice(0, 20)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                {activeTab === 'received' && request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(request._id)}
                      icon={CheckCircle}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(request._id)}
                      icon={XCircle}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Accepted</span>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Rejected</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
