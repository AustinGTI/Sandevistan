import {Button, StyleSheet,Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import React, {useCallback} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";


//region CONSTANTS
export const HEADER_HEIGHT = 50;
//endregion


//region COMPONENTS
// a single button that links to a single project view
const ProjectViewButton = ({view, is_active}) => {
    const navigation = useNavigation();
    const navigate = useCallback(() => navigation.navigate(view), [view]);
    const tap = Gesture.Tap().onBegin(navigate);
    // ? STYLING
    const button_view_styling = {...core_styles.button,...(is_active ? core_styles.active_button : core_styles.inactive_button)};
    const button_text_styling = {...core_styles.body_text,color:button_view_styling.color};
    return (
        <GestureDetector gesture={tap} key={view}>
            <View style={button_view_styling}>
                <Text style={button_text_styling}>{view.slice(7,-4)}</Text>
            </View>
        </GestureDetector>
    );
}


// a component composed of 3 buttons that allow the user to navigate between the 3 project views
export const ProjectViewButtons = ({current_view}) => {
    const views = ["ProjectDetailsView", "ProjectTasksView", "ProjectTreeView"];
    // ? STYLING
    const buttons_container_styling = {...core_styles.container,flex:0,flexDirection:'row'};
    return (
        <View style={buttons_container_styling}>
            {views.map(
                (view, vi) =>
                <ProjectViewButton view={view} is_active={view === current_view} key={vi}/>
            )}
        </View>
    );
}
//endregion


//region STYLES
// .............

// styles to be applied in general to components of the projects tab
export const core_styles = StyleSheet.create({
    // CONTAINERS
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#000',
        color: '#fff',
    },
    pane: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        margin: 5,
    },

    // TEXT
    header_text: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
        paddingHorizontal: 10,
    },
    body_text: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 5,
    },

    // BUTTONS
    button: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        margin: 2,
        borderRadius: 3,
    },
    active_button: {
        backgroundColor: "#fff",
        color: "#000",
    },
    inactive_button: {
        backgroundColor: "#000",
        color: "#fff",
    }
});

// styles to be applied specifically to the pages of a single project
export const project_styles = StyleSheet.create({
    container: {
        paddingTop: HEADER_HEIGHT,
    }
});

//endregion

//region FUNCTIONS
// .............

// a function to convert a js date object to an am/pm time string with hours and minutes eg. 12:34 pm
export const dateToTimeString = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const am_pm = hours >= 12 ? 'pm' : 'am';
    const hours_12 = hours % 12 || 12;
    return `${hours_12}:${minutes < 10 ? '0' : ''}${minutes} ${am_pm}`;
}


//endregion