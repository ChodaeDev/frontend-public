import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';

interface VisitorCount {
  date: string;
  count: number;
}

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const incrementAndGetCount = async () => {
      try {
        // 먼저 접속자 수를 증가시킵니다
        await fetch(`${API_BASE_URL}/api/public/visitor/increment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 그 다음 오늘의 접속자 수를 가져옵니다
        const response = await fetch(`${API_BASE_URL}/api/public/visitor/count`);
        const data = await response.json();
        
        if (data.success) {
          setVisitorCount(data.data.count);
        }
      } catch (error) {
        console.error('접속자 수 조회 중 오류 발생:', error);
        setVisitorCount(0);
      } finally {
        setLoading(false);
      }
    };

    incrementAndGetCount();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaUsers className="text-blue-500" />
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border">
      <FaUsers className="text-blue-500" />
      <span>오늘 접속자: <strong className="text-blue-600">{visitorCount.toLocaleString()}</strong>명</span>
    </div>
  );
};

export default VisitorCounter;
