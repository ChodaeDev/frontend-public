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

const MainView = () => {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-extrabold mb-2">상담소 소개</h2>
          <div className="h-1 w-16 bg-black mb-4" />
          <p className="text-gray-500 text-lg">상담소에 대한 정보와<br/>찾아오시는 길을 안내해 드립니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardData.map((card, idx) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow p-8 flex flex-col h-56 justify-between group hover:shadow-lg transition cursor-pointer border border-gray-100 hover:border-gray-300"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-700 transition">{card.title}</h3>
                <p className="text-gray-500 whitespace-pre-line">{card.description}</p>
              </div>
              <div className="flex justify-end">
                <FaChevronRight className="text-gray-400 group-hover:text-blue-700 transition" size={28} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainView;
