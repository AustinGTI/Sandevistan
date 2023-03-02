import { View, Text, StyleSheet } from 'react-native';
import {general_styles, HEADER_HEIGHT} from "../ProjectsComponents";
import {useHeaderHeight} from "@react-navigation/elements";
import {ProjectContext} from "../contexts/project_contexts";
import {useContext} from "react";


export default function ProjectTasksView() {
    const project_id = useContext(ProjectContext);
    return (
        <View style={[general_styles.container,{paddingTop:HEADER_HEIGHT}]}>
            <Text style={general_styles.text}>Project Tasks View for {project_id}</Text>
        </View>
    );
}