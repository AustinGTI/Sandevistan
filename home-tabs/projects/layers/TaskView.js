import {core_styles} from "../ProjectsComponents";
import {View, Text, Button} from "react-native";
import React from "react";


export default function TaskView({navigation,route}) {
    const task_id = route.params.task_id;
    // ? STYLING
    const task_view_styling = core_styles.container;
    const task_view_header_styling = core_styles.header_text;
    return (
        <View style={task_view_styling}>
            <Button title={"Back"} onPress={() => navigation.goBack()}/>
            <Text style={task_view_header_styling}>Task View {task_id}</Text>
        </View>
    );
}