import { useState } from "react";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/15 transition-colors hover:bg-white/20"
      }
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
