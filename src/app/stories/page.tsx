import Link from "next/link";
import Image from "next/image";
import { stories, getFeaturedStories } from "@/data/stories";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StoriesPage() {
  const featuredStories = getFeaturedStories();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Stories
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-100">
            Insights from the auction world
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Discover the stories behind extraordinary finds, meet passionate
            collectors, and learn about the art and science of auctions.
          </p>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
          <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Featured Stories
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredStories.map((story) => (
              <article
                key={story.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="relative h-64 sm:h-80">
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
                    {story.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg font-semibold leading-tight sm:text-xl">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/80 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>{formatDate(story.publishedAt)}</span>
                      <span>{story.readingMinutes} min read</span>
                    </div>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                    >
                      Read story →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          All Stories
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="relative h-48">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
                  {story.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">
                  {story.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                  {story.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>{formatDate(story.publishedAt)}</span>
                    <span>{story.readingMinutes} min read</span>
                  </div>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                  >
                    Read →
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {story.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 lg:px-10">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-900">
          <h2 className="text-2xl font-semibold">
            Stay updated with our latest stories
          </h2>
          <p className="mt-2 text-white/80 dark:text-slate-600">
            Get insights, market updates, and behind-the-scenes content
            delivered to your inbox.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 backdrop-blur focus:border-white focus:outline-none focus:ring-1 focus:ring-white dark:border-slate-400 dark:bg-slate-100/20 dark:text-slate-900 dark:placeholder-slate-600"
            />
            <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
