import {core_styles} from "../ProjectsComponents";
import {View, Text, Button, FlatList} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {getTaskAndTimeBlocks} from "../../../database/tables/timing_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";


export default function TaskView({navigation, route}) {
    const task_id = route.params.task_id;
    const db = useContext(DatabaseContext);
    const [task, setTask] = useState([]);
    useEffect(() => {
        getTaskAndTimeBlocks(db, task_id, setTask)

    })
    // ? STYLING
    const task_view_styling = core_styles.container;
    const task_view_header_styling = core_styles.header_text;
    return (
        <View style={task_view_styling}>
            <Button title={"Back"} onPress={() => navigation.goBack()}/>
            <Text style={task_view_header_styling}>Task View {task.name}</Text>
            <FlatList data={task.time_blocks}
                      renderItem={(item) => <Text>{item.planned_start_time} - {item.planned_end_time}</Text>}
                      keyExtractor={(item) => item.id}/>
        </View>
    );
}