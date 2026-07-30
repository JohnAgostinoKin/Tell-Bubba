import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";

function BubbaCaseBuilder() {
  const [caseType, setCaseType] = useState("Complaint");
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(event.target);
    const { error: submissionError } = await supabase.from("complaints").insert([
      {
        email: data.get("email"),
        company_name: data.get("company_name"),
        issue_type: data.get("issue_type"),
        description: data.get("what_happened"),
        case_type: caseType,
        desired_outcome: data.get("desired_outcome"),
      },
    ]);
    setSubmitting(false);
    if (submissionError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSucceeded(true);
      formRef.current?.reset();
    }
  };

  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[.04] p-6 shadow-2xl shadow-orange-500/10 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-stretch">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-orange-300">Try Bubba</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Try Bubba With a Real Problem</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">Tell Bubba what happened. Give the messy version, the frustrating version, or the short version. Bubba will help turn it into a clearer complaint, feedback note, or resolution request.</p>
          <div className="mt-6 rounded-3xl border border-orange-300/20 bg-orange-500/10 p-5">
            <p className="font-black text-orange-200">Nothing gets sent yet.</p>
            <p className="mt-2 leading-7 text-slate-300">This early form helps us understand what people need Bubba to handle. Tell Bubba is not a law firm and does not provide legal advice.</p>
          </div>
          <div className="mt-4 rounded-3xl border border-emerald-300/20 bg-emerald-500/10 p-5">
            <p className="font-black text-emerald-200">You stay in control.</p>
            <p className="mt-2 leading-7 text-slate-300">Bubba never sends anything without your review and approval. Only submit truthful information that you are comfortable sharing with Tell Bubba.</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: "Complaint", title: "Complaint", text: "I need help getting this fixed." },
              { value: "Feedback", title: "Feedback", text: "I'm not furious — I just want the company to know." },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCaseType(option.value)}
                className={`rounded-3xl border p-5 text-left transition ${caseType === option.value ? "border-orange-300 bg-orange-500/20 shadow-lg shadow-orange-500/10" : "border-white/10 bg-white/[.04] hover:bg-white/[.07]"}`}
              >
                <p className="text-lg font-black text-white">{option.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{option.text}</p>
              </button>
            ))}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
            <input type="text" name="company_name" required placeholder="Company or organization name" className="h-14 rounded-full border border-white/10 bg-white px-5 font-semibold text-slate-950 outline-none transition focus:border-orange-400" />
            <textarea name="what_happened" required rows="12" placeholder="Tell Bubba what happened..." className="min-h-[210px] w-full rounded-3xl border border-white/10 bg-white px-5 py-4 font-semibold text-slate-950 outline-none transition focus:border-orange-400 sm:min-h-[260px]" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="issue_type" required className="h-14 rounded-full border border-white/10 bg-white px-5 font-semibold text-slate-950 outline-none transition focus:border-orange-400">
                <option value="">Issue type</option>
                <option value="Refund">Refund</option>
                <option value="Billing Problem">Billing Problem</option>
                <option value="Bad Service">Bad Service</option>
                <option value="Cancellation">Cancellation</option>
                <option value="Damaged Product">Damaged Product</option>
                <option value="Delivery Problem">Delivery Problem</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
              <select name="desired_outcome" required className="h-14 rounded-full border border-white/10 bg-white px-5 font-semibold text-slate-950 outline-none transition focus:border-orange-400">
                <option value="">What do you want?</option>
                <option value="Refund">Refund</option>
                <option value="Replacement">Replacement</option>
                <option value="Cancellation Confirmation">Cancellation Confirmation</option>
                <option value="Apology">Apology</option>
                <option value="Explanation">Explanation</option>
                <option value="Send Feedback Only">Send Feedback Only</option>
                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>
            </div>
            <input type="email" name="email" required placeholder="Email address" className="h-14 rounded-full border border-white/10 bg-white px-5 font-semibold text-slate-950 outline-none transition focus:border-orange-400" />
            <button type="submit" disabled={submitting} className="h-14 rounded-full bg-orange-500 px-7 font-black text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Sending to Bubba..." : "Tell Bubba"}
            </button>
            {succeeded && <p className="text-center font-black text-orange-200">Bubba got it. We'll review early submissions as we build the first version.</p>}
            {error && <p className="text-center font-black text-red-400">{error}</p>}
            <p className="text-center text-xs leading-6 text-slate-400">Nothing is sent to a company from this form. You should only submit truthful information that you are comfortable sharing with Tell Bubba.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BubbaCaseBuilder;
