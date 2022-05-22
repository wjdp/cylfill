type NotificationState = "default" | "denied" | "granted";

export const getNotificationState = async (): Promise<NotificationState> => {
  return Notification.permission;
};

const DEFAULT_OPTIONS = {
  icon: "/cylfill-rect.png",
  vibrate: [200, 100, 200, 100, 200, 100, 200],
};

export const showNotification = async (
  title: string,
  options: NotificationOptions
) => {
  if ((await getNotificationState()) !== "granted") return;
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.showNotification(title, { ...DEFAULT_OPTIONS, ...options });
};

export const closeNotificationsByTag = async (tag: string) => {
  if ((await getNotificationState()) !== "granted") return;
  const swRegistration = await navigator.serviceWorker.ready;
  const notifications = await swRegistration.getNotifications({ tag });
  notifications.forEach((notification) => notification.close());
};

const TEST_NOTIFICATION = {
  body:
    "Be aware notifications may not work if the app has been closed for a while. " +
    "This is very dependant on your device.",
  vibrate: [200, 100, 200, 100, 200, 100, 200],
  tag: "vibration-sample",
};

export const showTestNotification = async () => {
  showNotification("Hello World!", TEST_NOTIFICATION);
};
