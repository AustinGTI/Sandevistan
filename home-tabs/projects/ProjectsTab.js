import {Text, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import ProjectsIndex from "./layers/ProjectsIndex";
import ProjectView from "./layers/ProjectView";
import TaskView from "./layers/TaskView";
import SessionView from "./layers/SessionView";

// the holder for the projects stack
const Stack = createStackNavigator();

export default function ProjectsTab() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* the listing of projects seperated into domains */}
            <Stack.Screen name="ProjectIndex" component={ProjectsIndex}/>
            {/* The view of a single project */}
            <Stack.Screen name={"ProjectView"} component={ProjectView}/>
            {/* The view of a single task */}
            <Stack.Screen name={"TaskView"} component={TaskView}/>
            {/* The view of a single session */}
            <Stack.Screen name={"SessionView"} component={SessionView}/>
        </Stack.Navigator>
    )
}

