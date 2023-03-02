import { View, Text, StyleSheet } from 'react-native';
import {general_styles, HEADER_HEIGHT} from "../ProjectsComponents";
import {useContext} from "react";
import {ProjectContext} from "../contexts/project_contexts";


export default function ProjectTreeView() {
    const project_id = useContext(ProjectContext);
    return (
        <View style={[general_styles.container,{paddingTop:HEADER_HEIGHT}]}>
            <Text style={general_styles.text}>Project Tree View {project_id}</Text>
        </View>
    );
}
