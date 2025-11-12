import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, TrendingDown, Wallet, ArrowRightLeft } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FeedPost } from "@/components/FeedCard";
import { cn } from "@/lib/utils";

type TradeType = "buy" | "sell";

type TradingModalProps = {
  post: FeedPost;
  isOpen: boolean;
  onClose: () => void;
};

export default function TradingModal({ post, isOpen, onClose }: TradingModalProps) {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate trade preview
  const tradePreview = useMemo(() => {
    const tokenAmount = parseFloat(amount) || 0;
    const tokenPrice = post.tokenPrice || 0;
    const totalCost = tokenAmount * tokenPrice;
    
    // Simple 0.5% trading fee
    const fee = totalCost * 0.005;
    const finalTotal = totalCost + fee;

    return {
      tokenAmount,
      tokenPrice,
      totalCost,
      fee,
      finalTotal,
    };
  }, [amount, post.tokenPrice]);

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleTrade = async () => {
    if (!connected) {
      handleConnectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual trading logic with Solana blockchain
      // This would involve:
      // 1. Create transaction to interact with token program
      // 2. Sign transaction with wallet
      // 3. Send transaction to Solana network
      // 4. Wait for confirmation
      // 5. Update backend with trade details
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      alert(
        `🎉 ${tradeType === "buy" ? "Purchase" : "Sale"} Successful!\n\n` +
        `${tradePreview.tokenAmount} tokens ${tradeType === "buy" ? "bought" : "sold"}\n` +
        `Total: ${tradePreview.finalTotal.toFixed(4)} SOL\n` +
        `Wallet: ${publicKey?.toBase58().slice(0, 8)}...\n\n` +
        `Note: This is a demo. Actual blockchain transaction coming soon.`
      );
      
      onClose();
      setAmount("");
    } catch (error) {
      console.error("Trade error:", error);
      alert("Trade failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-black/95 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background gradient */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(600px circle at 50% 0%, rgba(147,51,234,0.15), transparent), radial-gradient(600px circle at 0% 100%, rgba(59,130,246,0.15), transparent)",
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative p-6">
                {/* Header */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl border border-white/20 bg-white/5 p-2.5">
                      <ArrowRightLeft className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Trade Token</h2>
                      <p className="text-sm text-white/60">
                        {post.tokenPrice ? `${post.tokenPrice.toFixed(3)} SOL` : "Price N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Post info */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span>r/{post.subreddit}</span>
                      <span>•</span>
                      <span>u/{post.author}</span>
                    </div>
                    {post.marketCap && (
                      <div className="mt-2 flex gap-4 text-xs text-white/50">
                        <span>MC: {post.marketCap.toLocaleString()} SOL</span>
                        {post.volume24h && (
                          <span>Vol: {post.volume24h.toLocaleString()} SOL</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Buy/Sell Toggle */}
                <div className="mb-6">
                  <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setTradeType("buy")}
                      className={cn(
                        "flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
                        tradeType === "buy"
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white shadow-lg shadow-green-500/10 border border-green-500/30"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      <TrendingUp className="mx-auto mb-1 h-5 w-5" />
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType("sell")}
                      className={cn(
                        "flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
                        tradeType === "sell"
                          ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white shadow-lg shadow-red-500/10 border border-red-500/30"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      <TrendingDown className="mx-auto mb-1 h-5 w-5" />
                      Sell
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6 space-y-3">
                  <label className="text-sm font-medium text-white/80">
                    Token Amount
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-14 rounded-xl border-white/20 bg-white/5 pr-20 text-lg text-white placeholder:text-white/30"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={() => setAmount("100")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20"
                    >
                      MAX
                    </button>
                  </div>
                  
                  {/* Quick amount buttons */}
                  <div className="flex gap-2">
                    {[10, 50, 100, 500].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value.toString())}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/70 hover:bg-white/10"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trade Preview */}
                {amount && parseFloat(amount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <h4 className="mb-3 text-sm font-semibold text-white/80">
                      Order Summary
                    </h4>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Token Amount</span>
                      <span className="text-white">{tradePreview.tokenAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Price per Token</span>
                      <span className="text-white">{tradePreview.tokenPrice.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Subtotal</span>
                      <span className="text-white">{tradePreview.totalCost.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Trading Fee (0.5%)</span>
                      <span className="text-white">{tradePreview.fee.toFixed(4)} SOL</span>
                    </div>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-white/80">Total</span>
                        <span className="text-white">{tradePreview.finalTotal.toFixed(4)} SOL</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Wallet Info Banner */}
                {connected ? (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3">
                    <Wallet className="h-5 w-5 text-green-400" />
                    <div className="flex-1 text-xs text-white/70">
                      <span className="font-medium text-green-400">Wallet connected:</span>{" "}
                      {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
                    <Wallet className="h-5 w-5 text-yellow-400" />
                    <div className="flex-1 text-xs text-white/70">
                      <span className="font-medium text-yellow-400">Wallet not connected.</span> Click the button below to connect.
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTrade}
                    disabled={(!connected && !isSubmitting) || (connected && (!amount || parseFloat(amount) <= 0 || isSubmitting))}
                    className={cn(
                      "flex-1 rounded-xl font-semibold text-white shadow-lg",
                      !connected
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-purple-500/30"
                        : tradeType === "buy"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30"
                        : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-500/30"
                    )}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : !connected ? (
                      <>Connect Wallet</>
                    ) : (
                      <>
                        {tradeType === "buy" ? "Buy" : "Sell"} Tokens
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

