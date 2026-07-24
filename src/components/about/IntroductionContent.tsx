'use client';

import { useTranslation } from '@/i18n/client';

interface IntroParagraph {
  text: string;
  highlights?: string[];
}

export default function IntroductionContent() {
  const { dictionary } = useTranslation();
  const t = dictionary.introduction as {
    greeting: string;
    paragraphs: IntroParagraph[];
    closing: string;
  };

  const renderParagraph = (paragraph: IntroParagraph) => {
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
    <article className={'max-w-2xl my-10'}>
      <p className={'text-lg font-bold text-accent1 mb-10 tracking-wide leading-relaxed'}>
        {t.greeting}
      </p>

      <div className={'flex flex-col gap-8'}>
        {t.paragraphs.map((paragraph, i) => (
          <p key={i} className={'text-main text-justify leading-[1.9] tracking-[0.02em]'}>
            {renderParagraph(paragraph)}
          </p>
        ))}
      </div>

      <p className={'text-accent1 leading-[1.9] tracking-[0.02em] mt-12 text-right'}>
        {t.closing}
      </p>
    </article>
  );
}
