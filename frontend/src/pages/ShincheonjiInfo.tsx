const ShincheonjiInfo = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-extrabold mb-2">신천지 정보</h2>
          <div className="h-1 w-16 bg-black mb-4" />
          <p className="text-gray-500 text-lg">신천지에 대한 기본 정보와 특징을 안내합니다.</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">신천지 개요</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                신천지예수교 증거장막성전(新天地예수교 證據帳幕聖殿)은 1984년 이만희에 의해 설립된 종교 단체입니다.
              </p>
              <p className="text-gray-600">
                현재 한국기독교총연합회(한기총)에서 이단으로 분류하고 있습니다.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">주요 특징</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">교리적 특징</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 계시록 해석의 독특성</li>
                  <li>• 이만희를 재림주로 주장</li>
                  <li>• 144,000명의 구원관</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">조직적 특징</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 엄격한 계급 조직</li>
                  <li>• 집단 생활 강조</li>
                  <li>• 가족과의 단절 요구</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">피해 사례</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                많은 가족들이 신천지에 빠진 가족 구성원으로 인해 고통받고 있습니다.
              </p>
              <p className="text-gray-600">
                상담소에서는 이러한 피해 가족들을 위한 전문적인 상담과 지원을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShincheonjiInfo; 