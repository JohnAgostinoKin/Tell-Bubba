import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareText, Send, ClipboardCheck, Star, Building2, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Mail, Megaphone, FileText, Clock3 } from "lucide-react";

const examples = [
  "Refund request",
  "Subscription cancellation",
  "Damaged product",
  "Bad service experience",
  "Billing issue",
  "Warranty problem",
  "Delivery problem",
  "Constructive feedback",
];

const caseTypes = [
  {
    title: "Fix a Problem",
    description: "Refunds, cancellations, overcharges, broken products, bad service, warranty issues, and unresolved support problems.",
    icon: ClipboardCheck,
  },
  {
    title: "Send Feedback",
    description: "Not really a full complaint? Bubba helps turn suggestions, compliments, and small frustrations into useful feedback.",
    icon: Megaphone,
  },
  {
    title: "Create a Case File",
    description: "Bubba organizes what happened, what proof you have, what you want, and what should happen next.",
    icon: FileText,
  },
];

const steps = [
  {
    title: "Tell Bubba what happened",
    text: "Vent naturally. Bubba pulls out the facts, dates, order numbers, names, receipts, and what you want fixed.",
    icon: MessageSquareText,
  },
  {
    title: "Bubba writes the message",
    text: "Your frustration becomes a calm, clear, professional complaint or feedback note a company can actually act on.",
    icon: Sparkles,
  },
  {
    title: "You approve before anything sends",
    text: "Bubba never sends without your approval. You confirm the facts and authorize Bubba to send it on your behalf.",
    icon: ShieldCheck,
  },
  {
    title: "Bubba follows up",
    text: "Track replies, deadlines, next steps, and escalation options so the issue does not disappear into a support inbox.",
    icon: Clock3,
  },
];

function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <section className="relative px-6 pt-8 pb-20 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,.25),_transparent_32%),radial-gradient(circle_at_70%_20%,_rgba(59,130,246,.22),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 font-black text-slate-950 shadow-lg shadow-orange-500/20">B</div>
              <div>
                <p className="text-xl font-black tracking-tight">Tell Bubba</p>
                <p className="text-xs text-slate-300">at BubbaFix.com</p>
              </div>
            </div>
            <div className="ml-auto mr-6 hidden items-center justify-end gap-8 text-sm font-semibold text-slate-200 md:flex">
              <a href="#how" className="hover:text-orange-300">How it Works</a>
              <a href="#feedback" className="hover:text-orange-300">Feedback</a>
              <a href="#business" className="hover:text-orange-300">For Companies</a>
            </div>
            <a href="#early" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-orange-200">Early Access</a>
          </nav>

          <div className="grid items-center gap-12 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100">
                <Sparkles size={16} /> Before frustration sets in. Tell Bubba.
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-tight sm:text-6xl lg:text-7xl">
                Tell Bubba What Happened
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                Bubba turns complaints, problems, and customer feedback into clear messages companies can actually act on — then sends them with your approval and helps follow up.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#early" className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-base font-black text-slate-950 shadow-xl shadow-orange-500/20 transition hover:bg-orange-400">
                  Join Early Access <ArrowRight className="transition group-hover:translate-x-1" size={19} />
                </a>
                <a href="#how" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/15">
                  See How Bubba Works
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {examples.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{item}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-slate-950 p-5">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500 text-slate-950"><MessageSquareText size={22} /></div>
                    <div>
                      <p className="font-black">Bubba Case File</p>
                      <p className="text-sm text-slate-400">Complaint or feedback, organized.</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Customer said</p>
                    <p className="mt-2 text-slate-200">“I cancelled my subscription last month, but I was charged again. Support keeps sending me in circles.”</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-blue-500/10 p-4 ring-1 ring-blue-300/15">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Issue</p>
                      <p className="mt-1 font-semibold">Billing after cancellation</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-emerald-300/15">
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Goal</p>
                      <p className="mt-1 font-semibold">Refund + confirmation</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Bubba drafts</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">I’m requesting a refund for the charge made after cancellation and written confirmation that my account is closed...</p>
                  </div>
                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-slate-950">
                    Approve & Send with Bubba <Send size={18} />
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-400">Bubba never sends without your approval.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">How it works</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">From Rant to Resolution.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">Bubba does the annoying part: organizing the issue, writing the message, finding the right route, and keeping the case moving.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-white/[.04] p-6 shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/15 text-orange-300"><Icon size={23} /></div>
                    <span className="text-3xl font-black text-white/10">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="feedback" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-400">Not a full complaint?</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Send feedback instead.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Sometimes you are not angry. You just want a company to know what happened, what could be better, or what almost made you leave. Bubba helps make that feedback clear, useful, and easy to send.</p>
              <div className="mt-7 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-5">
                <p className="font-black text-orange-100">Company value:</p>
                <p className="mt-2 leading-7 text-slate-200">Tell Bubba gives businesses a chance to spot problems before they turn into churn, chargebacks, or public bad reviews.</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
              {caseTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.title} className="rounded-[1.5rem] border border-white/10 bg-white/[.05] p-6">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-orange-300"><Icon size={23} /></div>
                      <div>
                        <h3 className="text-xl font-black">{type.title}</h3>
                        <p className="mt-2 leading-7 text-slate-300">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="business" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">For companies</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Save the customer before you lose them.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">Tell Bubba can become a private early-warning system for companies: real complaints, useful feedback, clear case files, and customers who still want to be heard.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Fewer surprise bad reviews", "Cleaner customer feedback", "Better recovery opportunities", "Insight into repeat issues"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-4 ring-1 ring-white/10">
                  <CheckCircle2 className="text-emerald-300" size={21} />
                  <span className="font-semibold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-blue-200"><Building2 size={28} /></div>
              <div>
                <p className="text-2xl font-black">Business dashboard preview</p>
                <p className="text-slate-400">Future paid feature</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-950/70 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-black">New customer signals</p>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-slate-950">18 this week</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">7 mentioned slow response times</div>
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">5 requested billing help</div>
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">3 almost left bad reviews</div>
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-5 ring-1 ring-emerald-300/15">
                <div className="flex items-center gap-3"><Star className="text-emerald-300" size={22} /><p className="font-black">Goal: recover customers privately</p></div>
                <p className="mt-2 text-sm leading-6 text-slate-300">Give companies a fair chance to make it right before the customer disappears or posts publicly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="early" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-orange-300/20 bg-orange-500 p-8 text-center text-slate-950 shadow-2xl shadow-orange-500/20 sm:p-12">
          <p className="text-sm font-black uppercase tracking-widest">Early access</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Be first to Tell Bubba.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 font-semibold text-slate-900/80">Join the early list for customers, businesses, and testers who want a smarter way to handle complaints and feedback.</p>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="h-14 w-full rounded-full border-0 bg-white pl-12 pr-5 font-semibold text-slate-950 outline-none ring-2 ring-transparent transition focus:ring-slate-950" />
            </div>
            <button className="h-14 rounded-full bg-slate-950 px-7 font-black text-white transition hover:bg-slate-800">Join</button>
          </form>
          {submitted && <p className="mt-4 font-black">You’re on the list. Bubba’s got you.</p>}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p><span className="font-black text-white">Tell Bubba</span> at BubbaFix.com</p>
          <p>Bubba is not a law firm. Messages send only with user approval.</p>
        </div>
      </footer>
    </main>
  );
}

export default App;
