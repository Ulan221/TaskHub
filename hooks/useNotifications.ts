import * as Notifications from "expo-notifications";
import {useEffect} from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {auth, db} from "@/firebaseConfig";
import {doc, setDoc} from "@firebase/firestore";
import {Platform} from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const useNotifications = () => {
    useEffect(() => {
        const getPushToken = async () => {
            // 1. Проверка на реальное устройство
            if (!Device.isDevice) {
                console.log('Пуши работают только на реальном устройстве');
                return;
            }

            // 2. Запрос прав (твой код)
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Права не получены');
                return;
            }

            // 3. ПОЛУЧЕНИЕ ТОКЕНА
            try {
                // Берем ID проекта из конфига Expo
                const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;

                if (!projectId) {
                    console.log("Project ID не найден в app.json. Проверь настройки EAS.");
                }

                const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
                if (auth.currentUser) {
                    const userRef = doc(db, "users", auth.currentUser.uid);

                    // Используем setDoc с merge: true
                    // Это обновит пустую строку на реальный токен
                    await setDoc(userRef, {
                        pushToken: token,
                        lastLogin: new Date().toISOString() // полезно знать, когда юзер заходил
                    }, { merge: true });

                    console.log("🚀 Токен успешно обновлен в Firestore!");
                }

            } catch (e) {
                console.log('Ошибка при получении токена:', e);
            }

            // Настройка канала для Android
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                });
            }
        };

        getPushToken();
    }, []);
}