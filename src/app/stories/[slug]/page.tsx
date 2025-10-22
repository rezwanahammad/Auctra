import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { stories, getStoryBySlug } from "@/data/stories";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story not found | Auctra",
    };
  }

  return {
    title: `${story.title} | Auctra Stories`,
    description: story.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = stories
    .filter((s) => s.category === story.category && s.slug !== story.slug)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Link
            href="/"
            className="hover:text-slate-900 dark:hover:text-slate-200"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/stories"
            className="hover:text-slate-900 dark:hover:text-slate-200"
          >
            Stories
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">
            {story.title}
          </span>
        </nav>
      </div>

      <article className="mx-auto max-w-4xl px-6 sm:px-8">
        <header className="mb-8">
          <div className="mb-4">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {story.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-slate-100">
            {story.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {story.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {story.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span>{story.author.name}</span>
            </div>
            <span>{formatDate(story.publishedAt)}</span>
            <span>{story.readingMinutes} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-8 h-64 sm:h-96 overflow-hidden rounded-2xl">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-slate-900 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-slate-100">
          {story.content?.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return <br key={index} />;

            if (paragraph.startsWith("# ")) {
              return (
                <h1
                  key={index}
                  className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100"
                >
                  {paragraph.substring(2)}
                </h1>
              );
            }

            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl font-semibold mt-6 mb-3 text-slate-900 dark:text-slate-100"
                >
                  {paragraph.substring(3)}
                </h2>
              );
            }

            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100"
                >
                  {paragraph.substring(4)}
                </h3>
              );
            }

            if (paragraph.startsWith("- **")) {
              const match = paragraph.match(/- \*\*(.*?)\*\*: (.*)/);
              if (match) {
                return (
                  <div key={index} className="my-2">
                    <strong className="text-slate-900 dark:text-slate-100">
                      {match[1]}
                    </strong>
                    : {match[2]}
                  </div>
                );
              }
            }

            if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
              return (
                <p
                  key={index}
                  className="italic text-slate-600 dark:text-slate-400 border-l-4 border-slate-200 dark:border-slate-700 pl-4 my-4"
                >
                  {paragraph.slice(1, -1)}
                </p>
              );
            }

            return (
              <p
                key={index}
                className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
          <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Related Stories
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {relatedStories.map((relatedStory) => (
              <article
                key={relatedStory.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="relative h-48">
                  <Image
                    src={relatedStory.coverImage}
                    alt={relatedStory.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
                    {relatedStory.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    {relatedStory.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {relatedStory.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {relatedStory.readingMinutes} min read
                    </span>
                    <Link
                      href={`/stories/${relatedStory.slug}`}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Back to Stories */}
      <div className="mx-auto max-w-4xl px-6 pb-16 sm:px-8">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Stories
        </Link>
      </div>
    </main>
  );
}
