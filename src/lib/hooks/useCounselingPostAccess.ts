'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  counselingKeys,
  fetchCounselingDetail,
  isGuestPasswordRequired,
  verifyGuestPostPassword,
} from '@/lib/queries/counseling';

/**
 * 상담글 상세 접근 훅.
 * 비회원 글은 비밀번호 확인으로 받은 토큰을 컴포넌트 state에만 보관한다.
 * 페이지를 떠났다가 다시 오면 토큰이 사라지므로 매번 비밀번호를 다시 입력해야 한다.
 */
export function useCounselingPostAccess(postId: number, enabled = true) {
  const [accessToken, setAccessToken] = useState<string | undefined>();

  // 한 번이라도 비밀번호 화면이 필요했던 글이면 비회원 글로 기억한다 (재요청 실패 시 로그인 화면으로 보내지 않기 위해)
  const [isGuestLocked, setIsGuestLocked] = useState(false);

  const query = useQuery({
    queryKey: [...counselingKeys.detail(postId), accessToken ?? 'none'],
    queryFn: () => fetchCounselingDetail(postId, accessToken),
    enabled,
    retry: false,
    gcTime: 0,
    // 토큰 만료(30분) 뒤 탭 전환만으로 튕겨 나가지 않게 한다
    refetchOnWindowFocus: false,
  });

  const passwordRequired = isGuestPasswordRequired(query.error);

  useEffect(() => {
    if (!passwordRequired) return;
    setIsGuestLocked(true);
    // 토큰이 만료됐으면 버리고 비밀번호를 다시 받는다
    setAccessToken(undefined);
  }, [passwordRequired]);

  const unlock = useMutation({
    mutationFn: (password: string) => verifyGuestPostPassword({ id: postId, password }),
    onSuccess: (result) => setAccessToken(result.accessToken),
  });

  return {
    post: query.data,
    loading: query.isLoading,
    error: query.error,
    // 토큰이 만료돼도 같은 렌더에서 바로 비밀번호 화면을 보여 준다 (에러 alert로 새지 않게)
    needsPassword: passwordRequired,
    isGuestLocked,
    accessToken,
    unlock: unlock.mutate,
    unlocking: unlock.isPending,
    unlockError: unlock.error,
  };
}
