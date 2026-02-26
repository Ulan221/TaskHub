import {Pressable, Text, View, StyleSheet} from "react-native";
import {ITask} from "@/types";


interface TaskCardProps {
    item: ITask;
    onToggle: (id: string, status: boolean) => void;
    onDelete: (id: string, text: string) => void;
}

export const TaskCard = ({item, onToggle, onDelete}: TaskCardProps) => {
    return (
        <View style={[
            styles.taskCard,
            item.completed && styles.taskCardCompleted
        ]}>
            <Pressable
                style={{flex: 1}}
                onPress={() => onToggle(item.id, item.completed)}
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
                onPress={() => onDelete(item.id, item.text)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteText}>✕</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 16,
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
