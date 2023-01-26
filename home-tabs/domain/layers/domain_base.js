import {Text, View, StyleSheet} from "react-native";

// the tab that will be used to display and edit the projects being worked on

export default function DomainBase() {
    return (
        <View style={styles.container}>
            <Text>Domain Base</Text>
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
