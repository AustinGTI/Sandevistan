import ProjectDetailsView from "./ProjectDetailsView";
import ProjectTreeView from "./ProjectTreeView";
import ProjectTasksView from "./ProjectTasksView";
import {createStackNavigator} from "@react-navigation/stack";
import {core_styles, ProjectViewButtons, setModalState} from "../ProjectsComponents";
import {ProjectContext} from "../../../contexts/project_contexts";
import {HeaderBackButton} from "@react-navigation/elements";
import {useContext, useEffect, useReducer, useState} from "react";
import {getProjectTasks} from "../../../database/tables/project_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {NavigationContainer} from "@react-navigation/native";
import {View} from "react-native";

// the holder for the projects stack
const Stack = createStackNavigator();

const projectUpdateHandler = (project, action) => {
    switch (action.type) {
        case "add_tasks":
            return {...project, tasks: action.tasks};
        default:
            return {...project}
    }
}

// the 3 views of a single project
export default function ProjectView({navigation, route}) {
    // ? STATES,CONSTANTS AND CONTEXTS
    const [project, updateProject] = useReducer(projectUpdateHandler, route.params.project);
    // the modal state contains the active modal and the state of the active modal
    const [modalState, updateModalState] = useReducer(setModalState, {
        'active_modal': null,
        'state': 'off',
        'data': null
    });
    const db = useContext(DatabaseContext);
    // ? ............................

    // ? EFFECTS
    useEffect(() => {
        // get the project from the database

        if (modalState.state === 'executed' || project.tasks === undefined) {
            getProjectTasks(db, project.id, updateProject);
            // if the modal state is 'executed' then turn it off
            if (modalState.state === 'executed') {
                updateModalState({modal: null, state: 'off'});
            }
        }
    }, [modalState]);
    // ? ................................................

    // the 3 views of a single project
    return (
        <ProjectContext.Provider value={project}>
            <View style={core_styles.container}>
                <Stack.Navigator screenOptions={{
                    headerTitle: (props) => <ProjectViewButtons current_view={props.children}/>,
                    headerTransparent: true,
                    animationEnabled: false,
                    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()}/>,

                }}>
                    <Stack.Screen name="ProjectDetailsView" component={ProjectDetailsView}/>
                    <Stack.Screen name="ProjectTreeView" component={ProjectTreeView}/>
                    <Stack.Screen name="ProjectTasksView" component={ProjectTasksView}/>
                </Stack.Navigator>
                <View style={{position: 'absolute',backgroundColor:'red', bottom: 0, right: 0,height:100,width:'100%'}}/>
            </View>
        </ProjectContext.Provider>
    );
}
