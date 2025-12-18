const PreventionGuide = () => {
  return (
    <div className={'min-h-screen bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'}>
        <div className={'rounded-lg bg-white p-8 shadow-lg'}>
          <h1 className={'mb-8 text-center text-3xl font-bold text-gray-900'}>
            {'피해예방 가이드'}
          </h1>

          <div className={'prose prose-lg max-w-none'}>
            <div className={'mb-8'}>
              <h2 className={'mb-4 text-2xl font-semibold text-gray-800'}>
                {'신천지 피해 예방 방법'}
              </h2>
              <p className={'mb-6 text-gray-600'}>
                {'신천지와 관련된 피해를 예방하고 안전하게 보호받을 수 있는 방법들을 안내합니다.'}
              </p>
            </div>

            <div className={'mb-8 grid gap-8 md:grid-cols-2'}>
              <div className={'rounded-lg bg-red-50 p-6'}>
                <h3 className={'mb-3 text-xl font-semibold text-red-800'}>
                  {'주의해야 할 신호들'}
                </h3>
                <ul className={'space-y-2 text-gray-700'}>
                  <li>{'• 과도한 성경 공부 강요'}</li>
                  <li>{'• 가족과의 연락 차단 요구'}</li>
                  <li>{'• 재정적 기여 압박'}</li>
                  <li>{'• 비밀스러운 모임 참여'}</li>
                  <li>{'• 개인정보 수집 요구'}</li>
                </ul>
              </div>

              <div className={'rounded-lg bg-green-50 p-6'}>
                <h3 className={'mb-3 text-xl font-semibold text-green-800'}>
                  {'예방 방법'}
                </h3>
                <ul className={'space-y-2 text-gray-700'}>
                  <li>{'• 정확한 정보 수집'}</li>
                  <li>{'• 가족과의 소통 유지'}</li>
                  <li>{'• 전문가 상담 활용'}</li>
                  <li>{'• 법적 권리 인지'}</li>
                  <li>{'• 지역사회 지원망 활용'}</li>
                </ul>
              </div>
            </div>

            <div className={'mb-8 rounded-lg bg-blue-50 p-6'}>
              <h3 className={'mb-3 text-xl font-semibold text-blue-800'}>
                {'긴급 연락처'}
              </h3>
              <div className={'grid gap-4 text-gray-700 md:grid-cols-2'}>
                <div>
                  <p><strong>{'상담 전화:'}</strong>{' 1588-1234'}</p>
                  <p><strong>{'긴급 신고:'}</strong>{' 112'}</p>
                </div>
                <div>
                  <p><strong>{'이메일:'}</strong>{' help@chodae.org'}</p>
                  <p><strong>{'카카오톡:'}</strong>{' @chodae_help'}</p>
                </div>
              </div>
            </div>

            <div className={'mb-8 rounded-lg bg-yellow-50 p-6'}>
              <h3 className={'mb-3 text-xl font-semibold text-yellow-800'}>
                {'피해 신고 방법'}
              </h3>
              <p className={'mb-4 text-gray-700'}>
                {'피해를 당했거나 의심스러운 상황을 발견했을 때는 즉시 신고하세요.'}
              </p>
              <ol className={'list-inside list-decimal space-y-2 text-gray-700'}>
                <li>{'상황을 정확히 기록하고 증거를 보관'}</li>
                <li>{'가족이나 신뢰할 수 있는 사람에게 알림'}</li>
                <li>{'전문 상담기관에 연락'}</li>
                <li>{'필요시 법적 조치 고려'}</li>
              </ol>
            </div>

            <div className={'text-center'}>
              <button className={'mr-4 rounded-lg bg-red-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-700'}>
                {'긴급 신고하기'}
              </button>
              <button className={'rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700'}>
                {'상담 예약하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventionGuide;
