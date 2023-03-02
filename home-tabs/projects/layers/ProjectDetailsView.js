import React, {useContext, useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {getProjectAndTasks} from "../../../database/tables/project_tables";
import db from "../../../database/main";
import {ProjectContext} from "../contexts/project_contexts";
import {useHeaderHeight} from "@react-navigation/elements";
import {HEADER_HEIGHT} from "../ProjectsComponents";


export default function ProjectDetailsView() {
    const project_id = useContext(ProjectContext);
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
        padding:5,
        paddingTop: HEADER_HEIGHT,
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