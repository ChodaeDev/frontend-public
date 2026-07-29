'use client';

import Image from 'next/image';
import { useTranslation } from '@/i18n/client';

interface MethodItem {
  title: string;
  description: string;
}

interface MethodSection {
  heading: string;
  items: MethodItem[];
}

export default function MethodsContent() {
  const { dictionary, locale } = useTranslation();
  const t = dictionary.methodsContent as {
    imageAlt: string;
    sections: MethodSection[];
  };

  const imageSrc = locale === 'ko'
    ? '/assets/images/withdrawal-methods-ko.png'
    : '/assets/images/withdrawal-methods-en.png';

  return (
    <div className={'py-10'}>
      <div className={'flex justify-center'}>
        <Image
          src={imageSrc}
          alt={t.imageAlt || '지혜로운 탈퇴방법'}
          width={750}
          height={900}
          className={'w-full max-w-[750px] h-auto'}
        />
      </div>

      <div className={'tiptap text-main max-w-2xl mx-auto mt-12'}>
        {t.sections.map((section, i) => (
          <div key={i}>
            <h3>{section.heading}</h3>
            <ul>
              {section.items.map((item, j) => (
                <li key={j}>
                  <strong>{item.title}</strong>
                  <br />
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
