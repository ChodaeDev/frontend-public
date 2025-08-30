import { FaHeart, FaUsers, FaHandshake, FaLightbulb, FaArrowRight, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaYoutube, FaNewspaper, FaPlay, FaExternalLinkAlt, FaCalendarAlt, FaUserTie, FaInfoCircle, FaHandsHelping } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-6">
                구리 이단상담소는 당신의 회복을 위해 기도합니다.
            </h1>
            <p className="text-xl md:text-1xl text-gray-600 mb-8 max-w-3xl mx-auto">
              "너희 중에 어떤 사람이 양 백 마리가 있는데 그 중의 하나를 잃으면<br></br>아흔아홉 마리를 들에 두고 그 잃은 것을 찾아내기까지 찾아다니지 아니하겠느냐<br></br>또 찾아낸즉 즐거워 어깨에 메고 집에 와서 그 벗과 이웃을 불러 모으고 말하되<br></br>나와 함께 즐기자 나의 잃은 양을 찾아내었노라 하리라"<br></br>
              - 누가복음 15장 4~6절 말씀 -
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <FaHeart className="text-red-400 text-4xl" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <FaStar className="text-yellow-400 text-3xl" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <FaStar className="text-purple-400 text-2xl" />
        </div>
      </section>

             {/* YouTube & News Section */}
       <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">유튜브 & 뉴스</h2>
            <p className="text-xl text-gray-600">최신 동영상과 뉴스를 확인하세요</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* YouTube Section */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <FaYoutube className="text-4xl text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">유튜브 채널</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaPlay className="text-red-600" />
                    <h4 className="font-bold text-gray-900">신천지 피해자 회복 이야기</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">신천지 피해자들의 회복 과정과 상담 사례를 다룬 동영상입니다.</p>
                  <a href="https://youtu.be/nJSVB8jSn6k" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                    시청하기 <FaExternalLinkAlt />
                  </a>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaPlay className="text-red-600" />
                    <h4 className="font-bold text-gray-900">신현욱 목사 상담 강의</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">전문 상담사 신현욱 목사의 상담 기법과 노하우를 공유합니다.</p>
                  <a href="https://youtu.be/esIwH0zghVA" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                    시청하기 <FaExternalLinkAlt />
                  </a>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaPlay className="text-red-600" />
                    <h4 className="font-bold text-gray-900">신천지 탈퇴자의 JTBC 뉴스 그 뒷이야기</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">신천지 탈퇴자의 JTBC 뉴스 그 뒷이야기를 담은 영상입니다.</p>
                  <a href="https://youtu.be/Oy9GkdPuWno" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                    시청하기 <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
            
            {/* News Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <FaNewspaper className="text-4xl text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">최신 뉴스</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaNewspaper className="text-blue-600" />
                    <h4 className="font-bold text-gray-900">신천지 피해자 상담소 증가</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">전국적으로 신천지 피해자 상담소가 증가하고 있다는 최신 뉴스입니다.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    기사 보기 <FaExternalLinkAlt />
                  </a>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaNewspaper className="text-blue-600" />
                    <h4 className="font-bold text-gray-900">상담 효과성 연구 결과</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">전문 상담을 통한 회복 효과에 대한 최신 연구 결과를 소개합니다.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    기사 보기 <FaExternalLinkAlt />
                  </a>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <FaNewspaper className="text-blue-600" />
                    <h4 className="font-bold text-gray-900">가족 지원 프로그램 확대</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">피해자 가족을 위한 지원 프로그램이 확대된다는 소식입니다.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    기사 보기 <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">메인 메뉴</h2>
            <p className="text-xl text-gray-600">필요한 서비스를 빠르게 찾아보세요</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              onClick={() => handleNavigation('/counseling-info')}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">상담소 안내</h3>
              <p className="text-sm text-gray-600">위치 및 연락처</p>
            </div>
            
            <div 
              onClick={() => handleNavigation('/pastor-shin')}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">신현욱 목사</h3>
              <p className="text-sm text-gray-600">소개 및 경력</p>
            </div>
            
            <div 
              onClick={() => handleNavigation('/shincheonji-info')}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">신천지 정보</h3>
              <p className="text-sm text-gray-600">관련 정보</p>
            </div>
            
            <div 
              onClick={() => handleNavigation('/counseling-request')}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandsHelping className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">상담 요청</h3>
              <p className="text-sm text-gray-600">상담 및 세미나</p>
            </div>
          </div>
        </div>
      </section>

      {/* Counseling Center Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">상담소 안내</h2>
            <p className="text-xl text-gray-600">언제든지 편안하게 방문하세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600" />
                위치 정보
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <strong>주소:</strong> 서울특별시 강남구 테헤란로 123<br />
                  <strong>지하철:</strong> 2호선 강남역 3번 출구에서 도보 5분<br />
                  <strong>버스:</strong> 강남역 정류장 하차
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>주차:</strong> 건물 내 지하주차장 이용 가능 (2시간 무료)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaClock className="text-green-600" />
                운영시간
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold">평일</span>
                  <span className="text-gray-600">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold">토요일</span>
                  <span className="text-gray-600">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold">일요일</span>
                  <span className="text-gray-600">휴무</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">공휴일</span>
                  <span className="text-gray-600">휴무</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaPhone className="text-purple-600" />
              연락처
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FaPhone className="text-3xl text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">전화</h4>
                <p className="text-gray-600">1588-0000</p>
              </div>
              <div className="text-center">
                <FaEnvelope className="text-3xl text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">이메일</h4>
                <p className="text-gray-600">info@chodae-recovery.com</p>
              </div>
              <div className="text-center">
                <FaCalendarAlt className="text-3xl text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">예약</h4>
                <p className="text-gray-600">온라인 예약 가능</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">지금 바로 상담을 시작하세요</h2>
          <p className="text-xl text-blue-100 mb-8">
            전문적인 도움을 받아 새로운 삶을 시작할 수 있습니다. 
            언제든지 연락주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleNavigation('/counseling-request')}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              무료 상담 신청
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition duration-300">
              전화 상담: 1588-0000
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">초대회복상담소</h3>
              <p className="text-gray-400">
                전문적인 상담 서비스로 여러분의 회복을 돕습니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">연락처</h3>
              <p className="text-gray-400">전화: 1588-0000</p>
              <p className="text-gray-400">이메일: info@chodae-recovery.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">운영시간</h3>
              <p className="text-gray-400">평일: 09:00 - 18:00</p>
              <p className="text-gray-400">토요일: 09:00 - 13:00</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 초대회복상담소. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 