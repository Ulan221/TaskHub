import {useEffect, useState} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '@/firebaseConfig';
import {ActivityIndicator, View} from 'react-native';
import {StatusBar} from 'expo-status-bar'; // ИМЕННО ЭТОТ ДЛЯ style="dark"
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from '@/hooks/use-color-scheme';
import {SafeAreaProvider} from "react-native-safe-area-context"; // Достаем схему

export default function RootLayout() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const segments = useSegments();
    const colorScheme = useColorScheme(); // ОПРЕДЕЛЯЕМ ПЕРЕМЕННУЮ ТУТ

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (initializing) return;

        const inAuthGroup = segments[0] === 'login';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, initializing, segments]);

    if (initializing) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="red"/>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="login" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

