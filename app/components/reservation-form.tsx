import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useUser } from "~/contexts/userProvider";
import { useNotifications } from "~/contexts/notificationProvider";
import type { Pet } from "~/types/pet";
import {
  reservationFormSchema,
  type ReservationFormData,
  getDefaultValues,
  transformToSubmissionData
} from "~/schemas/reservation";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { useEffect, useCallback, forwardRef } from "react";
import { ComponentProps } from "react";
import { useToast } from "~/hooks/use-toast";

// 共通化されたFormInputコンポーネント（refフォワーディング対応）
interface FormInputProps
  extends Omit<ComponentProps<typeof Input>, "disabled"> {
  hasError?: boolean;
  isFormSubmitting?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ hasError, isFormSubmitting, className = "", ...props }, ref) => {
    const baseClassName = `
      pr-8 focus:ring-0 focus:outline-none
      focus:border-green-500
      ${hasError ? "border-red-500 focus:border-red-500" : ""}
      ${className}
    `;

    return (
      <Input
        ref={ref}
        className={baseClassName}
        disabled={isFormSubmitting}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

interface ReservationFormModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationFormModal({
  pet,
  isOpen,
  onClose
}: ReservationFormModalProps) {
  const { userId } = useUser();
  const fetcher = useFetcher();
  const { toast } = useToast();

  // React Routerのコンテキストが正しく読み込まれているかチェック
  if (!fetcher || typeof fetcher.submit !== "function") {
    console.warn("React Router context not available");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields, dirtyFields },
    reset,
    watch,
    clearErrors,
    setFocus
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange"
  });

  useEffect(() => {
    if (isOpen && typeof setFocus === "function") {
      const timeoutId = setTimeout(() => {
        try {
          setFocus("name");
        } catch (err) {
          console.warn("Focus setting failed:", err);
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, setFocus]);

  const watchedValues = watch();

  const onSubmit = useCallback(
    async (data: ReservationFormData) => {
      try {
        const submissionData = transformToSubmissionData(data, userId);

        await fetcher.submit(submissionData, {
          method: "post",
          action: `/pets/${pet.id}/reservation`
        });

        toast({
          variant: "success",
          title: "🎉 予約が完了しました",
          description: `${pet.name}の見学予約を承りました。当日お待ちしております！`,
          duration: 5000
        });
        reset();
        onClose();
      } catch (error) {
        console.error("Reservation error:", error);

        toast({
          variant: "destructive",
          title: "❌ 予約に失敗しました",
          description:
            "ネットワークエラーまたはサーバーエラーが発生しました。もう一度お試しください。",
          duration: 5000
        });
      }
    },
    [userId, fetcher, pet.id, pet.name, reset, onClose, toast]
  );

  const handleClose = useCallback(() => {
    try {
      reset();
      clearErrors();
      onClose();
    } catch (err) {
      console.warn("Form reset failed:", err);
      onClose();
    }
  }, [reset, clearErrors, onClose]);

  // フィールドの状態を判定するヘルパー関数
  const getFieldStatus = useCallback(
    (fieldName: keyof ReservationFormData) => {
      const hasError = !!errors[fieldName];
      const isTouched = touchedFields[fieldName];
      const hasValue = watchedValues[fieldName]?.length > 0;

      if (hasError) return "error";
      if (isTouched && hasValue && !hasError) return "success";
      return "default";
    },
    [errors, touchedFields, dirtyFields, watchedValues]
  );

  // フィールドのアイコンを取得
  const getFieldIcon = useCallback(
    (fieldName: keyof ReservationFormData) => {
      const status = getFieldStatus(fieldName);
      switch (status) {
        case "success":
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "error":
          return <AlertCircle className="h-4 w-4 text-red-500" />;
        default:
          return null;
      }
    },
    [getFieldStatus]
  );

  // 日付フィールド用のフォーマットヘルパー
  const formatDateInput = useCallback((value: string) => {
    // 数字のみに制限し、8文字まで
    const numbersOnly = value.replace(/\D/g, "").slice(0, 8);
    return numbersOnly;
  }, []);

  // フォーム送信中の状態処理
  const isFormSubmitting = isSubmitting || fetcher.state === "submitting";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]"
        onInteractOutside={e => {
          // Note: 画面外クリックで閉じないようにする
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {pet.name} の見学予約
          </DialogTitle>
          <DialogDescription>
            以下のフォームに必要事項を入力してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          {/* 氏名フィールド */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
            <Label
              htmlFor="name"
              className="text-left sm:text-right whitespace-nowrap flex items-center gap-1 pt-2"
            >
              お名前
              <span className="text-red-500">*</span>
            </Label>
            <div className="sm:col-span-3 space-y-2">
              <div className="relative">
                <FormInput
                  id="name"
                  {...register("name")}
                  hasError={!!errors.name}
                  isFormSubmitting={isFormSubmitting}
                  placeholder="山田太郎"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {getFieldIcon("name")}
                </div>
              </div>
              {errors.name && (
                <p
                  id="name-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* メールアドレスフィールド */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
            <Label
              htmlFor="email"
              className="text-left sm:text-right whitespace-nowrap flex items-center gap-1 pt-2"
            >
              メールアドレス
              <span className="text-red-500">*</span>
            </Label>
            <div className="sm:col-span-3 space-y-2">
              <div className="relative">
                <FormInput
                  id="email"
                  type="email"
                  {...register("email")}
                  hasError={!!errors.email}
                  isFormSubmitting={isFormSubmitting}
                  placeholder="example@email.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {getFieldIcon("email")}
                </div>
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* 見学予定日時フィールド */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
            <Label
              htmlFor="date"
              className="text-left sm:text-right whitespace-nowrap flex items-center gap-1 pt-2"
            >
              見学予定日時
              <span className="text-red-500">*</span>
            </Label>
            <div className="sm:col-span-3 space-y-2">
              <div className="relative">
                <FormInput
                  id="date"
                  {...register("date", {
                    setValueAs: formatDateInput
                  })}
                  hasError={!!errors.date}
                  isFormSubmitting={isFormSubmitting}
                  placeholder="20250101"
                  maxLength={8}
                  aria-describedby={errors.date ? "date-error" : "date-help"}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {getFieldIcon("date")}
                </div>
              </div>
              {errors.date ? (
                <p
                  id="date-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.date.message}
                </p>
              ) : (
                <p id="date-help" className="text-gray-500 text-xs">
                  ※ YYYYMMDD形式で入力してください（例：20250101）
                </p>
              )}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isFormSubmitting}
              className="min-w-[100px]"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isFormSubmitting || !isValid}
              className={`
                min-w-[120px]
                ${isFormSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  isValid && !isFormSubmitting
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              `}
            >
              {isFormSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  予約中...
                </div>
              ) : (
                "予約する"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
