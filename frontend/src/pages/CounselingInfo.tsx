const CounselingInfo = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-extrabold mb-2">상담소 안내</h2>
          <div className="h-1 w-16 bg-black mb-4" />
          <p className="text-gray-500 text-lg">상담소에 대한 정보와 찾아오시는 길을 안내해 드립니다.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">상담소 정보</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">주소</h4>
                  <p className="text-gray-600">경기도 구리시 [상세주소]</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">연락처</h4>
                  <p className="text-gray-600">031-XXX-XXXX</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">운영시간</h4>
                  <p className="text-gray-600">평일 09:00 - 18:00</p>
                  <p className="text-gray-600">토요일 09:00 - 13:00</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">찾아오시는 길</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">대중교통</h4>
                  <p className="text-gray-600">지하철 1호선 구리역 하차</p>
                  <p className="text-gray-600">버스 [노선번호] 이용</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">자가용</h4>
                  <p className="text-gray-600">주차장 이용 가능</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingInfo; 