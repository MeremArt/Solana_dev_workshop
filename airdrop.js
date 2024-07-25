import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { generateKey } from "./keyggen.js";

(async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const { publickey } = generateKey();
    const Myaddress = new PublicKey(publickey);
    console.log({ Myaddress: Myaddress.toBase58() });

    const signature = await connection.requestAirdrop(
      Myaddress,
      LAMPORTS_PER_SOL
    );
    console.log(`Airdrop requested. Signature: ${signature}`);
  } catch (error) {
    console.error("Error:", error);
  }
})();
// GdcBCD4AJ7jQtafCMNTMReEyqZd3EQSy68VxwVrvaP5m
