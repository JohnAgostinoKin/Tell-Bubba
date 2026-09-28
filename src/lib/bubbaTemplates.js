import { getCaseStrength } from "./caseStrength";

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

function timingSentence(answers) {
  const value = answers.whenHappened?.trim();
  if (!value || answers.dateMode === "Not sure" || value === "Not sure") return "";
  if (answers.dateMode === "Exact date") return ` This happened on ${value}.`;
  return ` The approximate timeframe was: ${value}.`;
}

export function createCaseSummary(answers) {
  const timing = timingSentence(answers);
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
  const timing = timingSentence(answers);
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
      `I’m writing to share constructive feedback. Topic: ${issue}.\n\n${happened}${timing}${reference}`,
      `What I have already tried: ${tried}\nWho I contacted: ${contacted}\nThe response I received: ${response}`,
      `I hope you’ll consider this feedback: ${outcome} I’m sharing it so your team can understand the experience and identify an opportunity to improve.`,
      `Thank you for taking the time to review this feedback.`,
      `Sincerely,\n${sender}`,
    ].join("\n\n");
  }

  return [
    `Hello ${company} team,`,
    `I’m writing to request help resolving an issue. Topic: ${issue}.\n\n${happened}${timing}${reference}`,
    `What I have already tried: ${tried}\nWho I contacted: ${contacted}\nThe response I received: ${response}`,
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

export function getSuggestedRoute(issueCategory) {
  if (["Refund denied", "Billing or overcharge", "Subscription or cancellation problem"].includes(issueCategory)) {
    return {
      label: "Billing or account support",
      explanation: "This type of issue usually belongs with the team that handles charges, refunds, subscriptions, and account changes.",
    };
  }
  if (["Damaged product", "Missing delivery", "Warranty problem"].includes(issueCategory)) {
    return {
      label: "Customer support, claims, or warranty path",
      explanation: "Start with the company’s official support process for delivery problems, damaged items, or warranty requests.",
    };
  }
  if (issueCategory === "Bad service experience") {
    return {
      label: "Guest relations, customer experience, or store management",
      explanation: "These teams usually handle service experiences and can help direct your concern to the right location or manager.",
    };
  }
  if (issueCategory === "Constructive feedback") {
    return {
      label: "Feedback, guest relations, or customer experience channel",
      explanation: "Look for the company’s official feedback channel to share your experience and suggestions for improvement.",
    };
  }
  if (issueCategory === "Account access problem") {
    return {
      label: "Account support or security support",
      explanation: "Use the company’s official account recovery or security support process for trouble signing in or accessing your account.",
    };
  }
  return {
    label: "General customer support",
    explanation: "Start with the company’s official customer support channel and ask which team handles your issue.",
  };
}

export function getFollowUpPlan(issueCategory) {
  let records = "";
  if (["Refund denied", "Billing or overcharge", "Subscription or cancellation problem"].includes(issueCategory)) {
    records = " Keep billing records and any cancellation requests or confirmations together.";
  } else if (["Missing delivery", "Damaged product", "Warranty problem"].includes(issueCategory)) {
    records = " Keep photos, tracking details, the order number, and any warranty details together.";
  } else if (["Bad service experience", "Constructive feedback"].includes(issueCategory)) {
    records = " Note the location, date, and employee or manager contact if known.";
  } else if (issueCategory === "Account access problem") {
    records = " Note the account email, support ticket number, and security steps you have taken. Never include passwords or verification codes.";
  }
  return [
    "Review and send the message yourself during beta.",
    `Save proof: receipts, screenshots, emails, tracking numbers, and confirmation numbers.${records}`,
    "If the company does not respond in 3–5 business days, follow up.",
    "If they deny or ignore the issue, Bubba can help prepare the next message.",
    "Keep a timeline of dates, names, and responses.",
  ];
}

export function buildBubbaPreview(answers) {
  return {
    strength: getCaseStrength(answers),
    summary: createCaseSummary(answers),
    companyMessage: createCompanyMessage(answers),
    evidenceSuggestions: getEvidenceSuggestions(answers),
    nextSteps: getRecommendedNextSteps(answers),
    suggestedRoute: getSuggestedRoute(answers.issueCategory),
    followUpPlan: getFollowUpPlan(answers.issueCategory),
  };
}
