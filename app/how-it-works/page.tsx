import Link from 'next/link';

export const metadata = {
  title: 'How it Works | ProposalPro',
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#06080F] text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-8 inline-block transition-colors">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          How <span className="text-indigo-500">ProposalPro</span> Works
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Stop wasting time on generic templates. Here is how our AI generates high-converting pitches in under 30 seconds.
        </p>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-8 transition-all hover:border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-lg">1</span>
              <h3 className="text-2xl font-semibold">Paste the Job Description</h3>
            </div>
            <p className="text-slate-400 leading-relaxed pl-14">
              Find a job you like on Upwork or Fiverr. Copy the entire job description and paste it into our tool. The AI reads this to understand the client's exact pain points and requirements.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-8 transition-all hover:border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-lg">2</span>
              <h3 className="text-2xl font-semibold">Add Your Unique Specifics</h3>
            </div>
            <p className="text-slate-400 leading-relaxed pl-14">
              Select your skills, set your rate, and most importantly: add a one-liner about your past experience (e.g., "Built a Next.js site, improved load time by 40%"). This locks in your uniqueness so the proposal doesn't sound like a generic AI.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-8 transition-all hover:border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-lg">3</span>
              <h3 className="text-2xl font-semibold">Generate & Tweak</h3>
            </div>
            <p className="text-slate-400 leading-relaxed pl-14">
              Hit generate. Our system avoids cliché phrases and targets the exact length proven to convert. Review the output in the "Edit before copy" box, make any quick personal tweaks, and hit Copy!
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-all">
            Try it now
          </Link>
        </div>
      </div>
    </div>
  );
}