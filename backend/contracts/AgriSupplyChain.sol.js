// SIMULATED SMART CONTRACT - AgriSupplyChain.sol
// This represents the blockchain smart contract logic
// In production, this would be deployed on Ethereum/Polygon

const SMART_CONTRACT_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriSupplyChain {
    
    struct Product {
        string productId;
        string name;
        address currentOwner;
        string originLocation;
        uint256 harvestDate;
        uint256 registeredAt;
        bool exists;
    }
    
    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
        string location;
    }
    
    mapping(string => Product) public products;
    mapping(string => Transfer[]) public productHistory;
    
    event ProductRegistered(
        string indexed productId,
        string name,
        address indexed owner,
        uint256 timestamp
    );
    
    event OwnershipTransferred(
        string indexed productId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    
    // Register new agricultural product on blockchain
    function registerProduct(
        string memory _productId,
        string memory _name,
        string memory _originLocation,
        uint256 _harvestDate
    ) public returns (bool) {
        require(!products[_productId].exists, "Product already registered");
        
        products[_productId] = Product({
            productId: _productId,
            name: _name,
            currentOwner: msg.sender,
            originLocation: _originLocation,
            harvestDate: _harvestDate,
            registeredAt: block.timestamp,
            exists: true
        });
        
        emit ProductRegistered(_productId, _name, msg.sender, block.timestamp);
        return true;
    }
    
    // Transfer ownership in supply chain
    function transferOwnership(
        string memory _productId,
        address _newOwner,
        string memory _location
    ) public returns (bool) {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].currentOwner == msg.sender, "Not authorized");
        
        address previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;
        
        productHistory[_productId].push(Transfer({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp,
            location: _location
        }));
        
        emit OwnershipTransferred(_productId, previousOwner, _newOwner, block.timestamp);
        return true;
    }
    
    // Get product history (supply chain journey)
    function getProductHistory(string memory _productId) 
        public 
        view 
        returns (Transfer[] memory) 
    {
        return productHistory[_productId];
    }
    
    // Verify product authenticity
    function verifyProduct(string memory _productId) 
        public 
        view 
        returns (bool, address, uint256) 
    {
        Product memory product = products[_productId];
        return (product.exists, product.currentOwner, product.registeredAt);
    }
}
`;

// Simulated blockchain interaction functions
class BlockchainSimulator {
  
  // Simulate contract deployment
  static getContractAddress() {
    return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  }
  
  // Simulate transaction hash generation
  static generateTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
  
  // Simulate wallet address generation
  static generateWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }
  
  // Simulate gas calculation
  static calculateGas() {
    const gasAmount = (Math.random() * 0.005 + 0.001).toFixed(4);
    return `${gasAmount} ETH`;
  }
  
  // Simulate block number
  static getBlockNumber() {
    return Math.floor(Math.random() * 1000000) + 15000000;
  }
  
  // Simulate IPFS hash for sensor data
  static generateIPFSHash() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = 'Qm';
    for (let i = 0; i < 44; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
  
  // Simulate smart contract function call - Register Product
  static async registerProduct(productData) {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      txHash: this.generateTxHash(),
      blockNumber: this.getBlockNumber(),
      gasUsed: this.calculateGas(),
      contractAddress: this.getContractAddress(),
      event: 'ProductRegistered',
      timestamp: Date.now()
    };
  }
  
  // Simulate smart contract function call - Transfer Ownership
  static async transferOwnership(productId, fromWallet, toWallet) {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      txHash: this.generateTxHash(),
      blockNumber: this.getBlockNumber(),
      gasUsed: this.calculateGas(),
      contractAddress: this.getContractAddress(),
      event: 'OwnershipTransferred',
      from: fromWallet,
      to: toWallet,
      timestamp: Date.now()
    };
  }
}

module.exports = {
  SMART_CONTRACT_CODE,
  BlockchainSimulator
};
