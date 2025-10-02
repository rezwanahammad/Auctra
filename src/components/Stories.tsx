import Link from "next/link";
import Image from "next/image";

// Sample stories data - you can move this to a separate data file later
const stories = [
  {
    id: "1",
    slug: "renaissance-panel",
    title: "The Renaissance panel that tripled its estimate",
    excerpt:
      "How expert authentication and provenance research turned a forgotten piece into the highlight of our spring auction.",
    category: "Market Insight",
    coverImage: "/images/fine-art.jpg",
    readingMinutes: 5,
  },
  {
    id: "2",
    slug: "collector-journey",
    title: "From inheritance to investment: A collector's journey",
    excerpt:
      "Meet Robert Chen, who transformed his grandfather's modest collection into a curated portfolio of contemporary art.",
    category: "Collector Profile",
    coverImage: "/images/jewelry.webp",
    readingMinutes: 3,
  },
  {
    id: "3",
    slug: "authentication-process",
    title: "The authentication process: From submission to sale",
    excerpt:
      "Take a behind-the-scenes look at how our experts verify authenticity and determine estimates for consigned works.",
    category: "Behind the Scenes",
    coverImage: "/images/watches.jpg",
    readingMinutes: 4,
  },
];

export default function Stories() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Stories
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-900 dark:text-slate-100">
          Insights from the auction world
        </h2>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Featured Story */}
        <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
          <div className="relative h-64 sm:h-80">
            <Image
              src={stories[0].coverImage}
              alt={stories[0].title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
              {stories[0].category}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-lg font-semibold leading-tight sm:text-xl">
              {stories[0].title}
            </h3>
            <p className="mt-2 text-sm text-white/80 line-clamp-2">
              {stories[0].excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-white/60">
                {stories[0].readingMinutes} min read
              </span>
              <Link
                href={`/stories/${stories[0].slug}`}
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Read story →
              </Link>
            </div>
          </div>
        </article>

        {/* Side Stories */}
        <div className="space-y-6">
          {stories.slice(1).map((story) => (
            <article key={story.id} className="group">
              <div className="relative h-32 overflow-hidden rounded-xl">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {story.category}
                </span>
                <h4 className="mt-1 text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
                  {story.title}
                </h4>
                <Link
                  href={`/stories/${story.slug}`}
                  className="mt-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {story.readingMinutes} min read →
                </Link>
              </div>
            </article>
          ))}

          <div className="pt-2">
            <Link
              href="/stories"
              className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              View all stories
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
