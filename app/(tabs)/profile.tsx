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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    text: {
        color: "white",
        fontSize: 18,
    },
    logoutButton: {
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
});
