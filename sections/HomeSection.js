import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TimingTab from "../tabs/TimingTab";
import CalendarTab from "../tabs/CalendarTab";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

// Create tab navigator
// const Tab = createBottomTabNavigator();
// create a material top tab navigator
const Tab = createMaterialTopTabNavigator();
export default function HomeSection() {
    return (
            <Tab.Navigator tabBarPosition={'bottom'} screenOptions={{
                headerShown: false,
            }}>

                <Tab.Screen name="Timing" component={TimingTab}/>
                <Tab.Screen name={"Calendar"} component={CalendarTab}/>
            </Tab.Navigator>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0ff', color: '#f00', alignItems: 'center', justifyContent: 'center',
    },
});
