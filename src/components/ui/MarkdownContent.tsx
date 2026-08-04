'use client';

function parseMarkdown(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote: string | null = null; // null | 'scripture' | 'normal'
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      result.push(`<p>${ paragraphBuffer.join('<br />') }</p>`);
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (inList) {
      result.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      result.push('</blockquote>');
      inBlockquote = null;
    }
  };

  const applyInline = (line: string): string => {
    let html = line;
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<figure><img src="$2" alt="$1" loading="lazy" /><figcaption>$1</figcaption></figure>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return html;
  };

  for (const rawLine of lines) {
    const line = rawLine;

    // 빈 줄
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    // 수평선
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      result.push('<hr>');
      continue;
    }

    // 제목
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      result.push(`<h${ level }>${ applyInline(headingMatch[2]) }</h${ level }>`);
      continue;
    }

    // 성경 인용 (>! 로 시작)
    const scriptureMatch = line.match(/^>!\s*(.+)$/);
    if (scriptureMatch) {
      flushParagraph();
      flushList();
      if (inBlockquote !== 'scripture') {
        flushBlockquote();
        result.push('<blockquote class="scripture">');
        inBlockquote = 'scripture';
      }
      const content = scriptureMatch[1];
      // — 로 시작하면 cite
      if (content.startsWith('—')) {
        result.push(`<cite>${ content.slice(1).trim() }</cite>`);
      } else {
        result.push(`<p>${ applyInline(content) }</p>`);
      }
      continue;
    }

    // 일반 인용구 (> 로 시작)
    const quoteMatch = line.match(/^>\s*(.+)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      if (inBlockquote !== 'normal') {
        flushBlockquote();
        result.push('<blockquote>');
        inBlockquote = 'normal';
      }
      result.push(`<p>${ applyInline(quoteMatch[1]) }</p>`);
      continue;
    }

    // 순서 없는 리스트
    const ulMatch = line.match(/^-\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      flushBlockquote();
      if (inList !== 'ul') {
        flushList();
        result.push('<ul>');
        inList = 'ul';
      }
      result.push(`<li>${ applyInline(ulMatch[1]) }</li>`);
      continue;
    }

    // 순서 있는 리스트
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      flushBlockquote();
      if (inList !== 'ol') {
        flushList();
        result.push('<ol>');
        inList = 'ol';
      }
      result.push(`<li>${ applyInline(olMatch[1]) }</li>`);
      continue;
    }

    // 일반 텍스트 → 단락 버퍼에 추가
    flushList();
    flushBlockquote();
    paragraphBuffer.push(applyInline(line));
  }

  // 남은 버퍼 처리
  flushParagraph();
  flushList();
  flushBlockquote();

  return result.join('\n');
}

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = parseMarkdown(content.trim());

  return (
    <div
      className={`tiptap ${ className || '' }`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
