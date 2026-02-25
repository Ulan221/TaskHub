import {FlatList, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {addDoc, collection, deleteDoc, onSnapshot, orderBy, query, updateDoc, where} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";
import {useEffect, useState} from "react";
import {doc} from "@firebase/firestore";
import * as Notifications from 'expo-notifications';


interface ITask {
    id: string;
    text: string;
    userId: string;
    completed: boolean;
    createdAt: string;
}

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: false,
    }),
});


export default function HomeScreen() {
    const [text, setText] = useState("");
    const [tasks, setTasks] = useState<ITask[]>([]);

    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(
            collection(db, "tasks"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: ITask[] = [];
            snapshot.forEach((doc) => {
                tasksData.push({id: doc.id, ...doc.data()} as ITask);
            });
            setTasks(tasksData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(()=> {
        const askPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert("Permission denied");
            }
        };
        askPermissions();
    }, []);

    const testNotification = async () => {

    };



    const createTask = async () => {
        if (!auth.currentUser || text.trim() === "") return;
        try {
            await addDoc(collection(db, "tasks"), {
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString(),
                text: text,
                completed: false
            });

            setText("");
        } catch (error) {
            console.error(error);
        }
    }


    const deleteTask = async (taskId: string, taskText: string) => {
        try {
            const taskRef = doc(db, "tasks", taskId);
            await deleteDoc(taskRef);
            console.log("Удалено!");

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Задача удалена",
                    body: `Вы удалили: ${taskText}`,
                    data: {
                        taskId: taskId,
                        action: "delete_confirm"
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 5,
                },
            });

        } catch (error) {
            console.error(error);
        }
    }

    const toggleTaskStatus = async (taskId: string, taskStatus: boolean) => {
        try {
            const taskRef = doc(db, "tasks", taskId);
            await updateDoc(taskRef, {
                completed: !taskStatus,
            });
            console.log("Новый статус задачи:", !taskStatus);
        } catch (error) {
            console.error(error);
        }
    }

    const renderCard = ({item}: { item: ITask }) => (
        <View style={[
            styles.taskCard,
            item.completed && styles.taskCardCompleted
        ]}>
            <Pressable
                style={{flex: 1}}
                onPress={() => toggleTaskStatus(item.id, item.completed)}
            >
                <View style={styles.textContainer}>
                    <View style={[styles.statusDot, item.completed && styles.statusDotCompleted]}/>
                    <Text style={[
                        styles.taskText,
                        item.completed && styles.taskTextCompleted
                    ]}>
                        {item.text}
                    </Text>
                </View>
            </Pressable>

            <Pressable
                onPress={() => deleteTask(item.id, item.text)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteText}>✕</Text>
            </Pressable>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Введите название задачи"
                onChangeText={setText}
                value={text}
            />
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={createTask}
            >
                <Text style={{color: 'white', fontWeight: 'bold'}}>Добавить задачу</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={testNotification}
            >
                <Text style={{color: 'white', fontWeight: 'bold'}}>Тест уведомления (10 сек)</Text>
            </Pressable>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                style={{width: '100%', marginTop: 20}}
                renderItem={renderCard}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA", // Светлый "дорогой" фон
        paddingHorizontal: 16,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: "white",
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#212529',
        // Тень
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
        marginTop: 10,
    },
    button: {
        width: '100%',
        height: 55,
        backgroundColor: "#4361EE",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#4361EE",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 5,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    taskCardCompleted: {
        backgroundColor: '#F1F3F5',
        opacity: 0.8,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4361EE',
        marginRight: 12,
    },
    statusDotCompleted: {
        backgroundColor: '#ADB5BD',
    },
    taskText: {
        fontSize: 16,
        color: '#212529',
        fontWeight: '500',
    },
    taskTextCompleted: {
        color: '#ADB5BD',
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        backgroundColor: '#FFF0F0',
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#FF4D4D',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
