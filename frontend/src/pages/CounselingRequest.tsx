const CounselingRequest = () => {
  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-5xl px-4'}>
        <div className={'mb-12 flex flex-col items-start'}>
          <h2 className={'mb-2 text-3xl font-extrabold'}>{'상담 및 세미나 요청'}</h2>
          <div className={'mb-4 h-1 w-16 bg-black'} />
          <p className={'text-lg text-gray-500'}>{'상담 신청과 세미나 참여를 위한 안내입니다.'}</p>
        </div>

        <div className={'grid grid-cols-1 gap-8 lg:grid-cols-2'}>
          {/* 상담 신청 폼 */}
          <div className={'rounded-xl bg-white p-8 shadow-lg'}>
            <h3 className={'mb-6 text-2xl font-bold'}>{'상담 신청'}</h3>
            <form className={'space-y-4'}>
              <div>
                <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                  {'이름 *'}
                </label>
                <input
                  type={'text'}
                  className={'focus:ring-blue-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2'}
                  placeholder={'이름을 입력하세요'}
                />
              </div>

              <div>
                <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                  {'연락처 *'}
                </label>
                <input
                  type={'tel'}
                  className={'focus:ring-blue-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2'}
                  placeholder={'연락처를 입력하세요'}
                />
              </div>

              <div>
                <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                  {'상담 유형'}
                </label>
                <select className={'focus:ring-blue-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2'}>
                  <option>{'상담 유형을 선택하세요'}</option>
                  <option>{'신천지 피해 가족 상담'}</option>
                  <option>{'탈퇴 지원 상담'}</option>
                  <option>{'기타 이단 상담'}</option>
                </select>
              </div>

              <div>
                <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                  {'상담 내용'}
                </label>
                <textarea
                  rows={4}
                  className={'focus:ring-blue-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2'}
                  placeholder={'상담 내용을 간단히 작성해 주세요'}
                />
              </div>

              <button
                type={'submit'}
                className={'bg-blue-600 hover:bg-blue-700 w-full rounded-md px-4 py-2 text-white transition-colors'}
              >
                {'상담 신청하기'}
              </button>
            </form>
          </div>

          {/* 세미나 안내 */}
          <div className={'rounded-xl bg-white p-8 shadow-lg'}>
            <h3 className={'mb-6 text-2xl font-bold'}>{'세미나 안내'}</h3>
            <div className={'space-y-6'}>
              <div>
                <h4 className={'mb-2 font-semibold text-gray-800'}>{'정기 세미나'}</h4>
                <p className={'mb-2 text-gray-600'}>{'매월 첫째 주 토요일 오후 2시'}</p>
                <p className={'text-sm text-gray-500'}>{'이단의 특징과 대처 방법에 대한 교육'}</p>
              </div>

              <div>
                <h4 className={'mb-2 font-semibold text-gray-800'}>{'특별 세미나'}</h4>
                <p className={'mb-2 text-gray-600'}>{'분기별 개최'}</p>
                <p className={'text-sm text-gray-500'}>{'최신 이단 동향과 피해 사례 공유'}</p>
              </div>

              <div>
                <h4 className={'mb-2 font-semibold text-gray-800'}>{'참가 방법'}</h4>
                <p className={'mb-2 text-gray-600'}>{'사전 예약 필수'}</p>
                <p className={'text-sm text-gray-500'}>{'전화 또는 온라인으로 신청 가능'}</p>
              </div>

              <button className={'w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'}>
                {'세미나 신청하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingRequest;