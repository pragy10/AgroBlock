import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Activity, Truck, ShoppingCart } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { userAPI, productAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    farmers: 0,
    distributors: 0,
    retailers: 0,
    consumers: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users and products
      const [usersResponse, productsResponse] = await Promise.all([
        userAPI.getAllUsers(),
        productAPI.getAllProducts(),
      ]);

      const users = usersResponse.data.data;
      const products = productsResponse.data.data;

      // Calculate stats
      const userStats = {
        totalUsers: users.length,
        farmers: users.filter(u => u.role === 'farmer').length,
        distributors: users.filter(u => u.role === 'distributor').length,
        retailers: users.filter(u => u.role === 'retailer').length,
        consumers: users.filter(u => u.role === 'consumer').length,
      };

      setStats({
        ...userStats,
        totalProducts: products.length,
        totalTransactions: products.length, // Simplified
      });

      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">
          Blockchain-based Agricultural Supply Chain Management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          trend="Active on blockchain"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="green"
          trend="Registered on-chain"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={Activity}
          color="purple"
          trend="Blockchain verified"
        />
        <StatCard
          title="Supply Chain"
          value="Active"
          icon={TrendingUp}
          color="teal"
          trend="Real-time tracking"
        />
      </div>

      {/* User Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            User Distribution by Role
          </h2>
          <div className="space-y-4">
            <RoleBar label="Farmers" count={stats.farmers} total={stats.totalUsers} color="green" />
            <RoleBar label="Distributors" count={stats.distributors} total={stats.totalUsers} color="blue" />
            <RoleBar label="Retailers" count={stats.retailers} total={stats.totalUsers} color="purple" />
            <RoleBar label="Consumers" count={stats.consumers} total={stats.totalUsers} color="orange" />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Blockchain Network Status
          </h2>
          <div className="space-y-4">
            <NetworkStat label="Network" value="Ethereum Goerli Testnet" status="active" />
            <NetworkStat label="Smart Contract" value="0x742d...5f0bEb" status="deployed" />
            <NetworkStat label="Gas Price" value="0.002 ETH" status="normal" />
            <NetworkStat label="Block Time" value="~12 seconds" status="stable" />
          </div>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Products Registered
        </h2>
        {recentProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products registered yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.currentOwner?.name || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// Helper Components
const RoleBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const NetworkStat = ({ label, value, status }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    deployed: 'bg-blue-100 text-blue-800',
    normal: 'bg-yellow-100 text-yellow-800',
    stable: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-mono">{value}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    registered: { color: 'bg-green-100 text-green-800', label: 'Registered' },
    'in-transit': { color: 'bg-blue-100 text-blue-800', label: 'In Transit' },
    delivered: { color: 'bg-purple-100 text-purple-800', label: 'Delivered' },
    sold: { color: 'bg-gray-100 text-gray-800', label: 'Sold' },
  };

  const config = statusConfig[status] || statusConfig.registered;

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default Dashboard;
