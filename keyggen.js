import { Keypair } from "@solana/web3.js";

export const generateKey = () => {
  const wallet = Keypair.generate();

  const publickey = wallet.publicKey.toBase58();
  const privatekey = wallet.secretKey;

  console.log(privatekey);

  return {
    publickey,
    privatekey,
  };
};
