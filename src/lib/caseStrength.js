const clean = (value) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

// A completeness guide, not an assessment of merits or a predicted outcome.
// Short explanations receive half credit; detail thresholds are simple heuristics.
export function getCaseStrength(answers = {}) {
  const checks = [];
  const add = (weight, complete, tip) => checks.push({ weight, credit: complete ? 1 : 0, tip });
  const detail = (weight, value, minimum, tip) => {
    const text = clean(value);
    checks.push({ weight, credit: text.length >= minimum ? 1 : text ? 0.5 : 0, tip });
  };

  add(5, !!clean(answers.companyName), "Add the company or organization name.");
  add(5, !!clean(answers.issueCategory), "Choose the issue category that fits best.");
  detail(20, answers.whatHappened, 80, "Tell Bubba a little more about what happened—include the key details.");
  const hasTiming = !!clean(answers.whenHappened) && answers.dateMode !== "Not sure" && clean(answers.whenHappened) !== "Not sure";
  checks.push({
    weight: 10,
    credit: hasTiming ? answers.dateMode === "Exact date" ? 1 : 0.7 : 0,
    tip: hasTiming ? "Add an exact date if you know it; an approximate timeframe still helps." : "Add a date or approximate timeframe if you can.",
  });
  detail(10, answers.whatTried, 20, "Add what you already tried, or explain that you haven’t taken any steps yet.");
  add(5, !!clean(answers.whoContacted), "Add who you already contacted, or say if you haven’t contacted anyone yet.");
  detail(10, answers.whatTheySaid, 20, "Add what response you got from the company, or explain that you haven’t received one yet.");
  detail(15, answers.desiredOutcome, 30, "Make your desired outcome more specific—what would you like the company to do?");
  add(10, Array.isArray(answers.evidence) && answers.evidence.some((item) => clean(item) && item !== "I do not have proof yet"), "Add proof like a receipt, photo, email, screenshot, or tracking number.");
  add(5, /^[^\s@]+@[^\s@]+$/.test(clean(answers.email)), "Add a valid email address so Bubba can keep this connected to you.");
  add(5, answers.approval === true, "Confirm that nothing goes to a company without your review and approval.");

  const score = Math.round(checks.reduce((total, check) => total + check.weight * check.credit, 0));
  const tips = checks.filter((check) => check.credit < 1).map((check) => check.tip);
  const message = score >= 85
    ? "You’ve given Bubba plenty of detail. Give it one more look before sharing."
    : score >= 60
      ? "Bubba can work with this. A few more details or supporting records would make the information more complete."
      : "Add a few more details and Bubba can build a cleaner case.";

  return { score, tips, message };
}
