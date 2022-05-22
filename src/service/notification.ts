type NotificationState = "default" | "denied" | "granted";

export const getNotificationState = async (): Promise<NotificationState> => {
  return Notification.permission;
};

const TEST_NOTIFICATION = {
  body: "Buzz! Buzz!",
  icon: "/cylfill-rect.png",
  vibrate: [200, 100, 200, 100, 200, 100, 200],
  tag: "vibration-sample",
};

export const showTestNotification = async () => {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.showNotification("Hello World!", TEST_NOTIFICATION);
};
