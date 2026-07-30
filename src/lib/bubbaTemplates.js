const evidenceSuggestionsByIssue = {
  "Refund denied": ["Receipt", "Order confirmation", "Emails or chat transcript"],
  "Subscription or cancellation problem": ["Screenshots", "Emails or chat transcript", "Bank or billing statement"],
  "Billing or overcharge": ["Receipt", "Screenshots", "Bank or billing statement"],
  "Damaged product": ["Receipt", "Order confirmation", "Photos"],
  "Missing delivery": ["Order confirmation", "Screenshots", "Tracking number"],
  "Warranty problem": ["Receipt", "Photos", "Warranty information"],
  "Bad service experience": ["Receipt", "Emails or chat transcript", "Screenshots"],
  "Account access problem": ["Screenshots", "Emails or chat transcript"],
  "Constructive feedback": ["Photos", "Screenshots", "Emails or chat transcript"],
  Other: ["Receipt", "Screenshots", "Emails or chat transcript"],
};

const clean = (value, fallback = "Not provided") => value?.trim() || fallback;

export function getCaseStrength(answers) {
  const detailFields = [
    answers.companyName,
    answers.issueCategory,
    answers.whatHappened,
    answers.whatTried,
    answers.whatTheySaid,
    answers.desiredOutcome,
  ];
  const completedDetails = detailFields.filter((value) => value?.trim()).length;
  const hasReference = Boolean(answers.referenceNumber?.trim());
  const hasEvidence = answers.evidence.some((item) => item !== "I do not have proof yet");
  const score = completedDetails + Number(hasReference) + Number(hasEvidence);

  if (score >= 8) return "Strong foundation";
  if (score >= 6) return "Good starting point";
  return "Needs a little more detail";
}

export function createCaseSummary(answers) {
  const timing = answers.whenHappened?.trim()
    ? ` This happened ${answers.whenHappened.trim()}.`
    : "";
  const reference = answers.referenceNumber?.trim()
    ? ` The reference provided is ${answers.referenceNumber.trim()}.`
    : "";

  return [
    `${clean(answers.whatHappened)}${timing}${reference}`,
    `The customer already tried the following: ${clean(answers.whatTried)} They contacted ${clean(answers.whoContacted, "the company")}, and the response was: ${clean(answers.whatTheySaid)}`,
    `The requested outcome is ${clean(answers.outcomeType, "a resolution")}: ${clean(answers.desiredOutcome)}.`,
  ].join("\n\n");
}

export function createCompanyMessage(answers) {
  const company = clean(answers.companyName, "Customer Support");
  const issue = clean(answers.issueCategory, "customer service issue");
  const happened = clean(answers.whatHappened);
  const timing = answers.whenHappened?.trim()
    ? ` This occurred ${answers.whenHappened.trim()}.`
    : "";
  const reference = answers.referenceNumber?.trim()
    ? ` My reference number is ${answers.referenceNumber.trim()}.`
    : "";
  const tried = clean(answers.whatTried);
  const contacted = clean(answers.whoContacted, "your support team");
  const response = clean(answers.whatTheySaid);
  const outcome = clean(answers.desiredOutcome);
  const sender = clean(answers.name, "A customer");

  if (answers.lane === "Feedback") {
    return [
      `Hello ${company} team,`,
      `I’m writing to share constructive feedback about a ${issue.toLowerCase()}. ${happened}${timing}${reference}`,
      `I previously tried ${tried} and contacted ${contacted}. The response I received was: ${response}`,
      `I hope you’ll consider this feedback: ${outcome} I’m sharing it so your team can understand the experience and identify an opportunity to improve.`,
      `Thank you for taking the time to review this feedback.`,
      `Sincerely,\n${sender}`,
    ].join("\n\n");
  }

  return [
    `Hello ${company} team,`,
    `I’m writing about a ${issue.toLowerCase()} that I need help resolving. ${happened}${timing}${reference}`,
    `I have already tried ${tried} and contacted ${contacted}. The response I received was: ${response}`,
    `I’m requesting the following resolution: ${outcome} Please review the situation and let me know how you will address it.`,
    `Thank you for your prompt attention. I look forward to a clear response and resolution.`,
    `Sincerely,\n${sender}`,
  ].join("\n\n");
}

export function getEvidenceSuggestions(answers) {
  const selected = new Set(answers.evidence);
  const usefulEvidence = evidenceSuggestionsByIssue[answers.issueCategory] || evidenceSuggestionsByIssue.Other;
  return usefulEvidence.filter((item) => !selected.has(item));
}

export function getRecommendedNextSteps(answers) {
  const steps = [
    "Review every detail in the case summary and message for accuracy.",
    "Save all receipts, screenshots, messages, and other supporting records.",
    "Keep a record of dates, names, support channels, and company responses.",
  ];

  if (answers.lane === "Feedback") {
    steps.push("Share feedback through the company’s official feedback or customer-support channel when you are ready.");
  } else {
    steps.push("Contact the company through its official customer-support or resolution channel when you are ready.");
    steps.push("Follow up in 3 to 5 business days if you do not receive a response.");
  }

  if (answers.issueCategory === "Missing delivery") {
    steps.push("Check the carrier’s official tracking record and save the latest delivery status.");
  }
  if (["Billing or overcharge", "Refund denied"].includes(answers.issueCategory)) {
    steps.push("Keep the relevant receipt and billing statement together with the company’s response.");
  }
  if (answers.issueCategory === "Warranty problem") {
    steps.push("Review the written warranty terms and keep a copy with the case.");
  }

  steps.push("Do not send anything until you review and approve the final message.");
  return steps;
}

export function buildBubbaPreview(answers) {
  return {
    strength: getCaseStrength(answers),
    summary: createCaseSummary(answers),
    companyMessage: createCompanyMessage(answers),
    evidenceSuggestions: getEvidenceSuggestions(answers),
    nextSteps: getRecommendedNextSteps(answers),
  };
}
