import { HashlockClient } from "./index.js";

async function main() {
  // Initialize SDK
  const client = new HashlockClient({ network: "mainnet" });

  try {
    console.log("--- Starting Hashlock SDK Logic Test ---");

    // 1. Test Hash Generation (Static method)
    const preimage = "super-secret-key-123";
    const expectedHash = HashlockClient.generateHash(preimage);
    console.log("Generated Hash:", expectedHash);

    // 2. Create a loan
    console.log("\nCreating loan...");
    const loanId = "loan_001";
    await client.createLoan({
      loanId: loanId,
      borrower: "SP26KS99S808XSTB3369N00B9H6SQZ0D064E03A6Y",
      lender: "SP3FG8S08XSTB3369N00B9H6SQZ0D064E03A6Y",
      amount: 1000000, // 1 STX in micro-STX
      preimage: preimage,
      expiry: Date.now() + 3600000 // 1 hour from now
    });

    const status = client.getLoanStatus(loanId);
    console.log("Loan Status:", status);

    // 3. Attempt repayment with WRONG preimage
    console.log("\nAttempting repayment with wrong preimage...");
    try {
      await client.repayLoan(loanId, "wrong-password");
    } catch (e) {
      console.log("Success: Correctly caught invalid preimage error:", e.message);
    }

    // 4. Repay the loan with CORRECT preimage
    console.log("\nRepaying loan with correct preimage...");
    const isRepaid = await client.repayLoan(loanId, preimage);
    
    if (isRepaid) {
      const finalStatus = client.getLoanStatus(loanId);
      console.log("Loan successfully repaid!");
      console.log("Final State:", finalStatus);
    }

    console.log("\n--- Logic Test Passed ---");
    console.log("Note: connectWallet() and sendSTX() require a browser environment to trigger wallet popups.");

  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

main();
