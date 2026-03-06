import Link from 'next/link';
import { notFound } from 'next/navigation';
import { navItems } from '@/config/navigation';
import { ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return navItems
    .filter((item) => item.slug !== '' && item.subMenus)
    .map((item) => ({ section: item.slug }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const navItem = navItems.find((item) => item.slug === section);

  if (!navItem?.subMenus) notFound();

  return (
    <div className={'py-8'}>
      <h1 className={'font-bold text-sub mb-6'}>{navItem.label}</h1>
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'}>
        {navItem.subMenus.map((sub) => (
          <Link
            key={sub.slug}
            href={`/${ section }/${ sub.slug }`}
            className={'group flex flex-col'}
          >
            <div className={'flex items-center justify-between text-main group-hover:text-accent1 transition-colors pb-2 border-b-2 border-gray6'}>
              <h2 className={'w-full text-2xl font-bold'}>
                {sub.label}
              </h2>
              <ChevronRight className={'size-6'} />
            </div>
            {sub.description && (
              <p className={'mt-2 text-sm text-gray2 whitespace-pre-line'}>
                {sub.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
