import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

export default function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="wallet-adapter-button-wrapper">
      <WalletMultiButton
        style={{
          background: connected 
            ? "linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))"
            : "rgba(255, 255, 255, 0.1)",
          borderRadius: "0.75rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "white",
          transition: "all 0.2s",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        startIcon={<Wallet size={16} />}
      >
        {connected && publicKey
          ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
          : "Connect Wallet"}
      </WalletMultiButton>
    </div>
  );
}

