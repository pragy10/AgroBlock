import React, { useState, useEffect } from 'react';
import { Code, CheckCircle, Info, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getContractInfo } from '../services/api';

const SmartContract = () => {
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractInfo();
  }, []);

  const fetchContractInfo = async () => {
    try {
      setLoading(true);
      const response = await getContractInfo();
      setContractInfo(response.data);
    } catch (error) {
      console.error('Error fetching contract info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading smart contract..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <Code className="h-8 w-8 text-blockchain-blue" />
          <span>Smart Contract</span>
        </h1>
        <p className="text-gray-600 mt-2">
          View deployed blockchain smart contract details
        </p>
      </div>

      {/* Contract Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500">Network</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{contractInfo?.network}</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Code className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Compiler</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{contractInfo?.compiler}</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Info className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">Deployed At</span>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {contractInfo?.deployedAt ? new Date(contractInfo.deployedAt).toLocaleDateString() : 'N/A'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-medium text-gray-500">Status</span>
          </div>
          <p className="text-lg font-bold text-green-600">Active</p>
        </Card>
      </div>

      {/* Contract Address */}
      <Card className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Contract Address</h2>
        <div className="bg-gradient-to-r from-blockchain-blue/10 to-blockchain-purple/10 border border-blockchain-blue/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Deployed Contract Address</p>
              <p className="text-lg font-mono font-bold text-blockchain-blue">
                {contractInfo?.contractAddress}
              </p>
            </div>
            <a
              href={`https://goerli.etherscan.io/address/${contractInfo?.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blockchain-blue text-white rounded-lg hover:bg-blockchain-purple transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">View on Etherscan</span>
            </a>
          </div>
        </div>
      </Card>

      {/* Contract Features */}
      <Card className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Contract Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureItem
            title="Product Registration"
            description="Register agricultural products with metadata on blockchain"
            icon="📦"
          />
          <FeatureItem
            title="Ownership Transfer"
            description="Transfer product ownership between supply chain actors"
            icon="🔄"
          />
          <FeatureItem
            title="Product History"
            description="Retrieve complete journey and transaction history"
            icon="📜"
          />
          <FeatureItem
            title="Authenticity Verification"
            description="Verify product authenticity and current ownership"
            icon="✅"
          />
        </div>
      </Card>

      {/* Smart Contract Source Code */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Smart Contract Source Code</h2>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Solidity ^0.8.0
          </span>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm text-gray-100 font-mono leading-relaxed">
            <code>{contractInfo?.sourceCode}</code>
          </pre>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This smart contract is deployed on the Ethereum Goerli testnet. 
            All transactions are recorded immutably on the blockchain, ensuring transparency and traceability 
            throughout the agricultural supply chain.
          </p>
        </div>
      </Card>
    </div>
  );
};

// Helper Component
const FeatureItem = ({ title, description, icon }) => (
  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="text-3xl">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default SmartContract;
