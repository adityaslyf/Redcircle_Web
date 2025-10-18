import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LaunchPanel() {
  const [url, setUrl] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Placeholder: wire to backend later
      await new Promise((r) => setTimeout(r, 800));
      alert("Post submitted for tokenization (mock)");
      setUrl("");
      setSubreddit("");
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-lg font-semibold text-white sm:text-xl"
      >
        Launch a Post
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-white/80 backdrop-blur">
          <label className="mb-2 block text-sm text-white/70">Reddit Post URL</label>
          <input
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://reddit.com/r/subreddit/comments/..."
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-white/80 backdrop-blur">
            <label className="mb-2 block text-sm text-white/70">Subreddit</label>
            <input
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="e.g. CryptoCurrency"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-white/80 backdrop-blur">
            <label className="mb-2 block text-sm text-white/70">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Override title for token page"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isSubmitting} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-white hover:bg-white/15">
            {isSubmitting ? "Submitting..." : "Launch"}
          </Button>
        </div>
      </form>
    </section>
  );
}


