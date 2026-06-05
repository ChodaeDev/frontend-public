import Link from 'next/link';
import { Home } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div className={'flex min-h-screen flex-col items-center justify-center gap-6 text-center'}>
      <div className={'flex flex-col items-center gap-2'}>
        <span className={'text-[120px] font-black leading-none text-gray7 select-none'}>{'404'}</span>
        <p className={'text-xl font-semibold text-main'}>{'페이지를 찾을 수 없습니다'}</p>
        <p className={'text-sm text-sub'}>
          {'요청하신 페이지가 존재하지 않거나 이동되었습니다.'}
        </p>
      </div>

      <Link
        href={'/ko'}
        className={'inline-flex items-center gap-2 rounded-lg bg-accent1 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent1/90'}
      >
        <Home className={'size-4'} />
        {'홈으로'}
      </Link>
    </div>
  );
}
