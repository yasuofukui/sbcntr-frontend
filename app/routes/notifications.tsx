import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useNotifications } from "~/contexts/notificationProvider";
import { useToast } from "~/hooks/use-toast";
import { config } from "~/lib/config";
import {
  convertServerNotificationsToClient,
  SAMPLE_NOTIFICATIONS
} from "~/lib/notifications";
import type { Notification, NotificationsResponse } from "~/types/notification";
import type { Route } from "./+types/notifications";

// アクション関数: 通知を既読にする
export async function action({ request }: Route.ActionArgs): Promise<{
  status: number;
  body: string;
  data?: unknown;
}> {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const { id } = body;

  try {
    const url = `${config.api.backendUrl}/v1/notifications/read`;

    // POSTボディの準備
    const postBody: { id?: string } = {};
    if (id && typeof id === "string") {
      postBody.id = id;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postBody)
    });

    if (!response.ok) {
      return {
        body: "Failed to mark notifications as read",
        status: 500
      };
    }

    const result = await response.json();
    return {
      ...result,
      status: 200
    };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { body: "Failed to mark notifications as read", status: 500 };
  }
}

// サーバーから通知データを取得
export async function loader() {
  try {
    const response = await fetch(`${config.api.backendUrl}/v1/notifications`);

    if (response.ok) {
      const data: NotificationsResponse = await response.json();
      const notifications = convertServerNotificationsToClient(data.data);
      return { notifications, total: notifications.length };
    } else {
      console.warn(`API Error: ${response.status} ${response.statusText}`);
      return {
        notifications: SAMPLE_NOTIFICATIONS,
        total: SAMPLE_NOTIFICATIONS.length
      };
    }
  } catch (error) {
    console.warn("Failed to fetch notifications from server:", error);
    console.warn("Falling back to sample data");
    return {
      notifications: SAMPLE_NOTIFICATIONS,
      total: SAMPLE_NOTIFICATIONS.length
    };
  }
}

function NotificationListItem({
  notification
}: {
  notification: Notification;
}) {
  const fetcher = useFetcher<typeof action>();

  const getIcon = () => {
    switch (notification.type) {
      case "reservation":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "new":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "price_change":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "campaign":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBadgeVariant = () => {
    switch (notification.type) {
      case "reservation":
        return "default";
      case "new":
        return "destructive";
      case "price_change":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      fetcher.submit({ id: notification.id }, { method: "post" });
    }
  };

  const timeAgo = formatDistanceToNow(notification.timestamp, {
    addSuffix: true,
    locale: ja
  });

  return (
    <Card
      className={`
        transition-all hover:shadow-md
        ${
          !notification.isRead
            ? "border-l-4 border-l-blue-400 bg-blue-50/50"
            : ""
        }
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className={`text-lg font-medium ${
                    !notification.isRead ? "font-semibold" : ""
                  }`}
                >
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <Badge variant={getBadgeVariant()} className="text-xs">
                  {notification.type === "new" && "新規追加"}
                  {notification.type === "reservation" && "予約完了"}
                  {notification.type === "price_change" && "価格変更"}
                  {notification.type === "campaign" && "キャンペーン"}
                </Badge>
              </div>
              <p className="text-gray-700 mb-3">{notification.message}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          {!notification.isRead && (
            <div className="flex-shrink-0 self-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="h-10 w-10 p-0 hover:bg-blue-100"
                title="既読にする"
              >
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage({
  loaderData
}: Route.ComponentProps) {
  // サーバーから取得した通知データを使用
  const serverNotifications = loaderData?.notifications || [];
  const total = loaderData?.total || 0;

  const fetcher = useFetcher<typeof action>();
  const { unreadCount, setUnreadCount } = useNotifications();
  const { toast } = useToast();

  // fetcher の状態変化を監視してトーストを表示
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.status === 200) {
        toast({
          title: "通知を既読にしました",
          description: "すべての通知が既読状態になりました",
          duration: 3000
        });
      } else {
        toast({
          title: "エラーが発生しました",
          description: "通知の既読処理に失敗しました",
          variant: "destructive",
          duration: 3000
        });
      }
    }
  }, [fetcher.state, fetcher.data, toast]);

  useEffect(() => {
    // サーバから取得した通知数を更新
    setUnreadCount(
      serverNotifications.filter((n: Notification) => !n.isRead).length
    );
  }, [serverNotifications]);

  const hasNotifications = serverNotifications.length > 0;
  const hasUnread = unreadCount > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">通知</h1>
              <p className="text-gray-600 mt-1">
                {hasUnread
                  ? `${unreadCount}件の未読通知があります (全${total}件)`
                  : `すべての通知を確認済みです (全${total}件)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasUnread && (
              <Button
                variant="outline"
                onClick={() => {
                  fetcher.submit({}, { method: "post" });
                }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                すべて既読にする
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!hasNotifications ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                通知はありません
              </h2>
              <p className="text-gray-500">
                新しい通知が届くとここに表示されます
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {hasUnread && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  未読の通知 ({unreadCount}件)
                </h2>
                <div className="space-y-3">
                  {serverNotifications
                    .filter((n: Notification) => !n.isRead)
                    .map((notification: Notification) => (
                      <NotificationListItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                </div>
              </div>
            )}

            {serverNotifications.some((n: Notification) => n.isRead) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  既読の通知
                </h2>
                <div className="space-y-3">
                  {serverNotifications
                    .filter((n: Notification) => n.isRead)
                    .map((notification: Notification) => (
                      <NotificationListItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
