import {Text, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import PomodoroBase from "./layers/pomodoro_base";

// the holder for the pomodoro stack
const Stack = createStackNavigator();

export default function PomodoroTab() {
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="PomodoroBase" component={PomodoroBase}/>
        </Stack.Navigator>
    )
}

