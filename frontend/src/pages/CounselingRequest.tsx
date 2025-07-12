const CounselingRequest = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-extrabold mb-2">상담 및 세미나 요청</h2>
          <div className="h-1 w-16 bg-black mb-4" />
          <p className="text-gray-500 text-lg">상담 신청과 세미나 참여를 위한 안내입니다.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상담 신청 폼 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">상담 신청</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="연락처를 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 유형
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>상담 유형을 선택하세요</option>
                  <option>신천지 피해 가족 상담</option>
                  <option>탈퇴 지원 상담</option>
                  <option>기타 이단 상담</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 내용
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상담 내용을 간단히 작성해 주세요"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                상담 신청하기
              </button>
            </form>
          </div>
          
          {/* 세미나 안내 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">세미나 안내</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">정기 세미나</h4>
                <p className="text-gray-600 mb-2">매월 첫째 주 토요일 오후 2시</p>
                <p className="text-sm text-gray-500">이단의 특징과 대처 방법에 대한 교육</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">특별 세미나</h4>
                <p className="text-gray-600 mb-2">분기별 개최</p>
                <p className="text-sm text-gray-500">최신 이단 동향과 피해 사례 공유</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">참가 방법</h4>
                <p className="text-gray-600 mb-2">사전 예약 필수</p>
                <p className="text-sm text-gray-500">전화 또는 온라인으로 신청 가능</p>
              </div>
              
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                세미나 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingRequest; 