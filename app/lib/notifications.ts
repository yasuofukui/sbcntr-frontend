import type { Notification, ServerNotification } from "~/types/notification";

/**
 * サーバーから取得した通知データをクライアント形式に変換
 */
export function convertServerNotificationToClient(
  serverNotification: ServerNotification
): Notification {
  return {
    id: serverNotification.id,
    title: serverNotification.title,
    message: serverNotification.message,
    type: serverNotification.type as Notification["type"],
    isRead: serverNotification.is_read,
    timestamp: new Date(serverNotification.updated_at)
  };
}

/**
 * サーバーから取得した通知配列をクライアント形式に一括変換
 */
export function convertServerNotificationsToClient(
  serverNotifications: ServerNotification[]
): Notification[] {
  return serverNotifications.map(convertServerNotificationToClient);
}

// サンプル通知データ（フォールバック用）
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "予約完了",
    message: "サイベリアンの見学予約が完了しました",
    type: "reservation",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30分前
  },
  {
    id: "2",
    title: "新しいペット追加",
    message: "茶トラ猫が新しく仲間入りしました",
    type: "new",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2時間前
  }
];
