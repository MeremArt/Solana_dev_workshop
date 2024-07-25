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

//myguy wallet
const to = new PublicKey("mMN9rjbnUu1St4ofkeEgnkmsVZUpevchXUEZfP9bjZX");

// my wallet
const from = Keypair.fromSecretKey(new Uint8Array(walletkey));

console.log({ to: to.toBase58(), from: from.publicKey.toBase58() });
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const newTransfer = async () => {
  const balance = await connection.getBalance(from.publicKey);
  const toBalance = await connection.getBalance(to);
  console.log(`mYGuyBalance: ${toBalance / LAMPORTS_PER_SOL} SOL `);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  const amount = LAMPORTS_PER_SOL * 0.5;
  if (balance === 0) {
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

    const { value: fee } = await connection.getFeeForMessage(
      transaction.compileMessage(),
      "confirmed"
    );

    transaction.instructions.pop();
    const adjustLamports = balance - amount - (fee || 0);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: adjustLamports,
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

newTransfer().then(async () => {
  const myBalance = await connection.getBalance(from.publicKey);
  const balance = await connection.getBalance(to);
  console.log(`Final Balance: ${myBalance / LAMPORTS_PER_SOL} SOL`);
  console.log(`myGuy Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
});
