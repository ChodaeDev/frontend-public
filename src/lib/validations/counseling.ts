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
    .min(10, '전화번호는 10자리 이상이어야 합니다')
    .max(11, '전화번호는 11자리 이하여야 합니다'),
});

export type CounselingInput = z.infer<typeof counselingSchema>;
