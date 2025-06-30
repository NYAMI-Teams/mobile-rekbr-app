import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

// Handler agar notifikasi muncul saat app aktif
export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Daftar token notifikasi + buat channel Android
export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    alert("Notifikasi hanya bisa dijalankan di perangkat fisik.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Izin notifikasi tidak diberikan.");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Android: buat channel default agar notifikasi bisa muncul
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });
  }

  return token;
};

// Listener untuk menerima notifikasi saat app aktif
export const setupNotificationListeners = () => {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notifikasi diterima:", notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notifikasi diklik -----------:", response);
      const data = response.notification.request.content.data;
      console.log("Data notifikasi:", data);
      console.log("Navigasi ke halaman:", data?.pathname || "/");
      router.replace({
        pathname: "",
        params: { data: JSON.stringify(data) },
      });
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};
