import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { generateKey } from "./keyggen.js";
import walletkey from "./wallet.json" assert { type: "json" };
(async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const { publickey } = generateKey();
    const Myaddress = Keypair.fromSecretKey(
      new Uint8Array(walletkey)
    ).publicKey.toBase58();
    console.log({ Myaddress: Myaddress.toBase58() });

    const myAddressPublic = new publickey(Myaddress);

    const signature = await connection.requestAirdrop(
      myAddressPublic,
      LAMPORTS_PER_SOL
    );
    console.log(`Airdrop requested. Signature: ${signature}`);
  } catch (error) {
    console.error("Error:", error);
  }
})();
// GdcBCD4AJ7jQtafCMNTMReEyqZd3EQSy68VxwVrvaP5m
