import ProjectDetailsView from "./ProjectDetailsView";
import ProjectTreeView from "./ProjectTreeView";
import ProjectTasksView from "./ProjectTasksView";
import {createStackNavigator} from "@react-navigation/stack";
import {ProjectViewButtons} from "../ProjectsComponents";
import {ProjectContext} from "../../../contexts/project_contexts";
import {HeaderBackButton} from "@react-navigation/elements";
import {useContext, useEffect, useReducer, useState} from "react";
import {getProjectTasks} from "../../../database/tables/project_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";

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
    const [project, updateProject] = useReducer(projectUpdateHandler, route.params.project);
    const db = useContext(DatabaseContext);
    useEffect(() => {
        // get the project from the database
        getProjectTasks(db, project.id, updateProject);
    }, []);

    // the 3 views of a single project
    return (
        <ProjectContext.Provider value={project}>
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
        </ProjectContext.Provider>
    );
}
