const Counsult = () => {
  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-5xl px-4'}>
        <div className={'mb-12 flex flex-col items-start'}>
          <h2 className={'mb-2 text-3xl font-extrabold'}>{'상담소 안내'}</h2>
          <div className={'mb-4 h-1 w-16 bg-black'} />
          <p className={'text-lg text-gray-500'}>{'상담소에 대한 정보와 찾아오시는 길을 안내해 드립니다.'}</p>
        </div>

        <div className={'rounded-xl bg-white p-8 shadow-lg'}>
          <div className={'grid grid-cols-1 gap-8 md:grid-cols-2'}>
            <div>
              <h3 className={'mb-4 text-2xl font-bold'}>{'상담소 정보'}</h3>
              <div className={'space-y-4'}>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'주소'}</h4>
                  <p className={'text-gray-600'}>{'경기도 구리시 [상세주소]'}</p>
                </div>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'연락처'}</h4>
                  <p className={'text-gray-600'}>{'031-XXX-XXXX'}</p>
                </div>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'운영시간'}</h4>
                  <p className={'text-gray-600'}>{'평일 09:00 - 18:00'}</p>
                  <p className={'text-gray-600'}>{'토요일 09:00 - 13:00'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={'mb-4 text-2xl font-bold'}>{'찾아오시는 길'}</h3>
              <div className={'space-y-4'}>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'대중교통'}</h4>
                  <p className={'text-gray-600'}>{'지하철 1호선 구리역 하차'}</p>
                  <p className={'text-gray-600'}>{'버스 [노선번호] 이용'}</p>
                </div>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'자가용'}</h4>
                  <p className={'text-gray-600'}>{'주차장 이용 가능'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counsult;