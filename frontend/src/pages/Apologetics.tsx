import React, { useState, useMemo } from 'react';
import { FaBook, FaGraduationCap, FaClipboardCheck, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaLightbulb, FaHandshake, FaCertificate, FaSearch, FaFilter, FaEye, FaDownload, FaCalendarAlt, FaUser } from 'react-icons/fa';

const Apologetics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 교리 반증 항목 데이터
  const doctrineItems = [
    {
      id: 1,
      title: '신천지 기본 교리와 창립 배경',
      author: '신현욱 목사',
      date: '2024-01-15',
      views: 1250,
      status: '완료',
      category: '기본교리',
      description: '신천지의 핵심 교리와 가르침에 대한 이해',
      icon: FaBook,
      color: 'blue',
      details: [
        '신천지의 창립 배경과 역사',
        '이만희의 신격화 과정',
        '성경 해석의 왜곡',
        '구원관의 문제점',
      ],
    },
    {
      id: 2,
      title: '성경 해석 방법론과 그 문제점',
      author: '김철수 박사',
      date: '2024-01-20',
      views: 890,
      status: '진행중',
      category: '성경해석',
      description: '신천지의 성경 해석 방식과 그 문제점',
      icon: FaGraduationCap,
      color: 'green',
      details: [
        '비유 해석의 오류',
        '성경 문맥 무시',
        '자의적 해석 방법',
        '정통 신학과의 차이점',
      ],
    },
    {
      id: 3,
      title: '신천지 특별 가르침 분석',
      author: '이영희 교수',
      date: '2024-01-25',
      views: 650,
      status: '대기',
      category: '특별가르침',
      description: '신천지만의 독특한 교리와 가르침',
      icon: FaLightbulb,
      color: 'purple',
      details: [
        '144,000명의 개념',
        '이만희의 신격화',
        '신천지만의 구원관',
        '세계 통일 정부론',
      ],
    },
    {
      id: 4,
      title: '교리 반증 실습 및 평가 과정',
      author: '박민수 상담사',
      date: '2024-02-01',
      views: 420,
      status: '대기',
      category: '실습평가',
      description: '교리 반증을 위한 실습 과정과 평가',
      icon: FaClipboardCheck,
      color: 'orange',
      details: [
        '교리 반증 시험',
        '면접 평가',
        '실제 사례 분석',
        '반증서 발급 과정',
      ],
    },
    {
      id: 5,
      title: '신천지 탈퇴자 생생 증언',
      author: '탈퇴자 A씨',
      date: '2024-02-05',
      views: 2100,
      status: '완료',
      category: '탈퇴증언',
      description: '신천지 탈퇴자들의 생생한 증언',
      icon: FaHandshake,
      color: 'red',
      details: [
        '탈퇴 동기와 과정',
        '피해 경험담',
        '회복 과정',
        '경고 메시지',
      ],
    },
    {
      id: 6,
      title: '전문가들의 신천지 교리 분석',
      author: '종교학자 협회',
      date: '2024-02-10',
      views: 780,
      status: '진행중',
      category: '전문분석',
      description: '종교학자와 전문가들의 분석',
      icon: FaCertificate,
      color: 'indigo',
      details: [
        '신학적 분석',
        '심리학적 접근',
        '사회학적 관점',
        '법적 문제점',
      ],
    },
    {
      id: 7,
      title: '신천지 교리와 정통 기독교 비교',
      author: '신학연구소',
      date: '2024-02-15',
      views: 950,
      status: '완료',
      category: '비교분석',
      description: '신천지 교리와 정통 기독교의 차이점',
      icon: FaBook,
      color: 'blue',
      details: [
        '삼위일체 교리 비교',
        '구원론의 차이',
        '교회관의 차이',
        '성경관의 차이',
      ],
    },
    {
      id: 8,
      title: '신천지 피해자 가족 상담 사례',
      author: '가족상담센터',
      date: '2024-02-20',
      views: 680,
      status: '진행중',
      category: '상담사례',
      description: '신천지 피해자 가족들의 상담 사례',
      icon: FaHandshake,
      color: 'green',
      details: [
        '가족 갈등 해결',
        '의사소통 개선',
        '치유 과정',
        '재발 방지',
      ],
    },
  ];

  // 검색 및 필터링된 항목들
  const filteredItems = useMemo(() => {
    return doctrineItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
                           || item.author.toLowerCase().includes(searchTerm.toLowerCase())
                           || item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-800';
      case '진행중':
        return 'bg-blue-100 text-blue-800';
      case '대기':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '완료':
        return <FaCheckCircle className={'text-green-600'} />;
      case '진행중':
        return <FaQuestionCircle className={'text-blue-600'} />;
      case '대기':
        return <FaExclamationTriangle className={'text-yellow-600'} />;
      default:
        return <FaTimesCircle className={'text-gray-600'} />;
    }
  };

  return (
    <div className={'min-h-screen bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
        {/* 헤더 섹션 */}
        <div className={'mb-8 text-center'}>
          <h1 className={'mb-4 text-4xl font-bold text-gray-900'}>
            {'교리반증 자료실'}
          </h1>
          <p className={'mx-auto max-w-3xl text-xl text-gray-600'}>
            {'신천지의 교리와 가르침을 정확히 파악하고 반증하는 자료들을 검색하고 열람할 수 있습니다.'}
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className={'mb-6 rounded-lg bg-white p-6 shadow-md'}>
          <div className={'flex flex-col gap-4 md:flex-row'}>
            {/* 검색창 */}
            <div className={'relative flex-1'}>
              <FaSearch className={'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'} />
              <input
                type={'text'}
                placeholder={'제목, 작성자, 카테고리로 검색...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={'focus:ring-blue-500 w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2'}
              />
            </div>

            {/* 상태 필터 */}
            <div className={'flex items-center space-x-2'}>
              <FaFilter className={'text-gray-400'} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={'focus:ring-blue-500 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2'}
              >
                <option value={'전체'}>{'전체 상태'}</option>
                <option value={'완료'}>{'완료'}</option>
                <option value={'진행중'}>{'진행중'}</option>
                <option value={'대기'}>{'대기'}</option>
              </select>
            </div>
          </div>

          {/* 검색 결과 통계 */}
          <div className={'mt-4 text-sm text-gray-600'}>
            {'총 '}<span className={'text-blue-600 font-semibold'}>{filteredItems.length}</span>{'개의 자료가 검색되었습니다.'}
          </div>
        </div>

        {/* 게시판 목록 */}
        <div className={'overflow-hidden rounded-lg bg-white shadow-md'}>
          {/* 테이블 헤더 */}
          <div className={'border-b border-gray-200 bg-gray-50 px-6 py-4'}>
            <div className={'grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700'}>
              <div className={'col-span-1'}>{'번호'}</div>
              <div className={'col-span-2'}>{'분류'}</div>
              <div className={'col-span-4'}>{'제목'}</div>
              <div className={'col-span-2'}>{'작성자'}</div>
              <div className={'col-span-2'}>{'작성일'}</div>
              <div className={'col-span-1'}>{'조회수'}</div>
            </div>
          </div>

          {/* 테이블 본문 */}
          <div className={'divide-y divide-gray-200'}>
            {paginatedItems.map((item, index) => (
              <div key={item.id} className={'px-6 py-4 transition-colors duration-200 hover:bg-gray-50'}>
                <div className={'grid grid-cols-12 items-center gap-4 text-sm'}>
                  {/* 번호 */}
                  <div className={'col-span-1 text-gray-500'}>
                    {filteredItems.length - ((currentPage - 1) * itemsPerPage + index)}
                  </div>

                  {/* 분류 */}
                  <div className={'col-span-2'}>
                    <span className={'inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800'}>
                      {item.category}
                    </span>
                  </div>

                  {/* 제목 */}
                  <div className={'col-span-4'}>
                    <div className={'flex items-center space-x-2'}>
                      <span className={'text-blue-600 font-medium'}>{item.title}</span>
                      {item.views > 1000 && (
                        <span className={'rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'}>{'인기'}</span>
                      )}
                    </div>
                  </div>

                  {/* 작성자 */}
                  <div className={'col-span-2 text-gray-700'}>
                    <div className={'flex items-center space-x-1'}>
                      <FaUser className={'text-xs text-gray-400'} />
                      <span>{item.author}</span>
                    </div>
                  </div>

                  {/* 작성일 */}
                  <div className={'col-span-2 text-gray-600'}>
                    <div className={'flex items-center space-x-1'}>
                      <FaCalendarAlt className={'text-xs text-gray-400'} />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* 조회수 */}
                  <div className={'col-span-1 text-gray-600'}>
                    {item.views.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={'border-t border-gray-200 bg-gray-50 px-6 py-4'}>
              <div className={'flex items-center justify-between'}>
                <div className={'text-sm text-gray-600'}>
                  {'페이지 '}{currentPage}{' / '}{totalPages}
                </div>
                <div className={'flex space-x-2'}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={'rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'}
                  >
                    {'이전'}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded border px-3 py-1 text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={'rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'}
                  >
                    {'다음'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 CTA 섹션 */}
        <div className={'from-blue-600 mt-8 rounded-lg bg-gradient-to-r to-purple-600 p-8 text-center text-white'}>
          <h2 className={'mb-4 text-2xl font-bold'}>{'교리 반증 자료 신청하기'}</h2>
          <p className={'text-blue-100 mb-6'}>
            {'추가적인 교리 반증 자료나 특정 주제에 대한 상세 분석을 요청하실 수 있습니다.'}
          </p>
          <button className={'text-blue-600 rounded-lg bg-white px-8 py-3 font-semibold transition-colors duration-200 hover:bg-gray-100'}>
            {'자료 요청하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Apologetics;
