'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';

interface HistoryParagraph {
  text: string;
  highlights?: string[];
}

interface HistoryTextSection {
  heading: string;
  paragraphs: HistoryParagraph[];
}

interface TimelineEntry {
  year: string;
  items: string[];
}

interface TimelineSection {
  title: string;
  description?: string;
  timeline: TimelineEntry[];
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => setRatio(e.intersectionRatio),
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: '-20% 0px -20% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const progress = Math.min(ratio * 2.5, 1);
  const yearColor = `color-mix(in srgb, var(--color-accent1) ${ progress * 100 }%, var(--color-gray7))`;
  const textColor = `color-mix(in srgb, var(--color-main) ${ progress * 100 }%, var(--color-gray7))`;

  return (
    <div ref={ref} className={'relative mb-8 last:mb-0'}>
      <div className={'absolute left-[-21.5px] md:left-[-29.5px] top-2'}>
        <span
          className={'block size-2.5 rounded-full ring-4 ring-background transition-colors duration-300'}
          style={{ backgroundColor: yearColor }}
        />
      </div>

      <span className={'text-sm font-bold transition-colors duration-300'} style={{ color: yearColor }}>
        {entry.year}
      </span>

      <div className={'mt-1'}>
        {entry.items.map((item, j) => (
          <p key={j} className={'text-sm leading-relaxed transition-colors duration-300'} style={{ color: textColor }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function renderParagraph(paragraph: HistoryParagraph) {
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
}

export default function HistoryContent() {
  const { dictionary } = useTranslation();
  const t = dictionary.historyContent as {
    intro: string;
    textSections: HistoryTextSection[];
    timelineSections: TimelineSection[];
  };

  return (
    <article className={'max-w-2xl mx-auto my-10'}>
      {/* 인트로 */}
      {t.intro && (
        <p className={'text-main text-justify leading-[1.9] tracking-[0.02em] mb-10'}>
          {t.intro}
        </p>
      )}

      {/* 본문 섹션들 */}
      <div className={'flex flex-col gap-10'}>
        {t.textSections.map((section, i) => (
          <div key={i}>
            {i === 0 && (
              <div className={'flex justify-center mb-8'}>
                <Image
                  src={'/assets/images/scj-info/scj-history.jpeg'}
                  alt={section.heading}
                  width={750}
                  height={500}
                  className={'w-full max-w-[750px] h-auto rounded-lg'}
                />
              </div>
            )}
            <h3 className={'text-lg font-bold text-main mb-4'}>{section.heading}</h3>
            <div className={'flex flex-col gap-6'}>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j} className={'text-main text-justify leading-[1.9] tracking-[0.02em]'}>
                  {renderParagraph(paragraph)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 타임라인 섹션들 */}
      <div className={'flex flex-col gap-16 mt-16'}>
        {t.timelineSections.map((section, i) => (
          <div key={i}>
            <h3 className={'text-lg font-bold text-main mb-2'}>{section.title}</h3>
            {section.description && (
              <p className={'text-sm text-gray3 mb-6'}>{section.description}</p>
            )}

            <div className={'relative pl-8 md:pl-12'}>
              <div className={'absolute left-[15px] md:left-[23px] top-2 bottom-2 w-px bg-gray7'} />
              {section.timeline.map((entry, j) => (
                <TimelineItem key={j} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
