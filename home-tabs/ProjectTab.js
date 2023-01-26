import {Text, View, StyleSheet} from "react-native";

// the tab that will be used to display and edit the projects being worked on

export default function ProjectTab() {
    return (
        <View style={styles.container}>
            <Text>Project Tab</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: "red",
    }
});

