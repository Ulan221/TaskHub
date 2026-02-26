import {Pressable, StyleSheet, Text} from 'react-native';
import {auth} from "@/firebaseConfig";
import {SafeAreaView} from "react-native-safe-area-context";
import {signOut} from "@firebase/auth";

export default function ProfileScreen() {
    const user = auth.currentUser;

    const handleLogOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Email: {user?.email}</Text>
            <Pressable
                style={styles.logoutButton}
                onPress={() => {
                    handleLogOut();
                }}
            >
                <Text>Log Out</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    text: {
        color: "blue",
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#f8c4c4',
        marginTop: 10,
        width: "70%",
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
