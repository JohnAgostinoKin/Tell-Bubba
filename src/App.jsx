import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "@formspree/react";
import {
  MessageSquareText,
  Send,
  ClipboardCheck,
  Star,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Mail,
  Megaphone,
  FileText,
  Clock3,
  Search,
  RefreshCw,
  ThumbsUp,
  AlertTriangle,
  Scale,
  Lock,
  HelpCircle,
  X,
} from "lucide-react";

const examples = [
  "Refund Request",
  "Subscription Cancellation",
  "Damaged Product",
  "Bad Service Experience",
  "Billing Issue",
  "Warranty Problem",
  "Delivery Problem",
  "Constructive Feedback",
];

const caseTypes = [
  {
    title: "Fix a Problem",
    description:
      "Refunds, cancellations, overcharges, broken products, bad service, warranty issues, and unresolved support problems.",
    icon: ClipboardCheck,
  },
  {
    title: "Send Feedback",
    description:
      "Not really a full complaint? Bubba helps turn suggestions, compliments, and small frustrations into useful feedback.",
    icon: Megaphone,
  },
  {
    title: "Create a Case File",
    description:
      "Bubba organizes what happened, what proof you have, what you want, and what should happen next.",
    icon: FileText,
  },
];

const steps = [
  {
    title: "Tell Bubba What Happened",
    text: "Vent naturally. Bubba pulls out the facts, dates, order numbers, names, receipts, and what you want fixed.",
    icon: MessageSquareText,
  },
  {
    title: "Bubba Writes the Message",
    text: "Your frustration becomes a calm, clear, professional complaint or feedback note a company can actually act on.",
    icon: FileText,
  },
  {
    title: "You Approve Before Anything Sends",
    text: "Bubba never sends without your approval. You confirm the facts and authorize Bubba to send it on your behalf.",
    icon: ShieldCheck,
  },
  {
    title: "Bubba Follows Up",
    text: "Track replies, deadlines, next steps, and escalation options so the issue does not disappear into a support inbox.",
    icon: Clock3,
  },
];

const featureCards = [
  {
    title: "Vent Mode",
    text: "Tell Bubba the messy version. Bubba turns emotion, frustration, and scattered details into a clean starting point.",
    icon: MessageSquareText,
  },
  {
    title: "Bubba Case File",
    text: "A clear summary of the issue, desired outcome, timeline, evidence, company details, and next best step.",
    icon: FileText,
  },
  {
    title: "Smart Contact Routing",
    text: "Bubba helps identify the right place to send the message: support, billing, corporate, feedback, or escalation.",
    icon: Search,
  },
  {
    title: "Approve & Send",
    text: "Bubba drafts the message, but you stay in control. Nothing sends until you review and approve it.",
    icon: Send,
  },
  {
    title: "Follow-Up Tracker",
    text: "Bubba helps track replies, deadlines, reminders, follow-ups, and escalation options.",
    icon: RefreshCw,
  },
  {
    title: "Feedback Instead",
    text: "Not every issue is a complaint. Send constructive feedback, suggestions, compliments, or warnings before they become problems.",
    icon: ThumbsUp,
  },
];

const canHandle = [
  "Refunds",
  "Cancellations",
  "Overcharges",
  "Damaged Products",
  "Missing Deliveries",
  "Warranty Issues",
  "Bad Service",
  "Travel Problems",
  "Restaurant Feedback",
  "Subscription Billing",
  "Agency Issues",
  "Constructive Suggestions",
];

const mobileEssentials = [
  {
    title: "Fix a Problem",
    text: "Refunds, cancellations, overcharges, bad service, billing issues, damaged products, and unresolved support problems.",
    icon: ClipboardCheck,
  },
  {
    title: "Send Feedback",
    text: "Not a full complaint? Bubba helps send useful feedback, suggestions, compliments, or small frustrations.",
    icon: Megaphone,
  },
  {
    title: "Approve & Send",
    text: "Bubba drafts the message, but nothing sends until you review and approve it.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    q: "Does Bubba send messages without my approval?",
    a: "No. Bubba drafts and organizes the message, but messages are sent only after you review and approve them.",
  },
  {
    q: "Is Tell Bubba a law firm?",
    a: "No. Tell Bubba is not a law firm and does not provide legal advice. It helps users organize complaints, feedback, and resolution requests.",
  },
  {
    q: "Can Bubba guarantee a refund or response?",
    a: "No. Bubba can help improve clarity, documentation, and follow-up, but it cannot guarantee that a company will respond or provide a specific outcome.",
  },
  {
    q: "Can I use Bubba just to send feedback?",
    a: "Yes. Tell Bubba is not only for complaints. You can send feedback, suggestions, compliments, or small issues before they become bigger problems.",
  },
  {
    q: "Can businesses respond?",
    a: "That is part of the future plan. Tell Bubba is designed to eventually help companies receive cleaner customer feedback and resolve issues before they become bad reviews.",
  },
  {
    q: "What happens if the company ignores me?",
    a: "Bubba can help prepare follow-ups, organize next steps, and suggest escalation paths. You always decide what to send next.",
  },
];

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    content: [
      "Tell Bubba may collect information you provide, including your name, email address, complaint or feedback details, company names, order numbers, uploaded receipts, screenshots, correspondence, and early access signup information.",
      "We use this information to create case files, draft messages, prepare feedback, send user-approved correspondence, track follow-ups, improve the service, and communicate with you.",
      "Tell Bubba does not sell personal complaint details to advertisers. Users should avoid uploading unnecessary sensitive information.",
      "You may request deletion of your information by contacting Tell Bubba. This starter policy will be updated as the product moves from early access to live service.",
    ],
  },
  terms: {
    title: "Terms of Service",
    content: [
      "By using Tell Bubba, you agree to provide truthful and accurate information to the best of your knowledge.",
      "You are responsible for reviewing and approving any message before it is sent. Tell Bubba does not guarantee refunds, responses, credits, cancellations, or any specific outcome.",
      "Tell Bubba may not be used to send threats, harassment, false claims, spam, fraudulent complaints, or misleading reviews.",
      "Tell Bubba is an AI-assisted complaint and feedback tool. It is not a law firm and does not provide legal, financial, or professional advice.",
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    content: [
      "Tell Bubba helps users organize complaints, feedback, and resolution requests. It does not provide legal advice and does not represent users in legal matters.",
      "Escalation suggestions are informational only. Users should consult a qualified professional for legal, financial, or regulated matters.",
      "Messages are sent only with user approval. Tell Bubba does not guarantee that a company, agency, or entity will respond or resolve an issue.",
    ],
  },
  authorization: {
    title: "Consumer Authorization",
    content: [
      "Before Tell Bubba sends any message, the user must review and approve the content.",
      "By clicking Approve & Send, the user confirms that the information provided is true and accurate to the best of their knowledge.",
      "The user authorizes Tell Bubba to send the approved message and related materials on their behalf for the purpose of resolving an issue or delivering feedback.",
      "Tell Bubba will not send messages, attachments, follow-ups, or feedback without user approval or selected permissions.",
    ],
  },
  review: {
    title: "Review Policy",
    content: [
      "Tell Bubba does not create fake reviews, pay users for reviews, or help businesses suppress truthful negative reviews.",
      "Any public review draft should reflect the user’s real, truthful experience.",
      "Businesses may respond to issues or resolve complaints, but they may not pay Tell Bubba to hide legitimate complaints or truthful feedback.",
      "Tell Bubba is designed to help customers and companies resolve issues before frustration turns into public conflict.",
    ],
  },
  contact: {
    title: "Contact",
    content: [
      "For early access, business inquiries, privacy requests, or general questions, contact Tell Bubba through the early access form while the product is in development.",
      "A dedicated support email and business contact form will be added before public launch.",
    ],
  },
};

function App() {
    const [activeLegal, setActiveLegal] = useState(null);
 const [waitlistState, handleWaitlistSubmit] = useForm("xqendbry");
const [tryState, handleTrySubmit] = useForm("xqendbry");
  const tryFormRef = useRef(null);
  const waitlistFormRef = useRef(null);

  useEffect(() => {
    if (tryState.succeeded) {
      tryFormRef.current?.reset();
    }
  }, [tryState.succeeded]);

  useEffect(() => {
    if (waitlistState.succeeded) {
      waitlistFormRef.current?.reset();
    }
  }, [waitlistState.succeeded]);

  const openLegal = (page) => {
    setActiveLegal(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeLegal = () => {
    setActiveLegal(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {activeLegal && (
        <section className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 px-6 py-8 backdrop-blur">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-10">
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-orange-400">
                  Tell Bubba
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  {legalPages[activeLegal].title}
                </h2>
              </div>
              <button
                onClick={closeLegal}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 space-y-5 text-base leading-8 text-slate-300">
              {legalPages[activeLegal].content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative px-6 pb-16 pt-8 sm:px-10 lg:px-16 lg:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,.25),_transparent_32%),radial-gradient(circle_at_70%_20%,_rgba(59,130,246,.22),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur sm:px-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-11 sm:w-11">
  <svg
    viewBox="0 0 64 64"
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="18" fill="#f97316" />
    <path
      d="M15 16h34c3.3 0 6 2.7 6 6v18c0 3.3-2.7 6-6 6H31l-11 9v-9h-5c-3.3 0-6-2.7-6-6V22c0-3.3 2.7-6 6-6z"
      fill="#020617"
    />
    <text
      x="32"
      y="39"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="25"
      fontWeight="900"
      fill="#ffffff"
    >
      B
    </text>
  </svg>
</div>
              <div>
                <p className="text-lg font-black tracking-tight sm:text-xl">
                  Tell Bubba™
                </p>
                <p className="text-xs text-slate-300">at BubbaFix.com</p>
              </div>
            </div>

            <div className="ml-auto mr-6 hidden items-center justify-end gap-8 text-sm font-semibold text-slate-200 md:flex">
              <a href="#how" className="hover:text-orange-300">
                How It Works
              </a>
              <a href="#features" className="hover:text-orange-300">
                Features
              </a>
              <a href="#feedback" className="hover:text-orange-300">
                Feedback
              </a>
              <a href="#business" className="hover:text-orange-300">
                For Companies
              </a>
            </div>

            <a
              href="#try-bubba"
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-orange-200 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Early Access
            </a>
          </nav>

          <div className="grid items-center gap-12 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex flex-nowrap justify-center gap-1.5 sm:gap-2 md:justify-start">
                {["Stay Calm", "Skip The Music On Hold", "Let Bubba Fix It"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="whitespace-nowrap rounded-full border border-orange-300/30 bg-orange-400/10 px-2.5 py-1.5 text-[11px] font-bold text-orange-100 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>

              <h1 className="max-w-4xl text-center text-4xl font-black leading-[.98] tracking-tight sm:text-6xl md:text-left lg:text-7xl">
                Tell Bubba What Happened
              </h1>

              <p className="mt-6 max-w-2xl text-center text-base leading-7 text-slate-200 sm:text-xl sm:leading-8 md:text-left">
                Bubba turns complaints, problems, and customer feedback into
                clear messages companies can actually act on — then sends them
                with your approval and helps follow up.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <a
                  href="#try-bubba"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-base font-black text-slate-950 shadow-xl shadow-orange-500/20 transition hover:bg-orange-400"
                >
                  Join Early Access{" "}
                  <ArrowRight
                    className="transition group-hover:translate-x-1"
                    size={19}
                  />
                </a>

                <a
                  href="#how"
                  className="hidden items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/15 md:inline-flex"
                >
                  See How Bubba Works
                </a>
              </div>

              <div className="mt-8 hidden flex-wrap gap-3 md:flex">
                {examples.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="relative hidden md:block"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-slate-950 p-5">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500 text-slate-950">
                      <MessageSquareText size={22} />
                    </div>
                    <div>
                      <p className="font-black">Bubba Case File</p>
                      <p className="text-sm text-slate-400">
                        Complaint or Feedback, Organized.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
                      Customer said
                    </p>
                    <p className="mt-2 text-slate-200">
                      “I cancelled my subscription last month, but I was charged
                      again. Support keeps sending me in circles.”
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-blue-500/10 p-4 ring-1 ring-blue-300/15">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                        Issue
                      </p>
                      <p className="mt-1 font-semibold">
                        Billing After Cancellation
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-emerald-300/15">
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                        Goal
                      </p>
                      <p className="mt-1 font-semibold">
                        Refund + Confirmation
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                      Bubba Drafts
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      I’m requesting a refund for the charge made after
                      cancellation and written confirmation that my account is
                      closed...
                    </p>
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-slate-950">
                    Approve & Send With Bubba <Send size={18} />
                  </button>

                  <p className="mt-3 text-center text-xs text-slate-400">
                    Bubba never sends without your approval.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:hidden">
        <div className="mx-auto max-w-md">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[.04] p-5">
            <p className="text-center text-sm font-black uppercase tracking-widest text-orange-400">
              Start Here
            </p>
            <h2 className="mt-3 text-center text-3xl font-black leading-tight">
              Complaint or feedback, Bubba helps you say it right.
            </h2>
            <p className="mt-4 text-center text-base leading-7 text-slate-300">
              Tell Bubba what happened. Bubba turns it into a clear message,
              helps send it with your approval, and keeps the issue moving.
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {mobileEssentials.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-500/15 text-orange-300">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-500/10 p-5">
            <p className="text-sm font-black text-emerald-200">
              Bubba never sends without your approval.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              You review the message, confirm the facts, and decide what gets
              sent.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 md:hidden">
  <div className="mx-auto max-w-md">
    <div className="rounded-[1.75rem] border border-orange-300/20 bg-orange-400/10 p-5">
      <p className="text-center text-sm font-black uppercase tracking-widest text-orange-400">
        What Bubba Helps With
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          "Refunds",
          "Cancellations",
          "Overcharges",
          "Bad Service",
          "Billing Issues",
          "Feedback",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-center text-sm font-bold text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <p className="text-center text-lg font-black text-white">
          Before You Give Up, Tell Bubba.
        </p>
        <p className="mt-3 text-center text-sm leading-6 text-slate-300">
          Bubba helps you turn frustration into a clear request, useful feedback,
          or a documented next step.
        </p>
      </div>
    </div>
  </div>
</section>

      <section
        id="how"
        className="hidden px-6 py-20 sm:px-10 md:block lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">
              How it Works
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              From Rant to Resolution
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Bubba does the annoying part: organizing the issue, writing the
              message, finding the right route, and keeping the case moving.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[.04] p-6 shadow-xl"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/15 text-orange-300">
                      <Icon size={23} />
                    </div>
                    <span className="text-3xl font-black text-white/10">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="hidden px-6 py-20 sm:px-10 md:block lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-400">
                Product Features
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Built For The Whole Customer Moment
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-300">
              Tell Bubba is not just a complaint generator. It is a structured
              path from frustration to action, with room for feedback,
              follow-up, and company-side recovery.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[.07] to-white/[.03] p-6 shadow-xl"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/15 text-orange-300">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-6 text-xl font-black">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hidden px-6 py-20 sm:px-10 md:block lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-400">
                What Bubba Can Handle
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Big Complaint or Small Feedback, Bubba Helps You Say It Right
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {canHandle.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-4 text-center text-sm font-bold text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="feedback"
        className="hidden px-6 py-20 sm:px-10 md:block lg:px-16"
      >
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-400">
                Not a Full Complaint?
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Send Feedback Instead
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Sometimes you are not angry. You just want a company to know
                what happened, what could be better, or what almost made you
                leave. Bubba helps make that feedback clear, useful, and easy to
                send.
              </p>

              <div className="mt-7 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-5">
                <p className="font-black text-orange-100">Company value:</p>
                <p className="mt-2 leading-7 text-slate-200">
                  Tell Bubba gives businesses a chance to spot problems before
                  they turn into churn, chargebacks, or public bad reviews.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
              {caseTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.title}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[.05] p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-orange-300">
                        <Icon size={23} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{type.title}</h3>
                        <p className="mt-2 leading-7 text-slate-300">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="hidden px-6 py-20 sm:px-10 md:block lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-blue-500/10 p-7 ring-1 ring-blue-300/10">
            <AlertTriangle className="text-blue-200" size={34} />
            <h3 className="mt-6 text-2xl font-black">For Customers</h3>
            <p className="mt-4 leading-8 text-slate-300">
              No more writing angry emails from scratch, hunting for the right
              contact path, or forgetting to follow up. Bubba helps you stay
              clear, calm, documented, and in control.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-orange-500/10 p-7 ring-1 ring-orange-300/10">
            <Scale className="text-orange-300" size={34} />
            <h3 className="mt-6 text-2xl font-black">For Fairness</h3>
            <p className="mt-4 leading-8 text-slate-300">
              Tell Bubba gives companies a chance to fix things before customers
              disappear, dispute charges, or leave public reviews out of
              frustration.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-emerald-500/10 p-7 ring-1 ring-emerald-300/10">
            <Lock className="text-emerald-300" size={34} />
            <h3 className="mt-6 text-2xl font-black">For Trust</h3>
            <p className="mt-4 leading-8 text-slate-300">
              Bubba is built around user approval, truthful information, clear
              authorization, and a simple rule: nothing sends until you say so.
            </p>
          </div>
        </div>
      </section>

      <section
        id="business"
        className="hidden px-6 py-20 sm:px-10 md:block lg:px-16"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">
              For companies
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Save the Customer Before You Lose Them
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Tell Bubba can become a private early-warning system for
              companies: real complaints, useful feedback, clear case files, and
              customers who still want to be heard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Fewer surprise bad reviews",
                "Cleaner customer feedback",
                "Better recovery opportunities",
                "Insight into repeat issues",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-4 ring-1 ring-white/10"
                >
                  <CheckCircle2 className="text-emerald-300" size={21} />
                  <span className="font-semibold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-blue-200">
                <Building2 size={28} />
              </div>
              <div>
                <p className="text-2xl font-black">Business Dashboard</p>
                <p className="text-slate-400">
                  For Companies and Organizations
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-950/70 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-black">New Customer Signals</p>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-slate-950">
                    18 this week
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                    7 mentioned slow response times
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                    5 requested billing help
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                    3 almost left bad reviews
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-500/10 p-5 ring-1 ring-emerald-300/15">
                <div className="flex items-center gap-3">
                  <Star className="text-emerald-300" size={22} />
                  <p className="font-black">
                    Goal: recover customers privately
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Give companies a fair chance to make it right before the
                  customer disappears or posts publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden px-6 py-20 sm:px-10 md:block lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              A Few Things People Ask Bubba
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-white/[.04] p-5"
              >
                <div className="flex gap-4">
                  <HelpCircle
                    className="mt-1 shrink-0 text-orange-300"
                    size={21}
                  />
                  <div>
                    <h3 className="font-black text-white">{faq.q}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
<section id="try-bubba" className="px-6 py-20 sm:px-10 lg:px-16">
  <div className="mx-auto max-w-4xl rounded-[2rem] border border-orange-300/20 bg-white/[.06] p-8 text-center shadow-2xl shadow-orange-500/10 sm:p-12">
    <p className="text-sm font-black uppercase tracking-widest text-orange-300">
      Try Bubba
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
      Try Bubba With a Real Problem
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
      Tell Bubba what happened. Bubba helps turn complaints, feedback, refund
      requests, cancellations, and frustrating customer service problems into a
      clear message.
    </p>

    <form
  ref={tryFormRef}
  onSubmit={handleTrySubmit}
      className="mx-auto mt-8 grid max-w-2xl gap-3 text-left"
    >
      <input type="hidden" name="form_type" value="Try Bubba Intake" />

      <textarea
        name="what_happened"
        required
        rows="5"
        placeholder="Tell Bubba what happened..."
        className="w-full rounded-3xl border-0 bg-white px-5 py-4 font-semibold text-slate-950 outline-none"
      />

      <input
        type="email"
        name="email"
        required
        placeholder="Email address"
        className="h-14 w-full rounded-full border-0 bg-white px-5 font-semibold text-slate-950 outline-none"
      />

      <button
        type="submit"
        disabled={tryState.submitting}
        className="h-14 rounded-full bg-orange-500 px-7 font-black text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {tryState.submitting ? "Sending to Bubba..." : "Tell Bubba"}
      </button>

      {tryState.succeeded && (
        <p className="text-center font-black text-orange-200">
          Bubba got it. We’ll review early submissions as we build the first version.
        </p>
      )}
    </form>

    <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-emerald-300/20 bg-emerald-500/10 p-5 text-left">
  <p className="font-black text-emerald-200">Your Case Stays Contained</p>

  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
    Nothing is sent to a company from this form. Bubba never sends anything on
    your behalf without your review and approval.
  </p>

  <p className="mt-2 text-xs leading-6 text-slate-400">
    Only share what is needed to explain the issue. Do not submit passwords,
    full credit card numbers, Social Security numbers, or unnecessary sensitive
    information. Tell Bubba is not a law firm and does not provide legal advice.
  </p>
</div>
  </div>
</section>
<section className="px-6 py-20 sm:px-10 lg:px-16">
  <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl sm:p-10 lg:p-14">
    <p className="text-sm font-black uppercase tracking-widest text-orange-400">
      Vent vs. Bubba
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
      From Angry Rant to Clear Request
    </h2>

    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <div className="rounded-[1.5rem] border border-red-300/15 bg-red-500/10 p-6">
        <p className="text-sm font-black uppercase tracking-widest text-red-200">
          What you want to say
        </p>
        <p className="mt-4 text-lg font-semibold leading-8 text-slate-100">
          “I cancelled last month and you charged me again. I’ve emailed three
          times and nobody fixes it.”
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-500/10 p-6">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-200">
          What Bubba helps prepare
        </p>
        <p className="mt-4 text-lg font-semibold leading-8 text-slate-100">
          “I am requesting a refund for the charge made after cancellation and
          written confirmation that the account is closed and no future charges
          will occur.”
        </p>
      </div>
    </div>
  </div>
</section>

<section className="px-6 py-20 sm:px-10 lg:px-16">
  <div className="mx-auto max-w-7xl rounded-[2rem] border border-orange-300/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl sm:p-10 lg:p-14">
    <p className="text-sm font-black uppercase tracking-widest text-orange-400">
      Smart Contact Routing
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
      The Right Words Matter. The Right Destination Matters Too.
    </h2>

    <p className="mt-5 text-lg leading-8 text-slate-300">
      A clear message does not help if it goes to the wrong inbox. Bubba is
      being built to help identify the best contact route: support, billing,
      corporate, feedback, escalation, warranty, or another path that gives your
      issue a better chance of being seen.
    </p>
  </div>
</section>
      <section id="early" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
  <div className="mx-auto max-w-4xl rounded-[2rem] border border-orange-300/20 bg-orange-500 p-8 text-center text-slate-950 shadow-2xl shadow-orange-500/20 sm:p-12">
    <p className="text-sm font-black uppercase tracking-widest">
      Early Access
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
      Be First to Tell Bubba
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-900/80">
      Join the early list for customers, businesses, and testers who want a
      smarter way to handle complaints, feedback, and frustrating customer
      service problems.
    </p>

   <form
  ref={waitlistFormRef}
  onSubmit={handleWaitlistSubmit}
      className="mx-auto mt-8 grid max-w-2xl gap-3 text-left"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="Email address"
        className="h-14 w-full rounded-full border-0 bg-white px-5 font-semibold text-slate-950 outline-none ring-2 ring-transparent transition focus:ring-slate-950"
      />

      <select
        name="user_type"
        required
        defaultValue=""
        className="h-14 w-full rounded-full border-0 bg-white px-5 font-semibold text-slate-950 outline-none ring-2 ring-transparent transition focus:ring-slate-950"
      >
        <option value="" disabled>
          I am a...
        </option>
        <option value="Customer">Customer</option>
        <option value="Business">Business</option>
        <option value="Tester">Tester</option>
      </select>

      <select
        name="interest_type"
        required
        defaultValue=""
        className="h-14 w-full rounded-full border-0 bg-white px-5 font-semibold text-slate-950 outline-none ring-2 ring-transparent transition focus:ring-slate-950"
      >
        <option value="" disabled>
          I’m interested in...
        </option>
        <option value="Fixing a Problem">Fixing a Problem</option>
        <option value="Sending Feedback">Sending Feedback</option>
        <option value="Business Tools">Business Tools</option>
        <option value="General Early Access">General Early Access</option>
      </select>

      <textarea
        name="message"
        rows="4"
        placeholder="Optional: Tell Bubba what you would use this for"
        className="w-full rounded-3xl border-0 bg-white px-5 py-4 font-semibold text-slate-950 outline-none ring-2 ring-transparent transition focus:ring-slate-950"
      />

      <button
        type="submit"
        disabled={waitlistState.submitting}
        className="h-14 rounded-full bg-slate-950 px-7 font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {waitlistState.submitting ? "Sending..." : "Join Waitlist"}
      </button>

      {waitlistState.succeeded && (
        <p className="text-center font-black text-slate-950">
          You’re on the list. Bubba’s got you.
        </p>
      )}
    </form>

    <p className="mx-auto mt-5 max-w-xl text-center text-sm font-semibold leading-6 text-slate-900/70">
      Bubba will never send anything on your behalf without your review and
      approval.
    </p>
  </div>
</section>

      <footer className="border-t border-white/10 px-6 py-7 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="shrink-0 text-center lg:text-left">
              <p className="text-lg font-black text-white">
                Tell Bubba™{" "}
                <span className="text-xs font-medium text-slate-400">
                  at BubbaFix.com
                </span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm font-medium text-slate-300 lg:justify-end">
              <button
                onClick={() => openLegal("privacy")}
                className="hover:text-orange-300"
              >
                Privacy Policy
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => openLegal("terms")}
                className="hover:text-orange-300"
              >
                Terms of Service
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => openLegal("disclaimer")}
                className="hover:text-orange-300"
              >
                Disclaimer
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => openLegal("authorization")}
                className="hover:text-orange-300"
              >
                Consumer Authorization
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => openLegal("review")}
                className="hover:text-orange-300"
              >
                Review Policy
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => openLegal("contact")}
                className="hover:text-orange-300"
              >
                Contact
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Tell Bubba. All rights reserved. Tell
            Bubba is not a law firm and does not provide legal advice. Bubba
            helps users organize complaints, feedback, and resolution requests.
            Messages are sent only with user approval.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;

