import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaYoutube, FaNewspaper, FaPlay, FaExternalLinkAlt, FaCalendarAlt, FaUserTie, FaInfoCircle, FaHandsHelping } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={'min-h-screen'}>
      {/* Hero Section */}
      <section className={'relative overflow-hidden'}>
        <div className={'mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'}>
          <div className={'text-center'}>
            <h1 className={'mb-6 text-3xl font-bold text-sub md:text-3xl'}>
              {'구리 이단상담소는 당신의 회복을 위해 기도합니다.'}
            </h1>
            <p className={'md:text-1xl mx-auto mb-8 max-w-3xl text-xl text-gray3'}>
              {'"너희 중에 어떤 사람이 양 백 마리가 있는데 그 중의 하나를 잃으면'}<br />{'아흔아홉 마리를 들에 두고 그 잃은 것을 찾아내기까지 찾아다니지 아니하겠느냐'}<br />{'또 찾아낸즉 즐거워 어깨에 메고 집에 와서 그 벗과 이웃을 불러 모으고 말하되'}<br />{'나와 함께 즐기자 나의 잃은 양을 찾아내었노라 하리라"'}<br />
              {'- 누가복음 15장 4~6절 말씀 -'}
            </p>
          </div>
        </div>
      </section>

      {/* YouTube & News Section */}
      <section className={'py-4'}>
        <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          <div className={'mb-12 text-center'}>
            <h2 className={'mb-4 text-4xl font-bold text-sub'}>{'유튜브 & 뉴스'}</h2>
            <p className={'text-xl text-gray3'}>{'최신 동영상과 뉴스를 확인하세요'}</p>
          </div>

          <div className={'grid grid-cols-1 gap-8 lg:grid-cols-2'}>
            {/* YouTube Section */}
            <div className={'rounded-2xl p-8'}>
              <div className={'mb-6 flex items-center gap-3'}>
                <FaYoutube className={'text-4xl text-red-600'} />
                <h3 className={'text-2xl font-bold text-sub'}>{'유튜브 채널'}</h3>
              </div>
              <div className={'space-y-4'}>
                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaPlay className={'text-red-600'} />
                    <h4 className={'font-bold text-sub'}>{'신천지 피해자 회복 이야기'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'신천지 피해자들의 회복 과정과 상담 사례를 다룬 동영상입니다.'}</p>
                  <a href={'https://youtu.be/nJSVB8jSn6k'} target={'_blank'} rel={'noopener noreferrer'} className={'flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700'}>
                    {'시청하기 '}<FaExternalLinkAlt />
                  </a>
                </div>

                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaPlay className={'text-red-600'} />
                    <h4 className={'font-bold text-sub'}>{'신현욱 목사 상담 강의'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'전문 상담사 신현욱 목사의 상담 기법과 노하우를 공유합니다.'}</p>
                  <a href={'https://youtu.be/esIwH0zghVA'} target={'_blank'} rel={'noopener noreferrer'} className={'flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700'}>
                    {'시청하기 '}<FaExternalLinkAlt />
                  </a>
                </div>

                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaPlay className={'text-red-600'} />
                    <h4 className={'font-bold text-sub'}>{'신천지 탈퇴자의 JTBC 뉴스 그 뒷이야기'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'신천지 탈퇴자의 JTBC 뉴스 그 뒷이야기를 담은 영상입니다.'}</p>
                  <a href={'https://youtu.be/Oy9GkdPuWno'} target={'_blank'} rel={'noopener noreferrer'} className={'flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700'}>
                    {'시청하기 '}<FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div className={'rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8'}>
              <div className={'mb-6 flex items-center gap-3'}>
                <FaNewspaper className={'text-4xl text-blue-600'} />
                <h3 className={'text-2xl font-bold text-sub'}>{'최신 뉴스'}</h3>
              </div>
              <div className={'space-y-4'}>
                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaNewspaper className={'text-blue-600'} />
                    <h4 className={'font-bold text-sub'}>{'신천지 피해자 상담소 증가'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'전국적으로 신천지 피해자 상담소가 증가하고 있다는 최신 뉴스입니다.'}</p>
                  <a href={'#'} className={'flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700'}>
                    {'기사 보기 '}<FaExternalLinkAlt />
                  </a>
                </div>

                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaNewspaper className={'text-blue-600'} />
                    <h4 className={'font-bold text-sub'}>{'상담 효과성 연구 결과'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'전문 상담을 통한 회복 효과에 대한 최신 연구 결과를 소개합니다.'}</p>
                  <a href={'#'} className={'flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700'}>
                    {'기사 보기 '}<FaExternalLinkAlt />
                  </a>
                </div>

                <div className={'rounded-lg bg-white p-4 shadow-md'}>
                  <div className={'mb-3 flex items-center gap-3'}>
                    <FaNewspaper className={'text-blue-600'} />
                    <h4 className={'font-bold text-sub'}>{'가족 지원 프로그램 확대'}</h4>
                  </div>
                  <p className={'mb-3 text-sm text-gray3'}>{'피해자 가족을 위한 지원 프로그램이 확대된다는 소식입니다.'}</p>
                  <a href={'#'} className={'flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700'}>
                    {'기사 보기 '}<FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className={'bg-gray9 py-16'}>
        <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          <div className={'mb-12 text-center'}>
            <h2 className={'mb-4 text-4xl font-bold text-sub'}>{'메인 메뉴'}</h2>
            <p className={'text-xl text-gray3'}>{'필요한 서비스를 빠르게 찾아보세요'}</p>
          </div>

          <div className={'grid grid-cols-2 gap-6 md:grid-cols-4'}>
            <div
              onClick={() => handleNavigation('/counseling-info')}
              className={'cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center transition duration-300 hover:scale-105 hover:shadow-lg'}
            >
              <div className={'mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600'}>
                <FaInfoCircle className={'text-2xl text-white'} />
              </div>
              <h3 className={'mb-2 text-lg font-bold text-sub'}>{'상담소 안내'}</h3>
              <p className={'text-sm text-gray3'}>{'위치 및 연락처'}</p>
            </div>

            <div
              onClick={() => handleNavigation('/pastor-shin')}
              className={'cursor-pointer rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center transition duration-300 hover:scale-105 hover:shadow-lg'}
            >
              <div className={'mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-600'}>
                <FaUserTie className={'text-2xl text-white'} />
              </div>
              <h3 className={'mb-2 text-lg font-bold text-sub'}>{'신현욱 목사'}</h3>
              <p className={'text-sm text-gray3'}>{'소개 및 경력'}</p>
            </div>

            <div
              onClick={() => handleNavigation('/shincheonji-info')}
              className={'cursor-pointer rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center transition duration-300 hover:scale-105 hover:shadow-lg'}
            >
              <div className={'mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-600'}>
                <FaInfoCircle className={'text-2xl text-white'} />
              </div>
              <h3 className={'mb-2 text-lg font-bold text-sub'}>{'신천지 정보'}</h3>
              <p className={'text-sm text-gray3'}>{'관련 정보'}</p>
            </div>

            <div
              onClick={() => handleNavigation('/counseling-request')}
              className={'cursor-pointer rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 text-center transition duration-300 hover:scale-105 hover:shadow-lg'}
            >
              <div className={'mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-orange-600'}>
                <FaHandsHelping className={'text-2xl text-white'} />
              </div>
              <h3 className={'mb-2 text-lg font-bold text-sub'}>{'상담 요청'}</h3>
              <p className={'text-sm text-gray3'}>{'상담 및 세미나'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Counseling Center Info Section */}
      <section className={'bg-gray9 py-16'}>
        <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          <div className={'mb-12 text-center'}>
            <h2 className={'mb-4 text-4xl font-bold text-sub'}>{'상담소 안내'}</h2>
            <p className={'text-xl text-gray3'}>{'언제든지 편안하게 방문하세요'}</p>
          </div>

          <div className={'grid grid-cols-1 gap-8 md:grid-cols-2'}>
            <div className={'rounded-2xl bg-white p-8 shadow-lg'}>
              <h3 className={'mb-6 flex items-center gap-3 text-2xl font-bold text-sub'}>
                <FaMapMarkerAlt className={'text-blue-600'} />
                {'위치 정보'}
              </h3>
              <div className={'space-y-4'}>
                <p className={'text-gray3'}>
                  <strong>{'주소:'}</strong>{' 서울특별시 강남구 테헤란로 123'}<br />
                  <strong>{'지하철:'}</strong>{' 2호선 강남역 3번 출구에서 도보 5분'}<br />
                  <strong>{'버스:'}</strong> {'강남역 정류장 하차'}
                </p>
                <div className={'rounded-lg bg-gray-100 p-4'}>
                  <p className={'text-sm text-gray3'}>
                    <strong>{'주차:'}</strong> {'건물 내 지하주차장 이용 가능 (2시간 무료)'}
                  </p>
                </div>
              </div>
            </div>

            <div className={'rounded-2xl bg-white p-8 shadow-lg'}>
              <h3 className={'mb-6 flex items-center gap-3 text-2xl font-bold text-sub'}>
                <FaClock className={'text-green-600'} />
                {'운영시간'}
              </h3>
              <div className={'space-y-4'}>
                <div className={'flex items-center justify-between border-b border-gray-200 py-2'}>
                  <span className={'font-semibold'}>{'평일'}</span>
                  <span className={'text-gray3'}>{'09:00 - 18:00'}</span>
                </div>
                <div className={'flex items-center justify-between border-b border-gray-200 py-2'}>
                  <span className={'font-semibold'}>{'토요일'}</span>
                  <span className={'text-gray3'}>{'09:00 - 13:00'}</span>
                </div>
                <div className={'flex items-center justify-between border-b border-gray-200 py-2'}>
                  <span className={'font-semibold'}>{'일요일'}</span>
                  <span className={'text-gray3'}>{'휴무'}</span>
                </div>
                <div className={'flex items-center justify-between py-2'}>
                  <span className={'font-semibold'}>{'공휴일'}</span>
                  <span className={'text-gray3'}>{'휴무'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={'mt-8 rounded-2xl bg-white p-8 shadow-lg'}>
            <h3 className={'mb-6 flex items-center gap-3 text-2xl font-bold text-sub'}>
              <FaPhone className={'text-purple-600'} />
              {'연락처'}
            </h3>
            <div className={'grid grid-cols-1 gap-6 md:grid-cols-3'}>
              <div className={'text-center'}>
                <FaPhone className={'mx-auto mb-3 text-3xl text-blue-600'} />
                <h4 className={'mb-2 font-bold text-sub'}>{'전화'}</h4>
                <p className={'text-gray3'}>{'1588-0000'}</p>
              </div>
              <div className={'text-center'}>
                <FaEnvelope className={'mx-auto mb-3 text-3xl text-green-600'} />
                <h4 className={'mb-2 font-bold text-sub'}>{'이메일'}</h4>
                <p className={'text-gray3'}>{'info@chodae-recovery.com'}</p>
              </div>
              <div className={'text-center'}>
                <FaCalendarAlt className={'mx-auto mb-3 text-3xl text-purple-600'} />
                <h4 className={'mb-2 font-bold text-sub'}>{'예약'}</h4>
                <p className={'text-gray3'}>{'온라인 예약 가능'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={'bg-gradient-to-r from-blue-600 to-purple-600 py-20'}>
        <div className={'mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'}>
          <h2 className={'mb-6 text-4xl font-bold text-white'}>{'지금 바로 상담을 시작하세요'}</h2>
          <p className={'mb-8 text-xl text-blue-100'}>
            {'전문적인 도움을 받아 새로운 삶을 시작할 수 있습니다. '}
            {'언제든지 연락주세요.'}
          </p>
          <div className={'flex flex-col justify-center gap-4 sm:flex-row'}>
            <button
              onClick={() => handleNavigation('/counseling-request')}
              className={'rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition duration-300 hover:scale-105 hover:bg-gray-100'}
            >
              {'무료 상담 신청'}
            </button>
            <button className={'rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:bg-white hover:text-blue-600'}>
              {'전화 상담: 1588-0000'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={'bg-slate-900 py-12'}>
        <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          <div className={'grid grid-cols-1 gap-8 md:grid-cols-3'}>
            <div>
              <h3 className={'mb-4 text-xl font-bold text-white'}>{'초대회복상담소'}</h3>
              <p className={'text-gray-400'}>
                {'전문적인 상담 서비스로 여러분의 회복을 돕습니다.'}
              </p>
            </div>
            <div>
              <h3 className={'mb-4 text-xl font-bold text-white'}>{'연락처'}</h3>
              <p className={'text-gray-400'}>{'전화: 1588-0000'}</p>
              <p className={'text-gray-400'}>{'이메일: info@chodae-recovery.com'}</p>
            </div>
            <div>
              <h3 className={'mb-4 text-xl font-bold text-white'}>{'운영시간'}</h3>
              <p className={'text-gray-400'}>{'평일: 09:00 - 18:00'}</p>
              <p className={'text-gray-400'}>{'토요일: 09:00 - 13:00'}</p>
            </div>
          </div>
          <div className={'mt-8 border-t border-gray-800 pt-8 text-center text-gray-400'}>
            <p>{'© 2024 초대회복상담소. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;