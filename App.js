import 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from "@react-navigation/drawer";
import SettingsSection from "./sections/SettingsSection";
import HomeSection from "./sections/HomeSection";
import {DatabaseContext} from "./contexts/global_contexts";
import db from "./database/main";


// Create tab navigator
const Drawer = createDrawerNavigator();
export default function App() {
    return (
        <DatabaseContext.Provider value={db}>
            <NavigationContainer>
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={HomeSection}/>
                    <Drawer.Screen name="Settings" component={SettingsSection}/>
                </Drawer.Navigator>
            </NavigationContainer>
        </DatabaseContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0ff', color: '#f00', alignItems: 'center', justifyContent: 'center',
    },
});
