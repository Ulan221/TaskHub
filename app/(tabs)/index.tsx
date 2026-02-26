import {FlatList, Pressable, StyleSheet, Text, TextInput} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {addDoc, collection, deleteDoc, onSnapshot, orderBy, query, updateDoc, where} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";
import {useEffect, useState} from "react";
import {doc} from "@firebase/firestore";
import * as Notifications from 'expo-notifications';
import {ITask} from "@/types";
import {TaskCard} from "@/components/TaskItem";
import {useNotifications} from "@/hooks/useNotifications";

export default function HomeScreen() {
    const [text, setText] = useState("");
    const [tasks, setTasks] = useState<ITask[]>([]);

    useNotifications();

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


    // Cоздание задачи
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

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Введите название задачи"
                onChangeText={setText}
                value={text}
            />
            <Pressable
                style={({pressed}) => [
                    styles.button,
                    {opacity: pressed ? 0.7 : 1}
                ]}
                onPress={createTask}
            >
                <Text style={{color: 'white', fontWeight: 'bold'}}>Добавить задачу</Text>
            </Pressable>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                style={{width: '100%', marginTop: 20}}
                renderItem={({item}) => (
                    <TaskCard
                        item={item}
                        onToggle={toggleTaskStatus}
                        onDelete={deleteTask}
                    />
                )}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
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
    deleteButton: {
        backgroundColor: '#FFF0F0',
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
