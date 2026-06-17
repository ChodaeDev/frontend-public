import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LeftSubMenuNav from '@/components/ui/LeftSubMenuNav';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SubMenuBoardDetail from '@/components/board/SubMenuBoardDetail';
import SubMenuBoardForm from '@/components/board/SubMenuBoardForm';

const subMenuBoardRoutes: Record<string, readonly string[]> = {
  'scj-info': ['history', 'details', 'strategy', 'illegal-cases'],
  doctrine: ['references', 'legal'],
  prevention: ['resources'],
  withdrawal: ['damage-cases'],
};

export default async function SubMenuBoardActionPage({
  params,
}: {
  params: Promise<{ locale: string; mainMenu: string; subMenu: string; boardPath: string[] }>;
}) {
  const { locale, mainMenu, subMenu, boardPath } = await params;

  if (!isValidLocale(locale) || !subMenuBoardRoutes[mainMenu]?.includes(subMenu)) {
    notFound();
  }

  const isWrite = boardPath.length === 1 && boardPath[0] === 'write';
  const isDetail = boardPath.length === 1 && !Number.isNaN(Number(boardPath[0]));
  const isEdit = boardPath.length === 2 && !Number.isNaN(Number(boardPath[0])) && boardPath[1] === 'edit';

  if (!isWrite && !isDetail && !isEdit) {
    notFound();
  }

  const postId = isDetail || isEdit ? Number(boardPath[0]) : undefined;
  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const navItem = navItems.find((item) => item.slug === mainMenu);
  const subItem = navItem?.subMenus?.find((s) => s.slug === subMenu);

  if (!navItem || !subItem) notFound();

  const commonDict = dictionary.common as { home: string };
  const boardDict = dictionary.board as {
    write?: string;
    edit?: string;
    post?: string;
    backToList?: string;
  };
  const boardHref = `/${ locale }/${ mainMenu }/${ subMenu }`;
  const title = isWrite
    ? (boardDict.write || '글쓰기')
    : isEdit
      ? (boardDict.edit || '수정')
      : (boardDict.post || '게시글');

  return (
    <div className={'flex py-8 min-h-screen'}>
      <LeftSubMenuNav
        navItem={navItem}
        currentSubSlug={subMenu}
        locale={locale}
      />

      <div className={'w-full flex-col gap-10'}>
        <div className={'flex flex-col sm:flex-row-reverse sm:items-start sm:justify-between gap-4 mb-8'}>
          <Breadcrumb
            locale={locale}
            homeLabel={commonDict.home || '홈'}
            items={[
              { label: navItem.label, href: `/${ locale }/${ mainMenu }` },
              { label: subItem.label, href: boardHref },
              ...(isEdit && postId ? [{ label: boardDict.post || '게시글', href: `${ boardHref }/${ postId }` }] : []),
              { label: title },
            ]}
          />

          {isDetail ? (
            <Link
              href={boardHref}
              className={'inline-flex items-center gap-1.5 text-sm text-sub hover:text-main transition-colors'}
            >
              <ArrowLeft className={'size-4'} />
              {boardDict.backToList || '목록으로'}
            </Link>
          ) : (
            <div>
              <h1 className={'text-2xl font-bold text-gray1'}>{title}</h1>
              {subItem.description && (
                <p className={'text-sm text-gray3 mt-1'}>{subItem.description}</p>
              )}
            </div>
          )}
        </div>

        <div className={'flex-1 min-w-0'}>
          {isDetail && postId && (
            <SubMenuBoardDetail
              locale={locale}
              route={{ mainMenu, subMenu }}
              postId={postId}
            />
          )}
          {isWrite && (
            <SubMenuBoardForm
              locale={locale}
              route={{ mainMenu, subMenu }}
              mode={'write'}
            />
          )}
          {isEdit && postId && (
            <SubMenuBoardForm
              locale={locale}
              route={{ mainMenu, subMenu }}
              mode={'edit'}
              postId={postId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
