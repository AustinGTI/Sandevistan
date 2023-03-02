import {Button, StyleSheet,Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useCallback} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";


//region CONSTANTS
export const HEADER_HEIGHT = 50;
//endregion


// a single button that links to a single project view
const ProjectViewButton = ({view, is_active}) => {
    const navigation = useNavigation();
    const button_styling = is_active ? button_styles.active : button_styles.inactive;
    const navigate = useCallback(() => navigation.navigate(view), [view]);
    const tap = Gesture.Tap().onStart(navigate);
    return (
        <GestureDetector gesture={tap} key={view}>
            <View>
                <Text style={button_styling}>{view}</Text>
            </View>
        </GestureDetector>
    );
}
// a component composed of 3 buttons that allow the user to navigate between the 3 project views
export const ProjectViewButtons = ({current_view}) => {
    const views = ["ProjectTreeView", "ProjectTasksView", "ProjectDetailsView"];
    return (
        <View style={button_styles.container}>
            {views.map((view, vi) => <ProjectViewButton view={view} is_active={view === current_view} key={vi}/>)}
        </View>
    );
}


//region STYLES
// .............

// styles to be applied in general to components of the projects tab
export const general_styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#000',
    },
    text: {
        color: "#fff",
    }
});

// styles to be applied to buttons of the projects tab
const button_styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    active: {
        backgroundColor: "#fff",
        color: "#000",
    },
    inactive: {
        backgroundColor: "#000",
        color: "#fff",
    }
});
//endregion