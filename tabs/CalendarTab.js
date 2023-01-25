import React from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import {TapGestureHandler} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {addTodo} from "../redux/action";



export default function CalendarTab() {
    // create a shared value to determine the height of the slider
    const height = useSharedValue(0);
    const pressed = useSharedValue(false);
    const dispatch = useDispatch();
    const todoList = useSelector(state => state.todos);
    console.log(todoList);
    const toggle = () => {
    dispatch(addTodo('random word here'));
    }

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
            <Text>{todoList.toString()}</Text>
                <TapGestureHandler onGestureEvent={eventHandler}>
                    <Animated.View style={[styles.slider, anim]}/>
                </TapGestureHandler>

            <Button style={styles.button} title={"Toggle"}
                    onPress={toggle}/>
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
