const PastorShin = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-extrabold mb-2">신현욱 목사</h2>
          <div className="h-1 w-16 bg-black mb-4" />
          <p className="text-gray-500 text-lg">신현욱 목사님의 소개와 이단 상담 경험을 소개합니다.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">사진</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">신현욱 목사</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">학력</h4>
                  <p className="text-gray-600">신학대학원 졸업</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">경력</h4>
                  <p className="text-gray-600">20년 이상 이단 상담 경험</p>
                  <p className="text-gray-600">구리이단상담소 소장</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">전문분야</h4>
                  <p className="text-gray-600">신천지 등 이단 상담</p>
                  <p className="text-gray-600">피해자 가족 상담</p>
                  <p className="text-gray-600">탈퇴 지원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastorShin; 