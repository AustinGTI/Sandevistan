import {core_styles, dateToTimeString} from "../ProjectsComponents";
import {View,Text} from "react-native";


// the full page view of a session, displays its actual and planned times, duration, and state

export default function SessionView({route,navigation}) {
    const session_id = route.params.session_id;
    // ? STYLING
    const session_view_styling = {...core_styles.container};
    const session_view_header_styling = core_styles.header_text;
    const session_view_body_styling = core_styles.body_text;
    return (
        <View style={session_view_styling}>
            <Text style={session_view_header_styling}>{session_id}</Text>
        </View>
    )
}