import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import walletkey from "./wallet.json" assert { type: "json" };

// Define the recipient public key
const to = new PublicKey("mMN9rjbnUu1St4ofkeEgnkmsVZUpevchXUEZfP9bjZX");

// Load the sender keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(walletkey));

console.log({ to: to.toBase58(), from: from.publicKey.toBase58() });

// Set up the connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const transfer = async () => {
  // Fetch the balance of the sender's account
  const balance = await connection.getBalance(from.publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance === 0) {
    console.log(`Oga go hustle`);

    const airdrop = await connection.requestAirdrop(
      from.publicKey,
      LAMPORTS_PER_SOL
    );
    console.log(airdrop);
  } else {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );
    transaction.feePayer = from.publicKey;

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;

    // Estimate the transaction fee
    const { value: fee } = await connection.getFeeForMessage(
      transaction.compileMessage(),
      "confirmed"
    );
    const adjustedLamports = balance - (fee || 0);

    // Remove the initial transfer instruction and add a new one with adjusted lamports
    transaction.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: adjustedLamports,
      })
    );

    try {
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );
      console.log(`Transaction successful with signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  }
};

// Execute the transfer function
transfer().then(async () => {
  const balance = await connection.getBalance(from.publicKey);
  console.log(`Final Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
});
