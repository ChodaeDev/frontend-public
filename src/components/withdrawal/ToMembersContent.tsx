'use client';

import { useTranslation } from '@/i18n/client';
import { usePageContent } from '@/i18n/content';

interface ToMembersParagraph {
  text: string;
  highlights?: string[];
}

export default function ToMembersContent() {
  const { locale } = useTranslation();
  const t = usePageContent<{
    paragraphs: ToMembersParagraph[];
    emphasis: string;
    closing: string;
  }>('toMembers', locale);

  const renderParagraph = (paragraph: ToMembersParagraph) => {
    if (!paragraph.highlights?.length) return paragraph.text;

    const parts: (string | { text: string; highlighted: true })[] = [];
    let remaining = paragraph.text;

    for (const highlight of paragraph.highlights) {
      const idx = remaining.indexOf(highlight);
      if (idx === -1) continue;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push({ text: highlight, highlighted: true });
      remaining = remaining.slice(idx + highlight.length);
    }
    if (remaining) parts.push(remaining);

    return parts.map((part, i) =>
      typeof part === 'string'
        ? <span key={i}>{part}</span>
        : <span key={i} className={'font-bold text-accent1'}>{part.text}</span>,
    );
  };

  return (
    <article className={'max-w-2xl mx-auto my-10'}>
      <div className={'flex flex-col gap-8'}>
        {t.paragraphs.map((paragraph, i) => (
          <p key={i} className={'text-main text-justify leading-[1.9] tracking-[0.02em]'}>
            {renderParagraph(paragraph)}
          </p>
        ))}
      </div>

      <p className={'text-lg font-bold text-accent1 mt-12 mb-8 tracking-wide leading-relaxed'}>
        {t.emphasis}
      </p>

      <div className={'flex flex-col gap-8'}>
        {t.closing.split('\n\n').map((paragraph, i) => (
          <p key={i} className={'text-main text-justify leading-[1.9] tracking-[0.02em]'}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
