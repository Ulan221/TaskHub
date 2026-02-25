import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput} from "react-native";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@firebase/auth";
import {auth, db} from "@/firebaseConfig";
import {useRouter} from "expo-router";
import {doc, setDoc} from "@firebase/firestore";
import {validateAuth} from "@/utils/validation";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();



    const handleLogin = async () => {
        const validation = validateAuth(email, password);

        if (!validation.isValid) {
            Alert.alert("Error", validation.errorMessage || undefined);
            return;
        }
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Успех", "Вы успешно вошли!");
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert("Ошибка входа", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegister = async () => {
        const validation = validateAuth(email, password);

        if (!validation.isValid) {
            Alert.alert("Error", validation.errorMessage || undefined);
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
                tasks: []
            });

            Alert.alert("Успех", "Аккаунт и профиль в БД созданы!");
        } catch (error: any) {
            Alert.alert("Ошибка регистрации", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"/>

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}/>


                {isLoading ? (
                    <ActivityIndicator size="large" color="red"/>
                ) : (
                    <>
                        <Pressable style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Войти</Text>
                        </Pressable>

                        <Pressable style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Зарегистрироваться</Text>
                        </Pressable>
                    </>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: "#9cbed1",
        borderRadius: 5,
        marginBottom: '2%',
        paddingHorizontal: 15,
    },
    loginButton: {
        alignItems: "center",
        justifyContent: "center",
        width: '60%',
        height: 50,
        backgroundColor: "red",
        borderRadius: 15,
        shadowColor: "black",
        shadowOpacity: 0.1,
        marginTop: '5%',
        marginBottom: '2%',
        paddingHorizontal: 15,
    },
    registerButton: {
        alignItems: "center",
        justifyContent: "center",
        width: '60%',
        height: 50,
        backgroundColor: "blue",
        borderRadius: 15,
        shadowColor: "black",
        shadowOpacity: 0.1,
        marginBottom: '2%',
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
    }
});
