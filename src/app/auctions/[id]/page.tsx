"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

interface AuctionDetail {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  endTime: string;
}

interface AuctionResponse {
  auction: AuctionDetail;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AuctionDetailPage() {
  const params = useParams<{ id?: string | string[] }>() ?? {};
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, error } = useSWR<AuctionResponse>(
    id ? `/api/auctions/${id}` : null,
    fetcher
  );

  if (!id) return <p>❌ Invalid auction id</p>;
  if (error) return <p>❌ Failed to load auction</p>;
  if (!data) return <p>⏳ Loading auction...</p>;

  const auction = data.auction;
  if (!auction) return <p>❌ Auction not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{auction.title}</h1>
      <p>{auction.description}</p>
      <p className="mt-2">Current Bid: ${auction.currentBid}</p>
      <p className="mt-2 text-sm text-gray-500">
        Ends: {new Date(auction.endTime).toLocaleString()}
      </p>

      <div className="mt-4">
        <input
          type="number"
          placeholder="Enter your bid"
          className="border px-3 py-2 rounded"
          id="bidAmount"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={async () => {
            const bidAmount = Number(
              (document.getElementById("bidAmount") as HTMLInputElement).value
            );
            const res = await fetch("/api/bids", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ auctionId: auction._id, bidAmount }),
            });
            const result = await res.json();
            alert(result.message || "Bid placed!");
          }}
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}
