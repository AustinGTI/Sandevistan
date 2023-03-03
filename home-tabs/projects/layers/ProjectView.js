import ProjectDetailsView from "./ProjectDetailsView";
import ProjectTreeView from "./ProjectTreeView";
import ProjectTasksView from "./ProjectTasksView";
import {createStackNavigator} from "@react-navigation/stack";
import {ProjectViewButtons} from "../ProjectsComponents";
import {ProjectContext} from "../../../contexts/project_contexts";
import {HeaderBackButton} from "@react-navigation/elements";
import {useContext, useEffect, useState} from "react";
import {getProjectAndTasks} from "../../../database/tables/project_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";

// the holder for the projects stack
const Stack = createStackNavigator();

// the 3 views of a single project
export default function ProjectView({navigation,route}) {
    const [project, setProject] = useState({});
    const project_id = route.params.project_id;
    const db = useContext(DatabaseContext);
    useEffect(() => {
        // get the project from the database
        getProjectAndTasks(db, project_id, setProject);
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
