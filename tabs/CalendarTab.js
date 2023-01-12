import React from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import {TapGestureHandler} from "react-native-gesture-handler";
// import {Canvas} from "@shopify/react-native-skia";
// import {Rect} from "@shopify/react-native-skia/src/renderer/components/shapes/Rect";
// import {GestureDetector} from "react-native-gesture-handler/src/handlers/gestures/GestureDetector";


export default function CalendarTab() {
    // create a shared value to determine the height of the slider
    const height = useSharedValue(0);
    const pressed = useSharedValue(false);

    const anim = useAnimatedStyle(() => {
        return {
            backgroundColor: (pressed.value) ? "red" : "blue",
            transform: [{translateY: withSpring(height.value)}],
        }
    });
    const eventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
            pressed.value = true;
        },
        onEnd: (event, ctx) => {
            pressed.value = false;
        }
    });
    return (
        <View style={styles.container}>
            <Text>Calendar Tab</Text>
                <TapGestureHandler onGestureEvent={eventHandler}>
                    <Animated.View style={[styles.slider, anim]}/>
                </TapGestureHandler>

            <Button style={styles.button} title={"Toggle"}
                    onPress={() => height.value = height.value === 0 ? 100 : 0}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: "yellow",
    },
    slider: {
        width: 100,
        height: 100,
        backgroundColor: "red",
    },
    button: {
        width: 100,
        height: 20,
        // place button at bottom of screen
        position: "absolute",
        bottom: 0,
    }

});
