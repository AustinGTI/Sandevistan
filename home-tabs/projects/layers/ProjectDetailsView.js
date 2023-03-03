import React, {useContext, useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {getProjectAndTasks} from "../../../database/tables/project_tables";
import db from "../../../database/main";
import {ProjectContext} from "../../../contexts/project_contexts";
import {useHeaderHeight} from "@react-navigation/elements";
import {core_styles, HEADER_HEIGHT, project_styles} from "../ProjectsComponents";


export default function ProjectDetailsView() {
    const project = useContext(ProjectContext);
    // ? STYLING
    const project_details_view_styling = {...core_styles.container,...project_styles.container};
    const project_details_header_styling = core_styles.header_text;
    const project_details_body_styling = core_styles.body_text;
    return (
        <View style={project_details_view_styling}>
            <Text style={project_details_header_styling}>{project.name}</Text>
            <Text style={project_details_body_styling}>{project.description}</Text>
        </View>
    )
}
