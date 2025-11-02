import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

const SupplyChainJourney = ({ supplyChain }) => {
  const roleIcons = {
    farmer: '👨‍🌾',
    distributor: '🚚',
    retailer: '🏪',
    consumer: '🛒'
  };

  const roleColors = {
    farmer: 'green',
    distributor: 'blue',
    retailer: 'purple',
    consumer: 'orange'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Supply Chain Journey</h3>
      
      <div className="relative">
        {supplyChain.map((item, index) => (
          <div key={index} className="flex items-start mb-6 last:mb-0">
            {/* Timeline Line */}
            {index < supplyChain.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
            )}
            
            {/* Icon */}
            <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-${roleColors[item.role]}-100 flex items-center justify-center text-2xl border-4 border-white shadow-md`}>
              {roleIcons[item.role]}
            </div>

            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800 capitalize">{item.role}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${roleColors[item.role]}-100 text-${roleColors[item.role]}-700`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.user?.name || 'Unknown'}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{new Date(item.receivedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-mono">{item.wallet?.slice(0, 10)}...</span>
                </div>
                {item.blockchainTxHash && (
                  <div className="mt-2 text-xs">
                    <span className="text-blockchain-blue font-mono">
                      TX: {item.blockchainTxHash.slice(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplyChainJourney;
