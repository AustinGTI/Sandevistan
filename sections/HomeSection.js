import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TimingTab from "../tabs/TimingTab";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import CalendarTab from "../home-tabs/calendar/CalendarTab";
import DomainTab from "../home-tabs/domain/DomainTab";
import PomodoroTab from "../home-tabs/pomodoro/PomodoroTab";

// Create tab navigator
// const Tab = createBottomTabNavigator();
// create a material top tab navigator
const Tab = createMaterialTopTabNavigator();
export default function HomeSection() {
    return (
            <Tab.Navigator tabBarPosition={'bottom'} screenOptions={{
                headerShown: false,
            }}>
                <Tab.Screen name={"Calendar"} component={CalendarTab}/>
                <Tab.Screen name="Pomodoro" component={PomodoroTab}/>
                <Tab.Screen name={"Project"} component={DomainTab}/>
            </Tab.Navigator>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0ff', color: '#f00', alignItems: 'center', justifyContent: 'center',
    },
});
