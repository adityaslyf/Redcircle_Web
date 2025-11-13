import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

interface PriceChartProps {
  postId: string;
  currentPrice: number;
  initialPrice: number;
  tokenSymbol?: string;
  className?: string;
}

export default function PriceChart({
  postId,
  currentPrice,
  initialPrice,
  tokenSymbol = "TOKEN",
  className,
}: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1H" | "24H" | "7D" | "ALL">("24H");
  const [loading, setLoading] = useState(true);

  // Calculate price change
  const priceChange = currentPrice - initialPrice;
  const priceChangePercent = ((priceChange / initialPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  useEffect(() => {
    // Generate sample price data based on bonding curve
    // In production, this would fetch from your API
    const generateSampleData = () => {
      const now = Date.now();
      const dataPoints: PriceDataPoint[] = [];
      const numPoints = timeframe === "1H" ? 12 : timeframe === "24H" ? 24 : timeframe === "7D" ? 28 : 50;
      const timeInterval = 
        timeframe === "1H" ? 5 * 60 * 1000 : // 5 minutes
        timeframe === "24H" ? 60 * 60 * 1000 : // 1 hour
        timeframe === "7D" ? 6 * 60 * 60 * 1000 : // 6 hours
        24 * 60 * 60 * 1000; // 1 day

      for (let i = numPoints; i >= 0; i--) {
        const timestamp = now - i * timeInterval;
        // Simulate bonding curve price progression
        const progress = 1 - i / numPoints;
        const basePrice = initialPrice + (currentPrice - initialPrice) * progress;
        // Add some random variation
        const variance = basePrice * 0.05 * (Math.random() - 0.5);
        const price = Math.max(initialPrice * 0.8, basePrice + variance);
        const volume = Math.random() * 100;

        dataPoints.push({
          timestamp,
          price,
          volume,
        });
      }

      return dataPoints;
    };

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setPriceData(generateSampleData());
      setLoading(false);
    }, 500);
  }, [postId, timeframe, initialPrice, currentPrice]);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === "1H") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (timeframe === "24H") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit" });
    } else if (timeframe === "7D") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl">
          <p className="mb-2 text-xs text-white/60">
            {new Date(data.timestamp).toLocaleString()}
          </p>
          <p className="text-lg font-bold text-white">
            {data.price.toFixed(6)} SOL
          </p>
          <p className="text-sm text-white/60">Volume: {data.volume.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{tokenSymbol} Price</h3>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-white">
              {currentPrice.toFixed(6)} SOL
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {isPositive ? "+" : ""}
              {priceChangePercent}%
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {(["1H", "24H", "7D", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                timeframe === tf
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Activity className="h-8 w-8 animate-pulse text-white/40" />
            <p className="text-sm text-white/60">Loading chart data...</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toFixed(4)}
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fill="url(#priceGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Volume Chart */}
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-semibold text-white/70">Volume</h4>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8b5cf6"
                  strokeWidth={1}
                  fill="url(#volumeGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}


