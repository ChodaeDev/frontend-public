import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
  userId: z.string()
    .min(1, '아이디를 입력해주세요')
    .min(4, '아이디는 4자 이상이어야 합니다')
    .max(20, '아이디는 20자 이하여야 합니다'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signupSchema = z.object({
  userId: z.string()
    .min(1, '아이디를 입력해주세요')
    .min(4, '아이디는 4자 이상이어야 합니다')
    .max(20, '아이디는 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어만 사용 가능합니다'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다'),
  passwordConfirm: z.string()
    .min(1, '비밀번호를 다시 입력해주세요'),
  userName: z.string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(20, '이름은 20자 이하여야 합니다')
    .regex(/^[a-zA-Z가-힣\s]+$/, '한글, 영문만 입력 가능합니다'),
  nickName: z.string()
    .max(20, '닉네임은 20자 이하여야 합니다')
    .regex(/^[a-zA-Z가-힣0-9\s]*$/, '한글, 영문, 숫자만 입력 가능합니다')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요')
    .min(9, '전화번호는 9자리 이상이어야 합니다')
    .max(11, '전화번호는 11자리 이하여야 합니다'),
  church: z.string()
    .max(50, '교회명은 50자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
  birthday: z.string()
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(500, '소개는 500자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});

export type SignupInput = z.infer<typeof signupSchema>;

// 프로필 수정 스키마
export const profileSchema = z.object({
  userName: z.string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(20, '이름은 20자 이하여야 합니다')
    .regex(/^[a-zA-Z가-힣\s]+$/, '한글, 영문만 입력 가능합니다'),
  nickName: z.string()
    .max(20, '닉네임은 20자 이하여야 합니다')
    .regex(/^[a-zA-Z가-힣0-9\s]*$/, '한글, 영문, 숫자만 입력 가능합니다')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요')
    .min(9, '전화번호는 9자리 이상이어야 합니다')
    .max(11, '전화번호는 11자리 이하여야 합니다'),
  church: z.string()
    .max(50, '교회명은 50자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
  birthday: z.string()
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(500, '소개는 500자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// 비밀번호 변경 스키마
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string()
    .min(1, '새 비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다'),
  newPasswordConfirm: z.string()
    .min(1, '새 비밀번호를 다시 입력해주세요'),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: '새 비밀번호가 일치하지 않습니다',
  path: ['newPasswordConfirm'],
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

// FormData를 객체로 변환하는 유틸리티
export function formDataToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    obj[key] = value.toString();
  });
  return obj;
}

// 필드 에러 타입
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Zod 에러를 필드 에러로 변환
export function getFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const fieldErrors: FieldErrors<T> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof T;
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
