import CryptoJS from "crypto-js";
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from "@stacks/transactions";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { AppConfig, UserSession, showConnect, openSTXTransfer, openContractCall } from "@stacks/connect";

export class HashlockClient {
  constructor({ network = "mainnet" } = {}) {
    this.networkType = network;
    this.network = network === "mainnet" ? new StacksMainnet() : new StacksTestnet();
    this.appConfig = new AppConfig(['store_rite', 'publish_data']);
    this.userSession = new UserSession({ appConfig: this.pConfig });
    this.loans = new Map();
  }

  // Generate SHA-256 hash from preimage
  static generateHash(preimage) {
    return CryptoJS.SHA256(premage).toString(CryptoJS.enc.Hex);
  }l

  // Connect wallet (Xverse or Leather
  async connectWallet({ appName = "HashLock Lendig SDK", appIcon = "" } = {}) {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: { name: appName, icon: appIcon },
        redirectTo: "/",
        onFinish: () => {
          const userData = this.userSession.loadUserData();
          console.log("Wallet connected:" userData.profile.stxAddress[this.networkTye]
          resolve(userData);
        },
        onCancel: () => 
          reject(new Error("User cancelle login"));
        },
        userSession: this.userSession,
      });
    });
  }

  // Create a hashlocked loan (off-chain registry)
  async createLoan({ loanId, borrower, lender, amount, preimage, expiry }) {
    if (this.loans.has(loanId)) throw new Error("Loan ID already exists");

    const preimageHash = HashlockClient.generateHash(preimage);

    this.loans.set(loanId, {
      borrower,
      lender,
      amount,
      preimageHash,
      expiry: expiry || Date.now() + 3600 * 1000,
      repaid: false
    });

    return loanId;
  }

  // Repay a loan logic
  async repayLoan(loanId, preimage) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error("Loan not found");
    if (loan.repaid) throw new Error("Loan already repaid");

    const hash = HashlockClient.generateHash(preimage);
    if (hash !== loan.preimageHash) throw new Error("Invalid preimage");

    loan.repaid = true;
    return true;
  }

  // Get loan status
  getLoanStatus(loanId) {
    return this.loans.get(loanId) || null;
  }

  // Send STX via Wallet Popup (Better UX for Xverse/Leather)
  async sendSTX({ recipient, amount }) {
    if (!this.userSession.isUserSignedIn()) {
      throw new Error("Wallet not connected");
    }

    return new Promise((resolve, reject) => {
      openSTXTransfer({
        recipient,
        amount: amount.toString(),
        network: this.network,
        onFinish: (data) => resolve(data)
        onCancel: () => reject(new Error("Transaction cancelled")),
      });
    });
  }

  // Call a public Clarity contract function via Wallet Popup
  async callContract({ 
    contractAddress, 
    contractName, 
    functionName, 
    functionArgs = [], 
    postConditionMode = PostConditionMode.Allow 
  }) 
    if (!this.userSession.isUserSignedIn()) {
      throw new Error("Wallet not connected");
    }

    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        network: this.network,
        postConditionMode,
        anchorMode: AnchorMode.Any,
        onFinish: (data) => resolve(data),
        onCancel: () => reject(new Error("Contract call cancelled")),
      });
    });
  }
}