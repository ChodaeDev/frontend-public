const WithdrawalCases = () => {
  return (
    <div className={'min-h-screen bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'}>
        <div className={'rounded-lg bg-white p-8 shadow-lg'}>
          <h1 className={'mb-8 text-center text-3xl font-bold text-gray-900'}>
            {'탈퇴사례'}
          </h1>

          <div className={'prose prose-lg max-w-none'}>
            <div className={'mb-8'}>
              <h2 className={'mb-4 text-2xl font-semibold text-gray-800'}>
                {'신천지 탈퇴 성공 사례'}
              </h2>
              <p className={'mb-6 text-gray-600'}>
                {'신천지에서 성공적으로 탈퇴한 분들의 경험담과 회복 과정을 공유합니다.'}
              </p>
            </div>

            <div className={'space-y-8'}>
              {/* 사례 1 */}
              <div className={'bg-blue-50 rounded-lg p-6'}>
                <h3 className={'text-blue-800 mb-3 text-xl font-semibold'}>
                  {'김○○님의 탈퇴 사례 (30대 여성)'}
                </h3>
                <div className={'space-y-3 text-gray-700'}>
                  <p><strong>{'가입 기간:'}</strong>{' 2년 3개월'}</p>
                  <p><strong>{'탈퇴 계기:'}</strong>{' 가족과의 갈등 심화'}</p>
                  <p><strong>{'회복 과정:'}</strong></p>
                  <ul className={'ml-4 list-inside list-disc space-y-1'}>
                    <li>{'전문 상담사와의 정기 상담'}</li>
                    <li>{'가족과의 관계 회복 프로그램 참여'}</li>
                    <li>{'새로운 취미 활동 시작'}</li>
                    <li>{'지원 그룹 활동 참여'}</li>
                  </ul>
                  <p><strong>{'현재 상태:'}</strong>{' 완전한 회복, 가족과 화해'}</p>
                </div>
              </div>

              {/* 사례 2 */}
              <div className={'rounded-lg bg-green-50 p-6'}>
                <h3 className={'mb-3 text-xl font-semibold text-green-800'}>
                  {'이○○님의 탈퇴 사례 (40대 남성)'}
                </h3>
                <div className={'space-y-3 text-gray-700'}>
                  <p><strong>{'가입 기간:'}</strong>{' 1년 8개월'}</p>
                  <p><strong>{'탈퇴 계기:'}</strong>{' 재정적 어려움과 의심'}</p>
                  <p><strong>{'회복 과정:'}</strong></p>
                  <ul className={'ml-4 list-inside list-disc space-y-1'}>
                    <li>{'경제적 회복을 위한 상담'}</li>
                    <li>{'직업 재훈련 프로그램 참여'}</li>
                    <li>{'정신 건강 전문의 치료'}</li>
                    <li>{'새로운 사회 관계 형성'}</li>
                  </ul>
                  <p><strong>{'현재 상태:'}</strong>{' 안정적인 직장 재취업, 경제적 회복'}</p>
                </div>
              </div>

              {/* 사례 3 */}
              <div className={'rounded-lg bg-purple-50 p-6'}>
                <h3 className={'mb-3 text-xl font-semibold text-purple-800'}>
                  {'박○○님의 탈퇴 사례 (20대 여성)'}
                </h3>
                <div className={'space-y-3 text-gray-700'}>
                  <p><strong>{'가입 기간:'}</strong>{' 3년 1개월'}</p>
                  <p><strong>{'탈퇴 계기:'}</strong>{' 대학 학업 중단과 미래에 대한 불안'}</p>
                  <p><strong>{'회복 과정:'}</strong></p>
                  <ul className={'ml-4 list-inside list-disc space-y-1'}>
                    <li>{'학업 복귀 지원 프로그램'}</li>
                    <li>{'청소년 전문 상담'}</li>
                    <li>{'동료 지원 그룹 참여'}</li>
                    <li>{'새로운 목표 설정 및 계획'}</li>
                  </ul>
                  <p><strong>{'현재 상태:'}</strong>{' 대학 복학, 새로운 진로 계획 수립'}</p>
                </div>
              </div>
            </div>

            <div className={'mt-8 rounded-lg bg-yellow-50 p-6'}>
              <h3 className={'mb-3 text-xl font-semibold text-yellow-800'}>
                {'탈퇴 후 회복을 위한 조언'}
              </h3>
              <ul className={'space-y-2 text-gray-700'}>
                <li>{'• 전문가의 도움을 받으세요'}</li>
                <li>{'• 가족과의 소통을 회복하세요'}</li>
                <li>{'• 새로운 목표를 설정하세요'}</li>
                <li>{'• 건강한 사회 관계를 형성하세요'}</li>
                <li>{'• 충분한 시간을 두고 회복하세요'}</li>
              </ul>
            </div>

            <div className={'mt-8 text-center'}>
              <button className={'bg-blue-600 hover:bg-blue-700 mr-4 rounded-lg px-8 py-3 font-semibold text-white transition-colors duration-200'}>
                {'상담 신청하기'}
              </button>
              <button className={'rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700'}>
                {'지원 그룹 참여하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalCases;
