import Image from 'next/image';

export default function CentersContent() {
  return (
    <div className={'flex justify-center py-10'}>
      <Image
        src={'/assets/images/center.png'}
        alt={'전국 이단상담소 위치안내'}
        width={750}
        height={900}
        className={'w-full max-w-[750px] h-auto'}
      />
    </div>
  );
}
