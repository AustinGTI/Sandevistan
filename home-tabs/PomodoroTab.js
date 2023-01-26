import {Text, View, StyleSheet} from "react-native";

// the tab that will be used to display and manage the pomodoro timer

export default function PomodoroTab() {
    return (
        <View style={styles.container}>
            <Text>Pomodoro Tab</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: "aqua",
    }
});

