import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clipboard, Printer, RotateCcw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { buildBubbaPreview } from "../lib/bubbaTemplates";

const steps = [
  "Choose your lane",
  "Company and issue",
  "What happened",
  "What you've tried",
  "What you want",
  "Evidence",
  "Contact info",
];

const issueCategories = [
  "Refund denied",
  "Subscription or cancellation problem",
  "Billing or overcharge",
  "Damaged product",
  "Missing delivery",
  "Warranty problem",
  "Bad service experience",
  "Account access problem",
  "Constructive feedback",
  "Other",
];

const outcomeTypes = [
  "Refund",
  "Replacement",
  "Cancellation",
  "Billing correction",
  "Apology or explanation",
  "Company feedback only",
  "Other",
];

const evidenceOptions = [
  "Receipt",
  "Order confirmation",
  "Photos",
  "Screenshots",
  "Emails or chat transcript",
  "Tracking number",
  "Warranty information",
  "Bank or billing statement",
  "Other proof",
  "I do not have proof yet",
];

const initialAnswers = {
  lane: "Complaint",
  companyName: "",
  issueCategory: "",
  whatHappened: "",
  dateMode: "Exact date",
  whenHappened: "",
  referenceNumber: "",
  whatTried: "",
  whoContacted: "",
  whatTheySaid: "",
  desiredOutcome: "",
  outcomeType: "",
  evidence: [],
  name: "",
  email: "",
  approval: false,
};

const draftKey = "bubba-case-builder-draft-v1";

function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey));
    if (draft?.version !== 1 || !draft.answers || typeof draft.answers !== "object") return null;
    // Only restore known intake fields with the expected types.
    const answers = { ...initialAnswers };
    for (const key of Object.keys(initialAnswers)) {
      if (typeof initialAnswers[key] === "string" && typeof draft.answers[key] === "string") {
        answers[key] = draft.answers[key];
      }
    }
    answers.lane = answers.lane === "Feedback" ? "Feedback" : "Complaint";
    if (!["Exact date", "Approximate date", "Not sure"].includes(draft.answers.dateMode)) {
      answers.dateMode = answers.whenHappened === "Not sure" ? "Not sure" : "Approximate date";
    }
    if (answers.dateMode === "Not sure") answers.whenHappened = "Not sure";
    if (!issueCategories.includes(answers.issueCategory)) answers.issueCategory = "";
    if (!outcomeTypes.includes(answers.outcomeType)) answers.outcomeType = "";
    answers.approval = draft.answers.approval === true;
    answers.evidence = Array.isArray(draft.answers.evidence)
      ? [...new Set(draft.answers.evidence.filter((item) => evidenceOptions.includes(item)))]
      : [];
    if (answers.evidence.length > 1) {
      answers.evidence = answers.evidence.filter((item) => item !== "I do not have proof yet");
    }
    const currentStep = Number.isInteger(draft.currentStep)
      ? Math.max(0, Math.min(draft.currentStep, steps.length - 1)) : 0;
    return { answers, currentStep };
  } catch {
    // Corrupt or unavailable browser storage must not prevent case building.
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(draftKey);
  } catch {
    // The form remains usable when browser storage is unavailable.
  }
}

const fieldClassName =
  "w-full rounded-3xl border border-white/10 bg-white px-5 py-4 font-semibold text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-orange-400";

function BubbaCaseBuilder() {
  const [draft] = useState(readDraft);
  const [currentStep, setCurrentStep] = useState(draft?.currentStep ?? 0);
  const [answers, setAnswers] = useState(draft?.answers ?? initialAnswers);
  const [draftRestored, setDraftRestored] = useState(Boolean(draft));
  const [validationMessage, setValidationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const submissionLock = useRef(false);
  const builderRef = useRef(null);
  const previousView = useRef({ currentStep, showPreview });
  const preview = buildBubbaPreview(answers);

  useEffect(() => {
    const previous = previousView.current;
    previousView.current = { currentStep, showPreview };
    if (previous.currentStep === currentStep && previous.showPreview === showPreview) return;
    const target = builderRef.current?.querySelector(showPreview ? "h2" : "fieldset");
    if (target) {
      target.tabIndex = -1;
      target.focus();
    }
  }, [currentStep, showPreview]);

  useEffect(() => {
    if (saved || (currentStep === 0 && JSON.stringify(answers) === JSON.stringify(initialAnswers))) {
      clearDraft();
      return;
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify({ version: 1, answers, currentStep }));
    } catch {
      // Storage may be disabled or full; keep the in-memory case usable.
    }
  }, [answers, currentStep, saved]);

  const updateAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    setValidationMessage("");
    setSubmissionError("");
  };

  const toggleEvidence = (item) => {
    setAnswers((current) => {
      const evidence = current.evidence.includes(item)
        ? current.evidence.filter((entry) => entry !== item)
        : item === "I do not have proof yet"
          ? [item]
          : [...current.evidence.filter((entry) => entry !== "I do not have proof yet"), item];
      return { ...current, evidence };
    });
    setValidationMessage("");
  };

  const validateStep = (step = currentStep) => {
    const messages = [
      "",
      !answers.companyName.trim() || !answers.issueCategory
        ? "Bubba needs the company name and issue category before we keep going."
        : "",
      !answers.whatHappened.trim() || (answers.dateMode !== "Not sure" && !answers.whenHappened.trim())
        ? "Give Bubba the story, then add a date or timeframe—or choose Not sure."
        : "",
      !answers.whatTried.trim() || !answers.whoContacted.trim() || !answers.whatTheySaid.trim()
        ? "Tell Bubba what you tried, who you contacted, and what they told you."
        : "",
      !answers.desiredOutcome.trim() || !answers.outcomeType
        ? "Bubba needs to know what a good outcome looks like for you."
        : "",
      answers.evidence.length === 0
        ? "Pick any proof you have—or choose “I do not have proof yet.”"
        : "",
      !answers.email.trim()
        ? "Bubba needs an email address to keep this case connected to you."
        : !answers.approval
          ? "Please confirm that Bubba must get your approval before anything is sent."
          : "",
    ];

    const message = messages[step];
    setValidationMessage(message);
    if (message) setCurrentStep(step);
    return !message;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setValidationMessage("");
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const buildDescription = (submittedAt) =>
    [
      "BETA REVIEW SUMMARY",
      `Case type: ${answers.lane}`,
      `Submitted at: ${submittedAt}`,
      "Nothing has been sent to the company.",
      "Generated case summary:",
      preview.summary,
      "",
      "USER CONTACT",
      `Submitted by: ${answers.name || "Name not provided"}`,
      `Email: ${answers.email}`,
      `Review-and-approval acknowledgement: ${answers.approval ? "Accepted" : "Not accepted"}`,
      "",
      "COMPANY / ISSUE",
      `Company name: ${answers.companyName}`,
      `Issue category: ${answers.issueCategory}`,
      `Reference number: ${answers.referenceNumber || "Not provided"}`,
      "",
      "TIMING",
      `Date mode: ${answers.dateMode}`,
      `When it happened: ${answers.whenHappened}`,
      "",
      "WHAT HAPPENED",
      answers.whatHappened,
      "",
      "WHAT USER TRIED",
      `What was already tried: ${answers.whatTried}`,
      `Who was contacted: ${answers.whoContacted}`,
      `What they said: ${answers.whatTheySaid}`,
      "",
      "OUTCOME REQUESTED",
      `Outcome type: ${answers.outcomeType}`,
      `Desired outcome: ${answers.desiredOutcome}`,
      "",
      "EVIDENCE",
      `Evidence available: ${answers.evidence.join(", ")}`,
      "",
      "CASE COMPLETENESS",
      `Bubba Case Completeness: ${preview.strength.score}%`,
      "This measures how complete your case information is — not whether the company will resolve it.",
      preview.strength.message,
      "Improvement tips:",
      ...(preview.strength.tips.length
        ? preview.strength.tips.map((tip) => `- ${tip}`)
        : ["No missing-detail tips. Review the information for accuracy."]),
      "",
      "SMART ROUTING PREVIEW",
      `Suggested route: ${preview.suggestedRoute.label}`,
      `Why Bubba recommends it: ${preview.suggestedRoute.explanation}`,
      "Route confidence: Early guidance",
      "Bubba will get smarter as the routing database grows.",
      "",
      "FOLLOW-UP PLAN",
      ...preview.followUpPlan.map((step, index) => `${index + 1}. ${step}`),
      "",
      "GENERATED MESSAGE",
      preview.companyMessage,
      "",
      "VALIDATION QUESTIONS",
      "- Did the user likely have a real issue?",
      "- Would this case benefit from company-specific routing?",
      "- Would this user likely pay $9.99 for Smart Routing + escalation + follow-up?",
      "- Did the generated message need human editing?",
      "- Outcome later: unresolved / company replied / resolved / refunded / cancelled / other",
    ].join("\n");

  const handleBuild = (event) => {
    event.preventDefault();
    if (currentStep < steps.length - 1) {
      goNext();
      return;
    }
    for (let step = 0; step < steps.length; step += 1) {
      if (!validateStep(step)) return;
    }

    setSubmissionError("");
    setCopyStatus("");
    setShowPreview(true);
  };

  const handleSave = async () => {
    if (submissionLock.current || saved) return;
    submissionLock.current = true;
    setSubmitting(true);
    setSubmissionError("");
    const submittedAt = new Date().toISOString();

    try {
      const { error } = await supabase.from("complaints").insert([
        {
          email: answers.email.trim(),
          company_name: answers.companyName.trim(),
          issue_type: answers.issueCategory,
          description: buildDescription(submittedAt),
          case_type: answers.lane,
          desired_outcome: `${answers.outcomeType}: ${answers.desiredOutcome.trim()}`,
        },
      ]);

      if (error) {
        setSubmissionError("Dang it. Bubba hit a snag. Try again in a minute.");
        return;
      }

      clearDraft();
      setDraftRestored(false);
      setSaved(true);
    } catch {
      setSubmissionError("Dang it. Bubba hit a snag. Try again in a minute.");
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  };

  const startAnotherCase = () => {
    if (submissionLock.current) return;
    clearDraft();
    setDraftRestored(false);
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setValidationMessage("");
    setSubmissionError("");
    setShowPreview(false);
    setSaved(false);
    setCopyStatus("");
    submissionLock.current = false;
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(preview.companyMessage);
      setCopyStatus("Message copied!");
    } catch {
      setCopyStatus("Bubba couldn’t copy automatically. Select the message and copy it manually.");
    }
  };

  if (showPreview) {
    return (
      <div ref={builderRef} className="bubba-case-preview mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl shadow-orange-500/10 sm:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-300">
                {saved ? "Bubba case saved" : "Bubba case preview"}
              </p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                {answers.lane === "Complaint" ? "Your Bubba Case Is Built" : "Your Feedback Note Is Built"}
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                {saved
                  ? "Bubba got it for beta review. Nothing has been sent to the company."
                  : "Review the information below, then send it to Tell Bubba for beta review. This does not contact the company."}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-orange-300/20 bg-orange-500/10 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="bubba-completeness-label" className="text-2xl font-black text-white">Bubba Case Completeness: {preview.strength.score}%</h3>
            </div>
            <div
              role="progressbar"
              aria-labelledby="bubba-completeness-label"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={preview.strength.score}
              className="mt-4 h-3 overflow-hidden rounded-full border border-orange-300/40 bg-slate-950"
            >
              <div className="h-full bg-orange-400 print:!bg-black" style={{ width: `${preview.strength.score}%` }} />
            </div>
            <p className="mt-4 font-bold text-orange-100">{preview.strength.message}</p>
            <p className="mt-2 text-sm text-slate-300">This measures how complete your case information is — not whether the company will resolve it.</p>
            {preview.strength.tips.length > 0 && (
              <div className="mt-4">
                <h4 className="font-black text-white">Give Bubba a little more to work with</h4>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-200">
                  {preview.strength.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            )}
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Case type", answers.lane],
                ["Company name", answers.companyName],
                ["Issue category", answers.issueCategory],
                ["When it happened", answers.dateMode === "Not sure" ? "Not sure" : `${answers.dateMode}: ${answers.whenHappened}`],
                ["Desired outcome", `${answers.outcomeType}: ${answers.desiredOutcome}`],
                ["Evidence selected", answers.evidence.join(", ")],
                ["Email", answers.email],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-950/50 p-4">
                  <dt className="text-xs font-black uppercase tracking-widest text-orange-300">{label}</dt>
                  <dd className="mt-2 leading-7 text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-black text-orange-100">Nothing has been sent to the company.</p>
          </div>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <h3 className="text-2xl font-black text-white">Case Summary</h3>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-200">{preview.summary}</p>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-black text-white">Message to Company</h3>
              <button
                type="button"
                onClick={copyMessage}
                className="print:hidden inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-300"
              >
                <Clipboard size={18} />
                Copy Message
              </button>
            </div>
            <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-white p-5 leading-8 text-slate-900">{preview.companyMessage}</div>
            {copyStatus && <p aria-live="polite" className="mt-3 text-sm font-bold text-orange-200">{copyStatus}</p>}
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <h3 className="text-2xl font-black text-white">Evidence Checklist</h3>
            <p className="mt-4 font-bold text-slate-200">Selected evidence</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {answers.evidence.map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="shrink-0 text-emerald-300" size={18} />
                  {item}
                </li>
              ))}
            </ul>
            {preview.evidenceSuggestions.length > 0 && (
              <div className="mt-5 rounded-2xl border border-blue-300/15 bg-blue-500/10 p-4">
                <p className="font-black text-blue-200">Other evidence that may help</p>
                <p className="mt-2 leading-7 text-slate-300">{preview.evidenceSuggestions.join(", ")}</p>
              </div>
            )}
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <h3 className="text-2xl font-black text-white">Smart Routing Preview</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-bold text-slate-300">Suggested route</dt>
                <dd className="mt-1 text-lg font-black text-orange-200">{preview.suggestedRoute.label}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-300">Why Bubba recommends it</dt>
                <dd className="mt-1 leading-7 text-slate-300">{preview.suggestedRoute.explanation}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-300">Confidence</dt>
                <dd className="mt-1 text-sm font-black text-orange-200">Early guidance</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm text-slate-300">Bubba will get smarter as the routing database grows.</p>
            <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">The free preview gives general routing guidance. Bubba Case Pack will add company-specific routing, escalation guidance, and follow-up steps when available.</p>
            <p className="mt-4 font-black text-emerald-200">
              {saved ? "Nothing has been sent to the company." : "Nothing has been sent yet."} Bubba never sends anything without your review and approval.
            </p>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <h3 className="text-2xl font-black text-white">Recommended Next Steps</h3>
            <p className="mt-4 leading-7 text-slate-300">This is the point of Bubba: organize the facts, the proof, the route, and the follow-up so the company can understand the issue faster and see that you’re prepared to stay on it.</p>
            <ol className="mt-4 grid gap-3">
              {preview.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-3 leading-7 text-slate-300">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-400 text-sm font-black text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
            <h3 className="text-2xl font-black text-white">Follow-Up Plan</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-slate-300">
              {preview.followUpPlan.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>

          <section className="print:hidden mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-6">
            <p className="text-sm font-bold text-slate-400">Coming soon</p>
            <h3 className="mt-2 text-2xl font-black text-white">Coming Soon: Bubba Case Pack</h3>
            <p className="mt-4 leading-7 text-slate-300">Bubba’s basic case preview is free during beta. A future paid upgrade may include a polished complaint letter, escalation version, evidence checklist, follow-up plan, suggested route, and printable case packet.</p>
          </section>

          <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-500/10 p-5">
            <p className="font-black text-emerald-200">Nothing has been sent to the company. Bubba never sends anything without your review and approval.</p>
          </div>
          {submissionError && <p role="alert" className="mt-6 rounded-2xl bg-red-500/15 p-4 font-bold text-red-300">{submissionError}</p>}
          {saved && <p role="status" className="mt-6 rounded-2xl bg-emerald-500/15 p-4 font-black text-emerald-200">Bubba got it. Let me sort through this mess.</p>}
          <div className="print:hidden mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setCopyStatus("");
                setSubmissionError("");
                setCurrentStep(0);
                setShowPreview(false);
              }}
              disabled={submitting || saved}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Edit My Answers
            </button>
            <button
              type="button"
              onClick={startAnotherCase}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/15 disabled:opacity-40"
            >
              <RotateCcw size={18} />
              Start Over
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/15"
            >
              <Printer size={18} />
              Print / Save Case Pack
            </button>
            {!saved ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={submitting}
                className="rounded-full bg-orange-400 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-200/60 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Sending to Bubba..."
                  : "Send to Bubba for Beta Review"}
              </button>
            ) : (
              <p className="rounded-full bg-emerald-400/15 px-5 py-3 font-black text-emerald-200">Sent to Bubba for beta review</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={builderRef} className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl shadow-orange-500/10 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-widest text-orange-300">Try Bubba</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Build Your Bubba Case</h2>
        <p className="mt-4 text-lg leading-8 text-slate-300">Give Bubba the messy version. We’ll organize it one friendly step at a time.</p>
        <p className="mt-4 leading-7 text-slate-300">Bubba helps turn messy complaints into clear, documented, follow-up-ready cases. A calm case with facts, evidence, and a specific request is easier for a company to understand — and harder to brush aside.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          {draftRestored && <p role="status">Bubba saved your spot.</p>}
          <p>Drafts stay in this browser when local storage is available.</p>
          <button type="button" onClick={startAnotherCase} className="rounded-full border border-white/20 px-4 py-2 font-bold text-white">
            Clear Draft
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 text-sm font-bold text-slate-300">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep]}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleBuild} className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 sm:p-7">
          {currentStep === 0 && (
            <fieldset>
              <legend className="text-2xl font-black text-white">Choose your Bubba lane</legend>
              <p className="mt-2 text-slate-300">What kind of note should Bubba help you build?</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { value: "Complaint", text: "I need help getting this fixed." },
                  { value: "Feedback", text: "I’m not furious — I just want the company to know." },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-3xl border p-5 transition focus-within:ring-2 focus-within:ring-orange-300 ${answers.lane === option.value ? "border-orange-300 bg-orange-500/20 shadow-lg shadow-orange-500/10" : "border-white/10 bg-white/[.04] hover:bg-white/[.07]"}`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="lane"
                      value={option.value}
                      checked={answers.lane === option.value}
                      onChange={(event) => updateAnswer("lane", event.target.value)}
                    />
                    <span className="text-lg font-black text-white">{option.value}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-300">{option.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {currentStep === 1 && (
            <fieldset className="grid gap-5">
              <legend className="text-2xl font-black text-white">Company and issue</legend>
              <label className="grid gap-2 font-bold text-slate-200">
                Company or organization name
                <input className={fieldClassName} value={answers.companyName} onChange={(event) => updateAnswer("companyName", event.target.value)} />
              </label>
              <label className="grid gap-2 font-bold text-slate-200">
                Issue category
                <select className={fieldClassName} value={answers.issueCategory} onChange={(event) => updateAnswer("issueCategory", event.target.value)}>
                  <option value="">Choose the closest match</option>
                  {issueCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className="grid gap-5">
              <legend className="text-2xl font-black text-white">What happened?</legend>
              <label className="grid gap-2 font-bold text-slate-200">
                What happened?
                <textarea rows="7" className={fieldClassName} value={answers.whatHappened} onChange={(event) => updateAnswer("whatHappened", event.target.value)} placeholder="Tell Bubba the messy version..." />
              </label>
              <fieldset>
                <legend className="font-bold text-slate-200">When did it happen?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {["Exact date", "Approximate date", "Not sure"].map((dateMode) => (
                    <label key={dateMode} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 font-bold text-slate-200 focus-within:ring-2 focus-within:ring-orange-300 ${answers.dateMode === dateMode ? "border-orange-300 bg-orange-500/15" : "border-white/10 bg-white/[.04]"}`}>
                      <input
                        type="radio"
                        name="dateMode"
                        value={dateMode}
                        checked={answers.dateMode === dateMode}
                        onChange={() => {
                          setAnswers((current) => ({ ...current, dateMode, whenHappened: dateMode === "Not sure" ? "Not sure" : "" }));
                          setValidationMessage("");
                          setSubmissionError("");
                        }}
                        className="h-5 w-5 shrink-0 accent-orange-500"
                      />
                      {dateMode}
                    </label>
                  ))}
                </div>
              </fieldset>
              {answers.dateMode !== "Not sure" && (
                <label className="grid gap-2 font-bold text-slate-200">
                  {answers.dateMode === "Exact date" ? "Choose the date" : "Approximate date"}
                  <input
                    type={answers.dateMode === "Exact date" ? "date" : "text"}
                    className={fieldClassName}
                    value={answers.whenHappened}
                    onChange={(event) => updateAnswer("whenHappened", event.target.value)}
                    placeholder={answers.dateMode === "Approximate date" ? "Example: early September, last Friday, around Christmas, about two weeks ago" : undefined}
                  />
                </label>
              )}
              {answers.dateMode === "Not sure" && (
                <p className="text-sm leading-6 text-slate-300">That’s okay. Bubba can still build the case, but an approximate date can make the information more complete.</p>
              )}
              <label className="grid gap-2 font-bold text-slate-200">
                Order number, account number, or reference number <span className="font-normal text-slate-400">(optional)</span>
                <input className={fieldClassName} value={answers.referenceNumber} onChange={(event) => updateAnswer("referenceNumber", event.target.value)} />
              </label>
            </fieldset>
          )}

          {currentStep === 3 && (
            <fieldset className="grid gap-5">
              <legend className="text-2xl font-black text-white">What have you tried?</legend>
              <label className="grid gap-2 font-bold text-slate-200">
                What did you already try?
                <textarea rows="4" className={fieldClassName} value={answers.whatTried} onChange={(event) => updateAnswer("whatTried", event.target.value)} />
              </label>
              <label className="grid gap-2 font-bold text-slate-200">
                Who did you contact?
                <input className={fieldClassName} value={answers.whoContacted} onChange={(event) => updateAnswer("whoContacted", event.target.value)} />
              </label>
              <label className="grid gap-2 font-bold text-slate-200">
                What did they say?
                <textarea rows="4" className={fieldClassName} value={answers.whatTheySaid} onChange={(event) => updateAnswer("whatTheySaid", event.target.value)} />
              </label>
            </fieldset>
          )}

          {currentStep === 4 && (
            <fieldset className="grid gap-5">
              <legend className="text-2xl font-black text-white">What do you want?</legend>
              <label className="grid gap-2 font-bold text-slate-200">
                What kind of outcome are you looking for?
                <select className={fieldClassName} value={answers.outcomeType} onChange={(event) => updateAnswer("outcomeType", event.target.value)}>
                  <option value="">Choose an outcome</option>
                  {outcomeTypes.map((outcome) => <option key={outcome}>{outcome}</option>)}
                </select>
              </label>
              <label className="grid gap-2 font-bold text-slate-200">
                Tell Bubba exactly what you want the company to do.
                <textarea rows="5" className={fieldClassName} value={answers.desiredOutcome} onChange={(event) => updateAnswer("desiredOutcome", event.target.value)} placeholder="Example: I want a full refund of $84.17, cancellation confirmation, and no further billing." />
              </label>
            </fieldset>
          )}

          {currentStep === 5 && (
            <fieldset>
              <legend className="text-2xl font-black text-white">Evidence checklist</legend>
              <p className="mt-2 text-slate-300">Select everything you have. You won’t upload anything yet.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {evidenceOptions.map((item) => (
                  <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 font-bold transition ${answers.evidence.includes(item) ? "border-orange-300 bg-orange-500/15 text-white" : "border-white/10 bg-white/[.04] text-slate-300 hover:bg-white/[.07]"}`}>
                    <input type="checkbox" checked={answers.evidence.includes(item)} onChange={() => toggleEvidence(item)} className="h-5 w-5 accent-orange-500" />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {currentStep === 6 && (
            <fieldset className="grid gap-5">
              <legend className="text-2xl font-black text-white">Contact info</legend>
              <label className="grid gap-2 font-bold text-slate-200">
                Name <span className="font-normal text-slate-400">(optional)</span>
                <input className={fieldClassName} value={answers.name} onChange={(event) => updateAnswer("name", event.target.value)} autoComplete="name" />
              </label>
              <label className="grid gap-2 font-bold text-slate-200">
                Email
                <input type="email" className={fieldClassName} value={answers.email} onChange={(event) => updateAnswer("email", event.target.value)} autoComplete="email" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-emerald-300/20 bg-emerald-500/10 p-5 font-bold leading-7 text-emerald-100">
                <input type="checkbox" checked={answers.approval} onChange={(event) => updateAnswer("approval", event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400" />
                I understand Bubba will not send anything to a company unless I review and approve it first.
              </label>
            </fieldset>
          )}

          {validationMessage && <p role="alert" className="mt-6 rounded-2xl bg-orange-500/15 p-4 font-bold text-orange-200">{validationMessage}</p>}
          {submissionError && <p role="alert" className="mt-6 rounded-2xl bg-red-500/15 p-4 font-bold text-red-300">{submissionError}</p>}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0 || submitting}
              className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button type="button" onClick={(event) => {
                event.preventDefault();
                goNext();
              }} className="rounded-full bg-orange-400 px-7 py-4 font-black text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-200/60 transition hover:bg-orange-300">
                Next
              </button>
            ) : (
              <button type="submit" className="rounded-full bg-orange-400 px-7 py-4 font-black text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-200/60 transition hover:bg-orange-300">
                {answers.lane === "Complaint"
                  ? "Build My Bubba Case"
                  : "Build My Feedback Note"}
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center font-black text-emerald-200">Bubba never sends anything without your review and approval.</p>
      </div>
    </div>
  );
}

export default BubbaCaseBuilder;
