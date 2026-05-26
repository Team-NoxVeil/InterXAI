import React from "react";

interface Props {
  source: string;
}

/**
 * Minimal markdown renderer for DSA problem descriptions.
 * Supports: headings (#/##/###), fenced code blocks, inline code, **bold**,
 * unordered/ordered lists, paragraphs, blockquotes. Does NOT use
 * dangerouslySetInnerHTML — everything stays as React nodes.
 */
export default function MarkdownView({ source }: Props) {
  const blocks = parseBlocks(source);
  return (
    <div
      style={{
        fontSize: 14,
        lineHeight: 1.7,
        color: "#334155",
      }}
    >
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

type Block =
  | { kind: "h"; level: 1 | 2 | 3; text: string }
  | { kind: "p"; text: string }
  | { kind: "code"; lang: string; body: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.replace(/^```/, "").trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        body.push(lines[i]);
        i++;
      }
      i++;
      out.push({ kind: "code", lang, body: body.join("\n") });
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const m = /^(#{1,3})\s+(.*)$/.exec(line)!;
      out.push({
        kind: "h",
        level: m[1].length as 1 | 2 | 3,
        text: m[2],
      });
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const text = line.replace(/^>\s?/, "");
      out.push({ kind: "quote", text });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push({ kind: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push({ kind: "ol", items });
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paragraph: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i++;
    }
    out.push({ kind: "p", text: paragraph.join(" ") });
  }
  return out;
}

function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case "h": {
      const size = block.level === 1 ? 22 : block.level === 2 ? 18 : 15;
      return (
        <div
          style={{
            fontSize: size,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.3px",
            marginTop: 18,
            marginBottom: 8,
          }}
        >
          <Inline text={block.text} />
        </div>
      );
    }
    case "p":
      return (
        <p style={{ marginBottom: 12 }}>
          <Inline text={block.text} />
        </p>
      );
    case "code":
      return (
        <pre
          style={{
            background: "rgba(15,23,42,0.92)",
            color: "#e2e8f0",
            borderRadius: 12,
            padding: "14px 16px",
            fontSize: 12.5,
            lineHeight: 1.55,
            overflow: "auto",
            marginBottom: 14,
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
          }}
        >
          {block.lang && (
            <div
              style={{
                fontSize: 10.5,
                color: "#94a3b8",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              {block.lang}
            </div>
          )}
          <code>{block.body}</code>
        </pre>
      );
    case "ul":
      return (
        <ul style={{ paddingLeft: 22, marginBottom: 12 }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <Inline text={it} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol style={{ paddingLeft: 22, marginBottom: 12 }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <Inline text={it} />
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote
          style={{
            borderLeft: "3px solid #93c5fd",
            background: "rgba(219,234,254,0.4)",
            padding: "8px 14px",
            borderRadius: 8,
            marginBottom: 12,
            color: "#475569",
          }}
        >
          <Inline text={block.text} />
        </blockquote>
      );
  }
}

function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          style={{
            background: "rgba(15,23,42,0.07)",
            color: "#1d4ed8",
            padding: "1.5px 6px",
            borderRadius: 5,
            fontSize: "0.92em",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
          }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("**")) {
      parts.push(
        <strong key={key++} style={{ fontWeight: 700, color: "#0f172a" }}>
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <em key={key++} style={{ fontStyle: "italic" }}>
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
