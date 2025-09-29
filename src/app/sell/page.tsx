"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  startingPrice: string;
  reservePrice: string;
  minIncrement: string;
  startTime: string;
  endTime: string;
  images: string[];
};

type Message = {
  type: "success" | "error";
  text: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  categoryId: "",
  startingPrice: "",
  reservePrice: "",
  minIncrement: "5",
  startTime: "",
  endTime: "",
  images: [""],
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const isSeller = session?.user?.role === "seller";

  useEffect(() => {
    if (!isSeller) return;

    const controller = new AbortController();
    fetch("/api/categories", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load categories");
        return response.json();
      })
      .then((data) => {
        setCategories(data.categories ?? []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
          setMessage({ type: "error", text: "Unable to load categories" });
        }
      });

    return () => controller.abort();
  }, [isSeller]);

  useEffect(() => {
    if (!form.categoryId && categories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const nextImages = prev.images.slice();
      nextImages[index] = value;
      return { ...prev, images: nextImages };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setMessage({ type: "success", text: "Auction created successfully" });
    router.refresh();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSeller) return;

    const startingPrice = Number(form.startingPrice);
    const minIncrement = Number(form.minIncrement || "1");
    const reservePrice = form.reservePrice
      ? Number(form.reservePrice)
      : undefined;

    if (Number.isNaN(startingPrice) || startingPrice <= 0) {
      setMessage({
        type: "error",
        text: "Please provide a valid starting price",
      });
      return;
    }

    if (minIncrement < 1) {
      setMessage({
        type: "error",
        text: "Minimum increment (BDT) must be at least 1",
      });
      return;
    }

    if (!form.endTime) {
      setMessage({ type: "error", text: "Please select an end time" });
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      startingPrice,
      reservePrice,
      minIncrement,
      startTime: form.startTime
        ? new Date(form.startTime).toISOString()
        : undefined,
      endTime: new Date(form.endTime).toISOString(),
      images: form.images
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url, index) => ({
          url,
          alt: form.title || `Image ${index + 1}`,
        })),
    };

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to create auction");
      }

      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to submit auction",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const headerMessage = useMemo(() => {
    if (status === "loading") return "Checking your session…";
    if (!session) return "You need to sign in as a seller to list auctions.";
    if (!isSeller)
      return "Only verified sellers can access the consignment dashboard.";
    return null;
  }, [session, status, isSeller]);

  if (!session || !isSeller) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center text-slate-600 dark:text-slate-300">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Seller access required
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6">
          {headerMessage ??
            "Sign in with a seller account to manage your catalogues."}
        </p>
        <LinkButton href={status === "authenticated" ? "/" : "/auth/signin"}>
          {status === "authenticated" ? "Return home" : "Sign in"}
        </LinkButton>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Create a new auction
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Upload assets from your collection and schedule them for immediate
          exposure to vetted bidders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {message && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Title
            <input
              required
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
            <select
              required
              value={form.categoryId}
              onChange={(event) =>
                handleChange("categoryId", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              {categories.length === 0 && <option value="">Loading…</option>}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Starting price (Tk)
            <input
              required
              type="number"
              min="1"
              value={form.startingPrice}
              onChange={(event) =>
                handleChange("startingPrice", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Reserve price (optional, BDT)
            <input
              type="number"
              min="0"
              value={form.reservePrice}
              onChange={(event) =>
                handleChange("reservePrice", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Minimum increment (BDT)
            <input
              type="number"
              min="1"
              value={form.minIncrement}
              onChange={(event) =>
                handleChange("minIncrement", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Start time (optional)
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(event) =>
                handleChange("startTime", event.target.value)
              }
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            End time
            <input
              required
              type="datetime-local"
              value={form.endTime}
              onChange={(event) => handleChange("endTime", event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Image URLs
          </p>
          <div className="space-y-3">
            {form.images.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={url}
                  onChange={(event) =>
                    handleImageChange(index, event.target.value)
                  }
                  placeholder="https://"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:border-red-200 hover:bg-red-50 dark:hover:border-red-400 dark:hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addImageField}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
          >
            Add another image
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
          >
            {submitting ? "Publishing…" : "Publish auction"}
          </button>
        </div>
      </form>
    </main>
  );
}

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
    >
      {children}
    </a>
  );
}

