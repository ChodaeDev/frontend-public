import { z } from 'zod';

export const counselingSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하여야 합니다'),
  counselType: z.string()
    .min(1, '상담 유형을 선택해주세요'),
  content: z.string()
    .min(1, '내용을 입력해주세요'),
  phone: z.string()
    .min(1, '연락처를 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요')
    .min(9, '전화번호는 9자리 이상이어야 합니다')
    .max(11, '전화번호는 11자리 이하여야 합니다'),
});

export type CounselingInput = z.infer<typeof counselingSchema>;

/** 비회원 글 비밀번호: 4자 이상만 요구한다 (최대 20자) */
export const guestPasswordMinLength = 4;
export const guestPasswordMaxLength = 20;

export const guestPasswordSchema = z.string()
  .min(guestPasswordMinLength, `비밀번호는 ${ guestPasswordMinLength }자 이상 입력해주세요`)
  .max(guestPasswordMaxLength, `비밀번호는 ${ guestPasswordMaxLength }자 이하로 입력해주세요`);

export const guestCounselingSchema = counselingSchema.extend({
  guestName: z.string()
    .trim()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 20자 이하로 입력해주세요'),
  password: guestPasswordSchema,
  passwordConfirm: z.string().min(1, '비밀번호를 한 번 더 입력해주세요'),
  passwordNoticeAgree: z.literal(true, { error: '비밀번호 안내를 확인해주세요' }),
  agreePrivacy: z.literal(true, { error: '개인정보 수집·이용에 동의해주세요' }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 서로 다릅니다',
  path: ['passwordConfirm'],
});

export type GuestCounselingInput = z.infer<typeof guestCounselingSchema>;
