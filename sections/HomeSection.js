import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TimingTab from "../tabs/TimingTab";
import CalendarTab from "../tabs/CalendarTab";

// Create tab navigator
const Tab = createBottomTabNavigator();
export default function HomeSection() {
    return (
            <Tab.Navigator screenOptions={{
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
