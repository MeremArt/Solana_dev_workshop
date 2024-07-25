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

const from = Keypair.fromSecretKey(new Uint8Array(walletkey));
const to = new PublicKey("mMN9rjbnUu1St4ofkeEgnkmsVZUpevchXUEZfP9bjZX");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const balance = await connection.getBalance(to);
const mybalance = await connection.getBalance(from.publicKey);
console.log(`myBalance: ${mybalance / LAMPORTS_PER_SOL} SOL`);
console.log(`myGuyBalance: ${balance / LAMPORTS_PER_SOL} SOL`);
