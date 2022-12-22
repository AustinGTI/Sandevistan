import React from "react";
import { StyleSheet, Text, View } from "react-native";



export default function CalendarTab() {
    return (
        <View style={styles.container}>
            <Text>Calendar Taber</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "yellow",
    }
});
