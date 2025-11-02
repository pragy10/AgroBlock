import React from 'react';
import { Link2 } from 'lucide-react';

const BlockchainBadge = ({ txHash, blockNumber }) => {
  const shortHash = txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : 'N/A';

  return (
    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blockchain-blue/10 to-blockchain-purple/10 border border-blockchain-blue/30 rounded-lg px-4 py-2">
      <Link2 className="h-4 w-4 text-blockchain-blue blockchain-pulse" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium">Blockchain TX</span>
        <span className="text-sm font-mono font-semibold text-blockchain-blue">
          {shortHash}
        </span>
      </div>
      {blockNumber && (
        <div className="flex flex-col ml-4">
          <span className="text-xs text-gray-500 font-medium">Block</span>
          <span className="text-sm font-mono font-semibold text-blockchain-purple">
            #{blockNumber}
          </span>
        </div>
      )}
    </div>
  );
};

export default BlockchainBadge;
