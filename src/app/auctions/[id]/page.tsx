"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface AuctionImage {
  url: string;
  alt?: string;
}

interface AuctionDetail {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  reservePrice?: number;
  endTime?: string;
  images?: AuctionImage[];
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

  if (!id) return <p className="p-6">❌ Invalid auction id</p>;
  if (error) return <p className="p-6">❌ Failed to load auction</p>;
  if (!data) return <p className="p-6">⏳ Loading auction...</p>;

  const auction = data.auction;
  if (!auction) return <p className="p-6">❌ Auction not found</p>;

  const primaryImage =
    auction.images?.find((image) => image.url)?.url || "/images/hero-auction.png";
  const formattedEndTime = auction.endTime
    ? new Date(auction.endTime).toLocaleString()
    : "Unknown";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{auction.title}</h1>
      <p>{auction.description}</p>
      <p className="mt-2">Current Bid: ${auction.currentBid}</p>
      <p className="mt-2 text-sm text-gray-500">
        Starting Price: ${auction.startingPrice}
      </p>
      {auction.reservePrice && (
        <p className="mt-2 text-sm text-gray-500">
          Reserve Price: ${auction.reservePrice}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500">
        Ends: {formattedEndTime}
      </p>

      <div className="mt-4">
        <Image
          src={primaryImage}
          alt={auction.title}
          width={800}
          height={450}
          className="w-full max-h-[450px] rounded-lg object-cover"
          unoptimized
        />
      </div>

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
