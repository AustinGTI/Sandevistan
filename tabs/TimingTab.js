import React from "react";
import { StyleSheet, Text, View } from "react-native";



export default function TimingTab() {
    return (
        <View style={styles.container}>
        <Text>Timing Tab</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink",
    }
});