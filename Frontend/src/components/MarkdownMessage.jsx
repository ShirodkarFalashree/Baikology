import React from 'react';

/**
 * Format inline bold, italic, and highlights
 */
function renderInlineFormatted(text = '') {
  if (!text) return null;

  // Split by bold (**bold**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-[#352538]">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Robust Markdown Message Renderer for Baikology Health Assistant
 * Formats:
 * - Markdown tables (| col 1 | col 2 |) with responsive styling
 * - Numbered Headings (### 1. Section Title)
 * - Bullet lists (- item or • item)
 * - Numbered steps (1. step)
 * - Emphasized "When to Seek Medical Care" blocks
 */
export default function MarkdownMessage({ content = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Table Detection (Line starts with '|')
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      // Filter out markdown divider line (|---|---|)
      const dataRows = tableLines.filter((l) => !/^\|[\s\-:|]+\|$/.test(l));

      if (dataRows.length > 0) {
        const headerCells = dataRows[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());

        const bodyRows = dataRows.slice(1).map((r) =>
          r
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

        blocks.push({
          type: 'table',
          headers: headerCells,
          rows: bodyRows,
        });
        continue;
      }
    }

    // 2. Headings (###, ##, #)
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      const isMedicalCareAlert = headingText.toLowerCase().includes('when to seek') || headingText.toLowerCase().includes('medical care');
      blocks.push({
        type: 'heading',
        text: headingText,
        isAlert: isMedicalCareAlert,
      });
      i++;
      continue;
    }

    // 3. Bullet points (-, •, *)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletItems = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('• ') || lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        bulletItems.push(lines[i].trim().replace(/^([•\-*]\s*)/, ''));
        i++;
      }
      blocks.push({
        type: 'bullets',
        items: bulletItems,
      });
      continue;
    }

    // 4. Numbered steps (e.g. "1. ", "2. ")
    if (/^\d+\.\s+/.test(trimmed)) {
      const stepItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        stepItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'steps',
        items: stepItems,
      });
      continue;
    }

    // 5. Empty space
    if (!trimmed) {
      i++;
      continue;
    }

    // 6. Regular Paragraph
    blocks.push({
      type: 'paragraph',
      text: line,
    });
    i++;
  }

  return (
    <div className="space-y-3 text-xs leading-relaxed text-[#403344]">
      {blocks.map((block, idx) => {
        // Table
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-2.5 overflow-x-auto rounded-xl border border-[#E9DFFF] shadow-2xs">
              <table className="w-full text-left text-[11px] border-collapse bg-white">
                <thead>
                  <tr className="bg-[#FAF5FF] border-b border-[#E9DFFF]">
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="p-2 sm:p-2.5 font-bold text-[#554070] border-r last:border-r-0 border-[#E9DFFF]/60">
                        {renderInlineFormatted(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EEF8]">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FFFAF5]/60'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 sm:p-2.5 text-[#403344] border-r last:border-r-0 border-[#F4EEF8]">
                          {renderInlineFormatted(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Heading
        if (block.type === 'heading') {
          return (
            <div
              key={idx}
              className={`font-['Nunito',sans-serif] font-extrabold text-[13px] pt-1.5 flex items-center gap-1.5 ${
                block.isAlert ? 'text-[#8C243B] bg-[#FFF2F4] p-2 rounded-lg border border-[#FAD2E1]' : 'text-[#554070]'
              }`}
            >
              {block.isAlert && <span>🚨</span>}
              <span>{block.text}</span>
            </div>
          );
        }

        // Bullets
        if (block.type === 'bullets') {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-1.5">
              {block.items.map((it, itIdx) => (
                <li key={itIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#756291] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{renderInlineFormatted(it)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Numbered steps
        if (block.type === 'steps') {
          return (
            <ol key={idx} className="space-y-1.5 pl-1 my-1.5">
              {block.items.map((it, itIdx) => (
                <li key={itIdx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FAF5FF] border border-[#E9DFFF] text-[10px] font-bold text-[#756291] flex items-center justify-center shrink-0 mt-0.5">
                    {itIdx + 1}
                  </span>
                  <span className="leading-relaxed">{renderInlineFormatted(it)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
}

