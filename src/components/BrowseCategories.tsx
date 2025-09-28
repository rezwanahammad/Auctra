import Link from "next/link";
import Image from "next/image";

type Category = {
  name: string;
  slug: string;
  image: string;
};

const categories: Category[] = [
  { name: "Art", slug: "fine-art", image: "/images/fine-art.jpg" },
  { name: "Jewelry", slug: "jewelry", image: "/images/jewelry.webp" },
  { name: "Watches", slug: "watches", image: "/images/watches.jpg" },
  { name: "Furniture", slug: "furniture", image: "/images/furniture.jpg" },
  { name: "Antiques", slug: "antiques", image: "/images/antiques.jpeg" },
  { name: "Toys", slug: "toys", image: "/images/toys.jpg" },
];

export default function BrowseCategories() {
  return (
    <section className="py-12">
      {/* Title + View all link */}
      <div className="flex justify-between items-center px-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Browse by Category
        </h2>
        <Link
          href="/auctions"
          className="text-sm text-gray-500 hover:underline"
        >
          View all auctions →
        </Link>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <div className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={300}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-bold">
                  {category.name}
                </h3>
                <span className="text-sm text-gray-200">EXPLORE</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
