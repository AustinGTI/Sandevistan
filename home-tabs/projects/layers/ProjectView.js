import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {getProjectAndTasks} from "../../../database/tables/project_tables";
import db from "../../../database/main";


export default function ProjectView({route, navigation}) {
    const {project_id} = route.params;
    const [project, setProject] = useState({});
    useEffect(() => {
        // get the project from the database
        getProjectAndTasks(db, project_id, setProject);
    }, []);
    return (
        <View style={project_styles.container}>
            <Text style={project_styles.heading_text}>{project.name}</Text>
            <Text style={project_styles.body_text}>{project.description}</Text>
        </View>
    )
}

const project_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    heading_text: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
    },
    body_text: {
        color: "#fff",
        fontSize: 15,
    }
});