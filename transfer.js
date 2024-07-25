import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import walletkey from "./wallet.json" assert { type: "json" };

const to = new PublicKey(`mMN9rjbnUu1St4ofkeEgnkmsVZUpevchXUEZfP9bjZX`);

const from = Keypair.fromSecretKey(new Uint8Array(walletkey));

console.log({ to, from });

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const transfer = async () => {
  const balance = await connection.getBalance(from.publicKey);
  console.log(balance);

  if (balance == 0) {
    console.log(`Oga go hustle`);
  } else {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );
  }
  transaction.feePayer = from.publicKey;
  transaction;
};
const balance = connection.getBalance(from.publicKey);
console.log(balance);
