import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-md overflow-hidden border border-black/[0.08]">
      <div className="flex items-center justify-between px-4 py-2 bg-black">
        <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
          {title || language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-[#F5C542] transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="!mt-0 !mb-0 !rounded-none !border-0 bg-[#0a0a0a] text-white/80 p-4 overflow-x-auto">
        <code className="text-[12px] sm:text-[13px] leading-relaxed !bg-transparent !p-0 font-mono">{code}</code>
      </pre>
    </div>
  );
}
