import {Text, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import ProjectsBase from "./layers/ProjectsBase";

// the holder for the projects stack
const Stack = createStackNavigator();

export default function ProjectsTab() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="DomainBase" component={ProjectsBase}/>
        </Stack.Navigator>
    )
}

