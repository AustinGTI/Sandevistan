import {Text, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import DomainBase from "./layers/domain_base";

// the holder for the domain stack
const Stack = createStackNavigator();

export default function DomainTab() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="DomainBase" component={DomainBase}/>
        </Stack.Navigator>
    )
}

