const Ministry = () => {
  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-5xl px-4'}>
        <div className={'mb-12 flex flex-col items-start'}>
          <h2 className={'mb-2 text-3xl font-extrabold'}>{'신현욱 목사'}</h2>
          <div className={'mb-4 h-1 w-16 bg-black'} />
          <p className={'text-lg text-gray-500'}>{'신현욱 목사님의 소개와 이단 상담 경험을 소개합니다.'}</p>
        </div>

        <div className={'rounded-xl bg-white p-8 shadow-lg'}>
          <div className={'grid grid-cols-1 gap-8 md:grid-cols-3'}>
            <div className={'md:col-span-1'}>
              <div className={'flex h-64 items-center justify-center rounded-lg bg-gray-200'}>
                <span className={'text-gray-500'}>{'사진'}</span>
              </div>
            </div>

            <div className={'md:col-span-2'}>
              <h3 className={'mb-4 text-2xl font-bold'}>{'신현욱 목사'}</h3>
              <div className={'space-y-4'}>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'학력'}</h4>
                  <p className={'text-gray-600'}>{'신학대학원 졸업'}</p>
                </div>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'경력'}</h4>
                  <p className={'text-gray-600'}>{'20년 이상 이단 상담 경험'}</p>
                  <p className={'text-gray-600'}>{'구리이단상담소 소장'}</p>
                </div>
                <div>
                  <h4 className={'font-semibold text-gray-800'}>{'전문분야'}</h4>
                  <p className={'text-gray-600'}>{'신천지 등 이단 상담'}</p>
                  <p className={'text-gray-600'}>{'피해자 가족 상담'}</p>
                  <p className={'text-gray-600'}>{'탈퇴 지원'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ministry;