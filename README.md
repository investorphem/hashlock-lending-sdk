# hashlock-lending-sdk 🔒

![npm](https://img.shields.io/npm/v/hashlock-lending-sdk)
![npm downloads](https://img.shields.io/npm/dw/hashlock-lending-sdk)
![license](https://img.shields.io/npm/l/hashlock-lending-sdk)

**Yield on Bitcoin. Locked by code. Verified by hash.**

The **first developer-ready JavaScript SDK** for interacting with HashLock Lending — the Bitcoin L2 lending protocol powered by Clarity 4.

No admin keys • No upgrades • No trust assumptions • Verified vaults

---

## Installation

```bash
npm install hashlock-lending-sdk
```

or

```bash
yarn add hashlock-lending-sdk
```

---

## Quick Start (ES Modules)

```javascript
import { HashlockClient } from 'hashlock-lending-sdk';

// Initialize SDK
const client = new HashlockClient({ network: "mainnet" });

// Connect wallet (Xverse / Leather)
await client.connectWallet({ appName: "HashLock SDK Demo" });

// Create a new loan
const loanId = await client.createLoan({
  loanId: "loan_888",
  borrower: "SP123...",
  lender: "SP456...",
  amount: 1000000, // 1 STX in micro-STX
  preimage: "my-secure-preimage"
});

// Repay loan using the secret preimage
await client.repayLoan("loan_888", "my-secure-preimage");

const status = client.getLoanStatus("loan_888");
console.log("Is Repaid:", status.repaid);
```

---

## Core Features

| Feature | hashlock-lending-sdk | Other Lending Protocols |
|---------|--------------------|-----------------------|
| On-chain code hash verification | ✅ `contract-hash?` enforced on every deposit | ❌ None |
| Auto-revert rogue transfers | ✅ `restrict-assets?` post-conditions | ❌ Admin keys only |
| Immutable vaults | ✅ Pure templates | ❌ Proxy upgrades required |
| Admin keys | ✅ None | ❌ Always present |
| Clarity version | ✅ 4 | ❌ 2/3 |
| Wallet Integration | ✅ Xverse / Leather | ❌ None |

---

## Live Contracts (Stacks Mainnet)

| Contract | Purpose | Address |
|----------|---------|---------|
| `hashlock-core` | Lending pool + template registry | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core` |
| `hashlock-isolated-sbtc-v1` | First whitelisted vault (sBTC flash loans) | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1` |
| `safe-vault-base` | Shared immutable safety traits | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base` |

---

## Developer Guide

### 1. Clone the Repo

```bash
git clone [https://github.com/investorphem/hashlock-lending-sdk.git](https://github.com/investorphem/hashlock-lending-sdk.git)
cd hashlock-lending-sdk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Connect Wallet (Xverse or Leather)

```javascript
await client.connectWallet({ appName: "Your App Name" });
```

### 4. Create & Repay Loans

Use `createLoan`, `repayLoan`, and `getLoanStatus` methods as shown in the Quick Start.

### 5. Call Clarity Contracts

- `callContract` → For securely triggering on-chain contract calls via wallet popup.  

---

## Tech Stack

- **Smart Contracts:** Clarity 4 on Stacks (Bitcoin-secured via PoX + sBTC)  
- **Frontend:** React + Vite + @stacks/connect (Leather/Xverse)  
- **Hosting:** Vercel (zero-config)  
- **Supported Assets:** sBTC (mainnet), xBTC, USDA, stSTX coming  

---

## Resources

- **App:** [hashlocklending.vercel.app](https://hashlocklending.vercel.app)  
- **Explorer:** [Hiro Explorer](https://explorer.hiro.so/address/SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR)  
- **Twitter:** [@investorphem](https://twitter.com/investorphem)
