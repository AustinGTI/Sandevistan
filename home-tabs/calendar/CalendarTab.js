import {createStackNavigator} from "@react-navigation/stack";
import CalendarBase from "./layers/calendar_base";
// holder for the calendar stack

const Stack = createStackNavigator();

export default function CalendarTab() {
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="CalendarBase" component={CalendarBase}/>
        </Stack.Navigator>
    )
}

