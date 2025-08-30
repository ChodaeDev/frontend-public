import React from 'react';

const PreventionGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            피해예방 가이드
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                신천지 피해 예방 방법
              </h2>
              <p className="text-gray-600 mb-6">
                신천지와 관련된 피해를 예방하고 안전하게 보호받을 수 있는 방법들을 안내합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  주의해야 할 신호들
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 과도한 성경 공부 강요</li>
                  <li>• 가족과의 연락 차단 요구</li>
                  <li>• 재정적 기여 압박</li>
                  <li>• 비밀스러운 모임 참여</li>
                  <li>• 개인정보 수집 요구</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  예방 방법
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 정확한 정보 수집</li>
                  <li>• 가족과의 소통 유지</li>
                  <li>• 전문가 상담 활용</li>
                  <li>• 법적 권리 인지</li>
                  <li>• 지역사회 지원망 활용</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                긴급 연락처
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p><strong>상담 전화:</strong> 1588-1234</p>
                  <p><strong>긴급 신고:</strong> 112</p>
                </div>
                <div>
                  <p><strong>이메일:</strong> help@chodae.org</p>
                  <p><strong>카카오톡:</strong> @chodae_help</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                피해 신고 방법
              </h3>
              <p className="text-gray-700 mb-4">
                피해를 당했거나 의심스러운 상황을 발견했을 때는 즉시 신고하세요.
              </p>
              <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                <li>상황을 정확히 기록하고 증거를 보관</li>
                <li>가족이나 신뢰할 수 있는 사람에게 알림</li>
                <li>전문 상담기관에 연락</li>
                <li>필요시 법적 조치 고려</li>
              </ol>
            </div>

            <div className="text-center">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 mr-4">
                긴급 신고하기
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                상담 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventionGuide;
