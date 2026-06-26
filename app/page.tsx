"use client";

import { useState, useEffect, useRef } from "react";
import ProposalForm from "@/components/ProposalForm";
import CoverLetterForm from "@/components/CoverLetterForm";
import EmailForm from "@/components/EmailForm";

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = "proposal" | "cover-letter" | "email";

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  badge: string;
  description: string;
}

// ── Icons (inline SVG to avoid extra deps) ────────────────────────────────────
const IconProposal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconCoverLetter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ── Tab configuration ─────────────────────────────────────────────────────────
const TABS: TabConfig[] = [
  {
    id: "proposal",
    label: "Proposal",
    icon: <IconProposal />,
    badge: "Upwork · Fiverr",
    description: "Win more clients with data-backed proposals",
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: <IconCoverLetter />,
    badge: "Job Applications",
    description: "Stand out from hundreds of applicants",
  },
  {
    id: "email",
    label: "Email",
    icon: <IconEmail />,
    badge: "Outreach",
    description: "Cold emails that actually get replies",
  },
];

const STATS = [
  { value: "3x", label: "Higher reply rate", icon: <IconStar /> },
  { value: "< 30s", label: "Generation time", icon: <IconZap /> },
  { value: "PKR Free", label: "No hidden costs", icon: <IconShield /> },
];

function useTypewriter(phrases: string[], speed = 60, pause = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % phrases.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return displayed;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("proposal");
  const [prevTab, setPrevTab] = useState<Tab | null>(null);
  const [animating, setAnimating] = useState(false);
  
  // 🎯 New state for proposal length control
  const [targetRange, setTargetRange] = useState<"short" | "long">("short");
  
  const contentRef = useRef<HTMLDivElement>(null);

  const typewritten = useTypewriter([
    "Upwork proposals that convert.",
    "Cover letters that open doors.",
    "Cold emails that get replies.",
    "Your freelance edge — automated.",
  ]);

  function switchTab(tab: Tab) {
    if (tab === activeTab || animating) return;
    setAnimating(true);
    setPrevTab(activeTab);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 220);
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white">

      {/* ── Ambient background glows ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
        />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="relative z-20 border-b border-white/[0.06] bg-[#070B14]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Proposal<span className="text-indigo-400">Pro</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Tips</a>
            <a
              href="https://upwork.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Open Upwork ↗
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Powered by Gemini 2.5 Flash + Groq Llama 4
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Win freelance work with
          <br />
          <span className="relative inline-block mt-1">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #818CF8 0%, #6366F1 40%, #A78BFA 100%)",
              }}
            >
              {typewritten}
            </span>
            <span
              className="inline-block w-[3px] h-[0.9em] bg-indigo-400 ml-1 align-middle animate-[blink_1s_step-end_infinite] rounded-sm"
              aria-hidden
            />
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
          Built for Pakistani freelancers. Paste a job description, fill in your skills — 
          get a high-converting pitch in under 30 seconds.
        </p>

        <div className="inline-flex flex-wrap justify-center gap-6 sm:gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-amber-400">{s.icon}</span>
              <div className="text-left">
                <div className="text-sm font-bold text-white leading-none">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Main tool area ────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-24">

        {/* ── Tab bar wrapper with alignment controls ─────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          
          {/* Tab buttons */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0D1220] border border-white/[0.07] w-fit">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    ${isActive ? "text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}
                  `}
                  aria-selected={isActive}
                  role="tab"
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                        boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                      }}
                      aria-hidden
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                    {isActive && (
                      <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-normal">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 🎯 Length Dropdown - Only visible when "proposal" is active */}
          {activeTab === "proposal" && (
            <div className="animate-fadeIn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1220] border border-white/[0.07]">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap pl-1">Length:</span>
              <select
                value={targetRange}
                onChange={(e) => setTargetRange(e.target.value as "short" | "long")}
                className="bg-transparent text-xs font-semibold text-indigo-400 outline-none cursor-pointer pr-2 border-none focus:ring-0"
              >
                <option value="short" className="bg-[#070B14] text-white">Short (80-99 words)</option>
                <option value="long" className="bg-[#070B14] text-white">Long (130-150 words)</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Tab description strip ──────────────────────────────────── */}
        <div className="mb-6 h-5">
          {TABS.map((tab) =>
            activeTab === tab.id ? (
              <p key={tab.id} className="text-sm text-slate-500 animate-fadeIn">
                {tab.description}
              </p>
            ) : null
          )}
        </div>

        {/* ── Form + output two-column layout ───────────────────────── */}
        <div
          ref={contentRef}
          className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
        >
          {/* 💡 FIX: Passed targetRange as a prop down to ProposalForm */}
          {activeTab === "proposal" && <ProposalForm targetRange={targetRange} />}
          {activeTab === "cover-letter" && <CoverLetterForm />}
          {activeTab === "email" && <EmailForm />}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-xs">
          <span>
            © {new Date().getFullYear()} ProposalPro — Built for 🇵🇰 freelancers
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}