import { z } from "zod";

// 現在の日付を取得（YYYYMMDD形式）
const getCurrentDateYYYYMMDD = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// YYYYMMDD形式の日付が有効かチェックする関数
const isValidDate = (dateStr: string): boolean => {
  if (!/^\d{8}$/.test(dateStr)) {
    return false;
  }

  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6));
  const day = parseInt(dateStr.substring(6, 8));

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

// 予約フォームのバリデーションスキーマ
export const reservationFormSchema = z.object({
  name: z
    .string()
    .min(1, "氏名は必須です")
    .trim()
    .refine(val => val.length > 0, {
      message: "氏名を入力してください"
    }),

  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください")
    .trim(),

  date: z
    .string()
    .min(1, "見学予定日時は必須です")
    .refine(val => /^\d{8}$/.test(val), {
      message: "日時の形式が正しくありません。20250101のように入力してください"
    })
    .refine(val => isValidDate(val), {
      message: "存在しない日付です"
    })
    .refine(val => val >= getCurrentDateYYYYMMDD(), {
      message: "過去の日時は選択できません"
    })
});

// TypeScript型の自動生成
export type ReservationFormData = z.infer<typeof reservationFormSchema>;

// デフォルト値の定義
export const getDefaultValues = (): ReservationFormData => ({
  name: "",
  email: "",
  date: new Date()
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replaceAll("/", "")
});

// フォーム送信用のデータ型（サーバーに送信する際の形式）
export const reservationSubmissionSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  reservationDate: z.string()
});

export type ReservationSubmissionData = z.infer<
  typeof reservationSubmissionSchema
>;

// フォームデータを送信用データに変換する関数
export const transformToSubmissionData = (
  formData: ReservationFormData,
  userId: string
): ReservationSubmissionData => ({
  userId,
  fullName: formData.name,
  email: formData.email,
  reservationDate: formData.date
});
