import React from "react";
import { StyleSheet, Text, View } from "react-native";



export default function SettingsSection() {
    return (
        <View style={styles.container}>
            <Text>Settings Section</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "turquoise",
    }
});
