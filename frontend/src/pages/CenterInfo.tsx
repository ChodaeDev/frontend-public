import { FaChevronRight } from 'react-icons/fa';

const cardData = [
  {
    title: '상담소 소개',
    description: '상담소에 대한 정보와\n찾아오시는 길을 안내해 드립니다.',
  },
  {
    title: '피해 가족 유의 사항',
    description: '피해 가족의 경우 유의하셔야될\n내용을 꼭 확인해 주세요',
  },
  {
    title: '전국 상담소 안내',
    description: '전국에 있는 상담소 위치와 정보를\n안내해 드립니다.',
  },
];

const CenterInfo = () => {
  return (
    <main className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-5xl px-4'}>
        <div className={'mb-12 flex flex-col items-start'}>
          <h2 className={'mb-2 text-3xl font-extrabold'}>{'상담소 소개'}</h2>
          <div className={'mb-4 h-1 w-16 bg-black'} />
          <p className={'text-lg text-gray-500'}>{'상담소에 대한 정보와'}<br />{'찾아오시는 길을 안내해 드립니다.'}</p>
        </div>
        <div className={'grid grid-cols-1 gap-8 md:grid-cols-3'}>
          {cardData.map((card) => (
            <div
              key={card.title}
              className={'group flex h-56 cursor-pointer flex-col justify-between rounded-xl border border-gray-100 bg-white p-8 shadow transition hover:border-gray-300 hover:shadow-lg'}
            >
              <div>
                <h3 className={'group-hover:text-blue-700 mb-2 text-2xl font-bold transition'}>{card.title}</h3>
                <p className={'whitespace-pre-line text-gray-500'}>{card.description}</p>
              </div>
              <div className={'flex justify-end'}>
                <FaChevronRight className={'group-hover:text-blue-700 text-gray-400 transition'} size={28} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CenterInfo;
