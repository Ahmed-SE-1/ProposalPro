import Link from 'next/link';

export const metadata = {
  title: 'Winning Tips | ProposalPro',
};

export default function Tips() {
  return (
    <div className="min-h-screen bg-[#06080F] text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-8 inline-block transition-colors">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Pro Tips to <span className="text-indigo-500">Win Jobs</span>
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          A great proposal is just one piece of the puzzle. Here is what the data says actually gets clients to reply.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tip 1 */}
          <div className="bg-[#0D1220] p-6 rounded-2xl border border-white/10">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Speed is Everything</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Submit your proposal within the first 60 minutes of the job being posted. Clients usually hire from the first batch of applicants they see.
            </p>
          </div>

          {/* Tip 2 */}
          <div className="bg-[#0D1220] p-6 rounded-2xl border border-white/10">
            <div className="text-3xl mb-4">📏</div>
            <h3 className="text-xl font-semibold mb-2">The Bimodal Rule</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Avoid the "dead middle" of 100-200 words. Stick to Short Punchy (50-90 words) for quick gigs, or Deep Specific (300-400 words) for complex enterprise jobs.
            </p>
          </div>

          {/* Tip 3 */}
          <div className="bg-[#0D1220] p-6 rounded-2xl border border-white/10">
            <div className="text-3xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold mb-2">Kill the Clichés</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Never start with "Dear Sir" or "I am writing to apply". Start directly by mentioning their problem or a specific detail from their job post.
            </p>
          </div>

          {/* Tip 4 */}
          <div className="bg-[#0D1220] p-6 rounded-2xl border border-white/10">
            <div className="text-3xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Offer a Loom Video</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Offering to record a quick 1-minute Loom video walking through your approach builds massive trust and proves you are a real expert, not just a bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}