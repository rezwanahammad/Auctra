"use client";

import useSWR from "swr";

interface AuctionListItem {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AuctionsPage() {
  const { data, error } = useSWR<{ auctions: AuctionListItem[] }>(
    "/api/auctions",
    fetcher,
  );

  if (error) return <p>❌ Failed to load auctions</p>;
  if (!data) return <p>⏳ Loading auctions...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.auctions.map((auction) => (
          <div key={auction._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{auction.title}</h2>
            <p>{auction.description}</p>
            <p className="text-sm text-gray-500">
              Current Bid: ${auction.currentBid}
            </p>
            <a
              href={`/auctions/${auction._id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
