import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { IconFile, IconX } from "@tabler/icons-react";

interface ResearchInputProps {
  onSubmit: (text: string, dataContext?: string, rawData?: any[]) => void;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

// Chip button SVGs
const ChipIcons = {
  deepResearch: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </svg>
  ),
  web: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  workspace: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  ),
  charts: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M21 8 13 16l-4-4-6 6" />
      <path d="M14 8h7v7" />
    </svg>
  ),
  attach: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="m21 12-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" />
    </svg>
  ),
  send: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  ),
};

export function ResearchInput({
  onSubmit,
  onStop,
  disabled,
  placeholder = "Ask a follow-up…",
}: ResearchInputProps) {
  const [value, setValue] = useState("");
  const [deepActive, setDeepActive] = useState(true);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    dataContext: string;
    rawData: any[];
  } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Parse headers and row count from the 2D array form
        const dataRows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        const headers = (dataRows[0] ?? []) as string[];
        const totalRows = dataRows.length - 1;

        // CSV is the most compact/readable format for the AI's context window
        const csvData = XLSX.utils.sheet_to_csv(ws);
        const csvSample = csvData.split("\n").slice(0, 50).join("\n"); // headers + 49 rows

        // Full array of row objects — passed to D3Renderer as `data`
        const rawData = XLSX.utils.sheet_to_json(ws);

        const dataContext = `
[ATTACHED_DATASET: ${file.name}]
Total Rows: ${totalRows}
Columns: ${headers.join(", ")}

SAMPLE_CSV_DATA (first 50 lines, including header):
${csvSample}

INSTRUCTIONS:
1. Use the column names and sample rows above to understand the dataset structure.
2. If the user asks for a chart, respond with a \`\`\`d3 code block.
3. In your D3 code, a variable called 'data' is pre-injected containing the FULL array of row objects (e.g. [{ "${headers[0]}": ..., "${headers[1]}": ... }, ...]).
4. Do NOT redefine 'data' inside the code block — it is already available.
`.trim();

        setAttachedFile({ name: file.name, dataContext, rawData });
        setIsParsing(false);
      };
      reader.onerror = () => {
        console.error("FileReader error");
        setIsParsing(false);
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error("File parsing error:", err);
      setIsParsing(false);
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed, attachedFile?.dataContext, attachedFile?.rawData);
    setValue("");
    setAttachedFile(null);
  };

  const chipBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--muted-foreground)",
    fontFamily: "var(--font-sans)",
    fontSize: "12.5px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 160ms ease",
  };

  const chipActiveStyle: React.CSSProperties = {
    background: "color-mix(in oklch, var(--primary) 16%, var(--card))",
    borderColor: "color-mix(in oklch, var(--primary) 40%, var(--border))",
    color: "color-mix(in oklch, var(--primary) 30%, var(--foreground))",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 22,
        left: "calc(240px + (100vw - 240px) / 2)",
        transform: "translateX(-50%)",
        width: "min(840px, calc(100vw - 240px - 80px))",
        zIndex: 30,
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "calc(var(--radius) * 1.4)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -12px rgba(0,0,0,0.18)",
          padding: "10px 10px 8px",
        }}
      >
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            width: "100%",
            minHeight: 24,
            maxHeight: 160,
            border: 0,
            outline: 0,
            resize: "none",
            background: "transparent",
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
            fontSize: "14.5px",
            lineHeight: 1.5,
            padding: "8px 8px 4px",
            display: "block",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 4px 0",
          }}
        >
          {/* Deep Research chip (toggleable) */}
          <button
            onClick={() => setDeepActive((v) => !v)}
            style={{ ...chipBase, ...(deepActive ? chipActiveStyle : {}) }}
            onMouseEnter={(e) => {
              if (!deepActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (!deepActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            {ChipIcons.deepResearch}
            Deep Research
          </button>

          {/* Static chips */}
          {[
            { icon: ChipIcons.web, label: "Web", onClick: () => {} },
            { icon: ChipIcons.workspace, label: "Workspace", onClick: () => {} },
            { icon: ChipIcons.charts, label: "Charts", onClick: () => {} },
            {
              icon: ChipIcons.attach,
              label: undefined,
              onClick: () => fileInputRef.current?.click(),
            },
          ].map(({ icon, label, onClick }) => (
            <button
              key={label ?? "attach"}
              title={label ?? "Attach"}
              onClick={onClick}
              style={chipBase}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {icon}
              {label}
            </button>
          ))}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            style={{ display: "none" }}
          />

          {attachedFile && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "color-mix(in oklch, var(--primary) 10%, var(--card))",
                border: "1px solid color-mix(in oklch, var(--primary) 20%, var(--border))",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
            >
              <IconFile style={{ width: 14, height: 14 }} />
              <span
                style={{
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                  padding: 2,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <IconX style={{ width: 12, height: 12 }} />
              </button>
            </div>
          )}

          {isParsing && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                animation: "pulse 2s infinite",
              }}
            >
              Parsing...
            </span>
          )}

          {/* Send / Stop */}
          <button
            onClick={disabled ? onStop : handleSubmit}
            disabled={!disabled && !value.trim()}
            style={{
              marginLeft: "auto",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: 0,
              display: "grid",
              placeItems: "center",
              cursor: disabled || value.trim() ? "pointer" : "not-allowed",
              opacity: !disabled && !value.trim() ? 0.5 : 1,
              transition: "background 160ms ease, transform 80ms ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (disabled || value.trim()) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "color-mix(in oklch, var(--primary) 88%, black)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "none";
            }}
          >
            {disabled ? ChipIcons.stop : ChipIcons.send}
          </button>
        </div>
      </div>
    </div>
  );
}
