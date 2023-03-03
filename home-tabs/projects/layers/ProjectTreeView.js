import { View, Text, StyleSheet } from 'react-native';
import {core_styles, project_styles} from "../ProjectsComponents";
import {useContext} from "react";
import {ProjectContext} from "../../../contexts/project_contexts";


export default function ProjectTreeView() {
    const project = useContext(ProjectContext);

    // ? STYLING
    const project_details_view_styling = {...core_styles.container,...project_styles.container};
    return (
        <View style={project_details_view_styling}>
            <Text style={core_styles.body_text}>{project.name} Tree View.</Text>
        </View>
    );
}
