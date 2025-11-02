import React, { useState, useEffect } from 'react';
import { Blocks, Activity, Database, Clock, Hash, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { blockchainAPI } from '../services/api';

const BlockchainExplorer = () => {
  const [overview, setOverview] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      const [overviewRes, blocksRes] = await Promise.all([
        blockchainAPI.getOverview(),
        blockchainAPI.getBlocks()
      ]);

      setOverview(overviewRes.data.data);
      setBlocks(blocksRes.data.data);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading blockchain data..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <Blocks className="h-8 w-8 text-blockchain-blue" />
          <span>Blockchain Explorer</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Distributed Ledger Technology - Real-time Blockchain Visualization
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blockchain-blue/10 to-blockchain-blue/5 border-blockchain-blue/20">
          <div className="flex items-center space-x-3">
            <div className="bg-blockchain-blue/20 p-3 rounded-lg">
              <Database className="h-6 w-6 text-blockchain-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-2xl font-bold text-gray-800">{overview?.totalBlocks || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blockchain-purple/10 to-blockchain-purple/5 border-blockchain-purple/20">
          <div className="flex items-center space-x-3">
            <div className="bg-blockchain-purple/20 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-blockchain-purple" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chain Height</p>
              <p className="text-2xl font-bold text-gray-800">{overview?.chainHeight || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blockchain-teal/10 to-blockchain-teal/5 border-blockchain-teal/20">
          <div className="flex items-center space-x-3">
            <div className="bg-blockchain-teal/20 p-3 rounded-lg">
              <Hash className="h-6 w-6 text-blockchain-teal" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-800">
                {blocks.reduce((sum, block) => sum + (block.transactions?.length || 0), 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-200 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Block</p>
              <p className="text-sm font-bold text-gray-800">
                {overview?.lastBlockTime ? new Date(overview.lastBlockTime).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Blockchain Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Block List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Blocks</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {blocks.map((block, index) => (
                <div
                  key={block._id}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedBlock?._id === block._id
                      ? 'border-blockchain-blue bg-blockchain-blue/5'
                      : 'border-gray-200 hover:border-blockchain-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blockchain-blue/10 px-3 py-1 rounded-lg">
                        <span className="text-blockchain-blue font-bold">#{block.blockNumber}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {block.transactions?.length || 0} TXs
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Hash:</span>
                      <span className="font-mono text-blockchain-blue">
                        {block.hash.slice(0, 20)}...{block.hash.slice(-10)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Previous:</span>
                      <span className="font-mono text-gray-600">
                        {block.previousHash.slice(0, 20)}...
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Gas Used:</span>
                      <span className="font-semibold text-gray-700">{block.gasUsed}</span>
                    </div>
                  </div>

                  {index < blocks.length - 1 && (
                    <div className="flex justify-center mt-3">
                      <ArrowRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Block Details */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Block Details</h2>

            {selectedBlock ? (
              <div className="space-y-4">
                <div className="p-3 bg-blockchain-blue/10 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Block Number</p>
                  <p className="text-2xl font-bold text-blockchain-blue">#{selectedBlock.blockNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Timestamp</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(selectedBlock.timestamp).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Hash</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {selectedBlock.hash}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Previous Hash</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {selectedBlock.previousHash}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nonce</p>
                    <p className="font-semibold text-gray-800">{selectedBlock.nonce}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                    <p className="font-semibold text-gray-800">
                      {selectedBlock.difficulty?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Gas Used</p>
                  <p className="font-semibold text-gray-800">{selectedBlock.gasUsed}</p>
                </div>

                {/* Transactions in Block */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Transactions ({selectedBlock.transactions?.length || 0})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedBlock.transactions?.map((tx, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs px-2 py-1 bg-blockchain-purple text-white rounded font-medium">
                            {tx.type}
                          </span>
                          <span className="text-xs text-gray-500">TX #{idx + 1}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="text-gray-500">Product ID:</span>
                            <span className="ml-1 font-mono text-gray-800">{tx.productId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">From:</span>
                            <span className="ml-1 font-mono text-gray-800">
                              {tx.from?.slice(0, 10)}...
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">To:</span>
                            <span className="ml-1 font-mono text-gray-800">
                              {tx.to?.slice(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Blocks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a block to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Blockchain Info */}
      <Card className="mt-6 bg-gradient-to-r from-blockchain-blue/5 to-blockchain-purple/5">
        <div className="flex items-start space-x-4">
          <div className="bg-blockchain-blue/20 p-3 rounded-lg">
            <Database className="h-6 w-6 text-blockchain-blue" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">About This Blockchain</h3>
            <p className="text-sm text-gray-600 mb-2">
              This is a distributed ledger recording all agricultural supply chain transactions. 
              Each block contains cryptographically linked transactions that are immutable and transparent.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Consensus</p>
                <p className="font-semibold text-gray-800">Proof of Authority</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Network</p>
                <p className="font-semibold text-gray-800">Ethereum Testnet</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Block Time</p>
                <p className="font-semibold text-gray-800">~12 seconds</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlockchainExplorer;
