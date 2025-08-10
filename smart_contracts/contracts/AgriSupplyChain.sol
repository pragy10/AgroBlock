// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriSupplyChain {
    // Data Structure for Produce
    struct Produce {
        uint256 id;
        string productName;
        address currentOwner;
        address farmer;
        uint256 registrationTime;
        uint256 lastUpdateTime;
        string currentLocation;
        string currentCondition;
        bool isActive;
    }
    
    // Data Structure for Status Update
    struct StatusUpdate {
        uint256 timestamp;
        address updatedBy;
        string location;
        string condition;
        string notes;
    }
    
    // Mappings
    mapping(uint256 => Produce) public produces;
    mapping(uint256 => StatusUpdate[]) public statusHistory;
    mapping(address => bool) public authorizedActors;
    
    // Events
    event ProduceRegistered(uint256 indexed produceId, address indexed farmer, string productName);
    event OwnershipTransferred(uint256 indexed produceId, address indexed from, address indexed to);
    event StatusUpdated(uint256 indexed produceId, address indexed updatedBy, string location, string condition);
    
    uint256 public nextProduceId = 1;
    address public admin;
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAuthorized() {
        require(authorizedActors[msg.sender] || msg.sender == admin, "Not authorized");
        _;
    }
    
    modifier onlyOwner(uint256 _produceId) {
        require(produces[_produceId].currentOwner == msg.sender, "Not the owner");
        _;
    }
    
    // Function 1: Register Produce
    function registerProduce(
        string memory _productName,
        string memory _initialLocation,
        string memory _initialCondition
    ) public returns (uint256) {
        uint256 produceId = nextProduceId++;
        
        produces[produceId] = Produce({
            id: produceId,
            productName: _productName,
            currentOwner: msg.sender,
            farmer: msg.sender,
            registrationTime: block.timestamp,
            lastUpdateTime: block.timestamp,
            currentLocation: _initialLocation,
            currentCondition: _initialCondition,
            isActive: true
        });
        
        // Add initial status
        statusHistory[produceId].push(StatusUpdate({
            timestamp: block.timestamp,
            updatedBy: msg.sender,
            location: _initialLocation,
            condition: _initialCondition,
            notes: "Initial registration"
        }));
        
        emit ProduceRegistered(produceId, msg.sender, _productName);
        return produceId;
    }
    
    // Function 2: Transfer Ownership (Your main function)
    function transferOwnership(uint256 _produceId, address _newOwner) public onlyOwner(_produceId) {
        require(_newOwner != address(0), "Invalid address");
        require(produces[_produceId].isActive, "Produce not active");
        
        address previousOwner = produces[_produceId].currentOwner;
        produces[_produceId].currentOwner = _newOwner;
        produces[_produceId].lastUpdateTime = block.timestamp;
        
        emit OwnershipTransferred(_produceId, previousOwner, _newOwner);
    }
    
    // Function 3: Update Status (Your main function)
    function updateStatus(
        uint256 _produceId,
        string memory _location,
        string memory _condition,
        string memory _notes
    ) public onlyOwner(_produceId) {
        require(produces[_produceId].isActive, "Produce not active");
        
        produces[_produceId].currentLocation = _location;
        produces[_produceId].currentCondition = _condition;
        produces[_produceId].lastUpdateTime = block.timestamp;
        
        statusHistory[_produceId].push(StatusUpdate({
            timestamp: block.timestamp,
            updatedBy: msg.sender,
            location: _location,
            condition: _condition,
            notes: _notes
        }));
        
        emit StatusUpdated(_produceId, msg.sender, _location, _condition);
    }
    
    // Function 4: Get Full History (Your main function)
    function getProduceHistory(uint256 _produceId) public view returns (
        Produce memory produce,
        StatusUpdate[] memory history
    ) {
        require(produces[_produceId].id != 0, "Produce does not exist");
        return (produces[_produceId], statusHistory[_produceId]);
    }
    
    // Utility functions
    function authorizeActor(address _actor) public {
        require(msg.sender == admin, "Only admin can authorize");
        authorizedActors[_actor] = true;
    }
    
    function getProduce(uint256 _produceId) public view returns (Produce memory) {
        return produces[_produceId];
    }
}
