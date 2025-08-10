const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgriSupplyChain", function () {
  let agriSupplyChain;
  let owner;
  let farmer;
  let distributor;
  let retailer;

  beforeEach(async function () {
    // Get test accounts
    [owner, farmer, distributor, retailer] = await ethers.getSigners();
    
    // Deploy the contract
    const AgriSupplyChain = await ethers.getContractFactory("AgriSupplyChain");
    agriSupplyChain = await AgriSupplyChain.deploy();
    await agriSupplyChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await agriSupplyChain.admin()).to.equal(owner.address);
    });

    it("Should initialize nextProduceId to 1", async function () {
      expect(await agriSupplyChain.nextProduceId()).to.equal(1);
    });
  });

  describe("Produce Registration", function () {
    it("Should register a new produce successfully", async function () {
      const productName = "Organic Tomatoes";
      const location = "Farm A, Village XYZ";
      const condition = "Fresh, 25°C";

      const tx = await agriSupplyChain.connect(farmer).registerProduce(
        productName,
        location,
        condition
      );

      // Check if event was emitted
      await expect(tx)
        .to.emit(agriSupplyChain, "ProduceRegistered")
        .withArgs(1, farmer.address, productName);

      // Check produce details
      const produce = await agriSupplyChain.getProduce(1);
      expect(produce.productName).to.equal(productName);
      expect(produce.currentOwner).to.equal(farmer.address);
      expect(produce.farmer).to.equal(farmer.address);
      expect(produce.currentLocation).to.equal(location);
      expect(produce.currentCondition).to.equal(condition);
      expect(produce.isActive).to.be.true;
    });

    it("Should increment nextProduceId after registration", async function () {
      await agriSupplyChain.connect(farmer).registerProduce(
        "Organic Carrots",
        "Farm B",
        "Fresh"
      );

      expect(await agriSupplyChain.nextProduceId()).to.equal(2);
    });
  });

  describe("Status Updates", function () {
    beforeEach(async function () {
      // Register a produce first
      await agriSupplyChain.connect(farmer).registerProduce(
        "Organic Tomatoes",
        "Farm A",
        "Fresh, 25°C"
      );
    });

    it("Should update status successfully by owner", async function () {
      const newLocation = "Distribution Center A";
      const newCondition = "Good, 23°C";
      const notes = "Transferred to distribution center";

      const tx = await agriSupplyChain.connect(farmer).updateStatus(
        1,
        newLocation,
        newCondition,
        notes
      );

      // Check if event was emitted
      await expect(tx)
        .to.emit(agriSupplyChain, "StatusUpdated")
        .withArgs(1, farmer.address, newLocation, newCondition);

      // Check updated produce details
      const produce = await agriSupplyChain.getProduce(1);
      expect(produce.currentLocation).to.equal(newLocation);
      expect(produce.currentCondition).to.equal(newCondition);
    });

    it("Should fail if non-owner tries to update status", async function () {
      await expect(
        agriSupplyChain.connect(distributor).updateStatus(
          1,
          "Unauthorized Location",
          "Good",
          "Should fail"
        )
      ).to.be.revertedWith("Not the owner");
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      // Register a produce first
      await agriSupplyChain.connect(farmer).registerProduce(
        "Organic Tomatoes",
        "Farm A",
        "Fresh, 25°C"
      );
    });

    it("Should transfer ownership successfully", async function () {
      const tx = await agriSupplyChain.connect(farmer).transferOwnership(
        1,
        distributor.address
      );

      // Check if event was emitted
      await expect(tx)
        .to.emit(agriSupplyChain, "OwnershipTransferred")
        .withArgs(1, farmer.address, distributor.address);

      // Check new owner
      const produce = await agriSupplyChain.getProduce(1);
      expect(produce.currentOwner).to.equal(distributor.address);
    });

    it("Should fail if non-owner tries to transfer", async function () {
      await expect(
        agriSupplyChain.connect(distributor).transferOwnership(
          1,
          retailer.address
        )
      ).to.be.revertedWith("Not the owner");
    });

    it("Should fail if transferring to zero address", async function () {
      await expect(
        agriSupplyChain.connect(farmer).transferOwnership(
          1,
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("History Tracking", function () {
    it("Should track complete history", async function () {
      // Register produce
      await agriSupplyChain.connect(farmer).registerProduce(
        "Organic Tomatoes",
        "Farm A",
        "Fresh, 25°C"
      );

      // Update status
      await agriSupplyChain.connect(farmer).updateStatus(
        1,
        "Distribution Center",
        "Good, 20°C",
        "In transit"
      );

      // Get history
      const [produce, history] = await agriSupplyChain.getProduceHistory(1);

      expect(history.length).to.equal(2); // Initial + 1 update
      expect(history[0].notes).to.equal("Initial registration");
      expect(history[1].notes).to.equal("In transit");
    });

    it("Should fail to get history for non-existent produce", async function () {
      await expect(
        agriSupplyChain.getProduceHistory(999)
      ).to.be.revertedWith("Produce does not exist");
    });
  });
});
