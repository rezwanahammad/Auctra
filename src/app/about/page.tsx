"use client";

import {
  ArrowRight,
  Award,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 mt-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-12 top-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute right-0 top-36 hidden h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:block" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-4xl space-y-6">
            {/* <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <Award className="h-4 w-4" />
              Trusted Auction Platform Since 2024
            </div> */}

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-5xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Auctra
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 sm:text-2xl leading-relaxed">
              The world&apos;s premier online auction house, connecting
              collectors, dealers, and enthusiasts with exceptional fine art,
              antiques, jewelry, and collectibles from around the globe.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* <Link
                href="/auctions"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Explore Auctions <ArrowRight className="h-4 w-4" />
              </Link> */}
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  At Auctra, we bring the great auction into the hands of the
                  people, democratizing the world of collectibles and fine art.
                  We aim to create a safe, open, and thrilling platform where
                  passion and opportunity meet, and any collector can discover
                  their next gem
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  To become the global leader in online auctions where art,
                  culture, and commerce intersect while preserving the heritage
                  and stories behind every piece.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-auction.png"
                alt="Auctra auction gallery"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How Auctra Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From discovery to ownership, we&apos;ve streamlined the auction
              process to be simple, transparent, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                description:
                  "Explore our carefully curated collections across multiple categories. Use our advanced search and filters to find exactly what you're looking for.",
              },
              {
                step: "02",
                title: "Research & Bid",
                description:
                  "Review detailed condition reports, provenance information, and high-resolution images. Place your bids confidently with our real-time auction system.",
              },
              {
                step: "03",
                title: "Win & Collect",
                description:
                  "Celebrate your successful bids! We handle secure payment processing and can arrange professional shipping or pickup for your new acquisitions.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Auctra?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We combine cutting-edge technology with traditional auction
              expertise to provide an unparalleled experience for collectors
              worldwide.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Secure & Trusted",
                description:
                  "Advanced security measures, verified authenticity, and secure payment processing protect every transaction.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description:
                  "Connect with sellers and buyers worldwide. Access auctions from prestigious houses across continents.",
              },
              {
                icon: Users,
                title: "Expert Curation",
                description:
                  "Our team of specialists carefully selects and authenticates every lot, ensuring quality and provenance.",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Bidding",
                description:
                  "Experience the thrill of live auctions with our real-time bidding system and instant notifications.",
              },
              {
                icon: Heart,
                title: "Passionate Community",
                description:
                  "Join thousands of collectors, dealers, and enthusiasts who share your passion for exceptional pieces.",
              },
              {
                icon: Star,
                title: "Premium Service",
                description:
                  "Dedicated support, detailed condition reports, and white-glove shipping for high-value items.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Values & Commitment */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our Commitment to Excellence
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Authenticity Guaranteed",
                    description:
                      "Every item undergoes rigorous authentication by our expert team and trusted partners.",
                  },
                  {
                    title: "Transparent Processes",
                    description:
                      "Clear condition reports, detailed provenance, and honest descriptions for every lot.",
                  },
                  {
                    title: "Fair Market Values",
                    description:
                      "Conservative estimates and transparent bidding ensure fair market pricing.",
                  },
                  {
                    title: "Worldwide Accessibility",
                    description:
                      "24/7 online access with multilingual support and international shipping options.",
                  },
                ].map((commitment, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {commitment.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {commitment.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-semibold mb-4">
                  Ready to Start Collecting?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Join thousands of collectors who trust Auctra for their most
                  important acquisitions. Create your account today and start
                  exploring our upcoming auctions.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/auth/register"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Create Your Account <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/auctions"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
                  >
                    Browse Current Auctions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
