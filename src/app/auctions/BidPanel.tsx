import React from "react";

type BidPanelProps = {
  auctionId: string;
  currentBid: number;
  startingPrice: number;
  minIncrement: number;
  status: string;
  endTime?: string;
};

const BidPanel: React.FC<BidPanelProps> = ({
  auctionId,
  currentBid,
  startingPrice,
  minIncrement,
  status,
  endTime,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold mb-2">Place a Bid</h3>
      <p>
        Current Bid: <span className="font-bold">{currentBid}</span>
      </p>
      <p>
        Minimum Increment: <span className="font-bold">{minIncrement}</span>
      </p>
      {/* Add your bid form or logic here */}
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
        disabled={status !== "active"}
      >
        Place Bid
      </button>
      {status !== "active" && (
        <p className="mt-2 text-sm text-red-500">Bidding is not active.</p>
      )}
    </div>
  );
};

export default BidPanel;
