import {Text, View, StyleSheet} from "react-native";

// the tab that will be used to display the calendar/ days of the week and daily schedule

export default function CalendarTab() {
    return (
        <View style={styles.container}>
            <Text>Calendar Tab</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: "yellow",
    }
});

