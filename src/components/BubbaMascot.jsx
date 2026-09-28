import { useState } from "react";

const variants = {
  default: "/bubba/bubba-default.png",
  listening: "/bubba/bubba-listening.png",
  working: "/bubba/bubba-working.png",
  processing: "/bubba/bubba-processing.png",
  notes: "/bubba/bubba-notes.png",
  caseReady: "/bubba/bubba-case-ready.png",
  approvedSeal: "/bubba/bubba-approved-seal.png",
  icon: "/bubba/bubba-icon.png",
};

export default function BubbaMascot({ variant = "default", className = "h-16 w-16", alt = "Bubba, your case-building helper", decorative = false }) {
  const src = variants[variant] || variants.default;
  const [failedSource, setFailedSource] = useState(null);
  if (failedSource === src) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-orange-400 font-black text-slate-950 ${className}`}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : alt}
        aria-hidden={decorative || undefined}
      >B</span>
    );
  }
  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      className={`shrink-0 object-contain ${className}`}
      width="128"
      height="128"
      loading={variant === "icon" || variant === "approvedSeal" ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSource(src)}
    />
  );
}
