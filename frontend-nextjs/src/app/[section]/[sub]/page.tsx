import { notFound } from 'next/navigation';
import { navItems } from '@/config/navigation';

export function generateStaticParams() {
  return navItems
    .filter((item) => item.subMenus)
    .flatMap((item) =>
      item.subMenus!.map((sub) => ({
        section: item.slug,
        sub: sub.slug,
      })),
    );
}

export default async function SubPage({
  params,
}: {
  params: Promise<{ section: string; sub: string }>;
}) {
  const { section, sub } = await params;
  const navItem = navItems.find((item) => item.slug === section);
  const subItem = navItem?.subMenus?.find((s) => s.slug === sub);

  if (!navItem || !subItem) notFound();

  return (
    <div className={'py-8'}>
      <p className={'text-sm text-sub mb-2'}>
        {navItem.label}
      </p>
      <h1 className={'text-2xl font-bold text-main'}>
        {subItem.label}
      </h1>
    </div>
  );
}
