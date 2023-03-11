import {View, Text, StyleSheet, Modal} from 'react-native';
import {core_styles, HEADER_HEIGHT, ModalForm, project_styles} from "../ProjectsComponents";
import {useHeaderHeight} from "@react-navigation/elements";
import {ProjectContext} from "../../../contexts/project_contexts";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";


function TaskPane({task}) {
    // ? ON CLICK
    const navigation = useNavigation()
    const goToTask = useCallback(() => {
        navigation.push("TaskView", {task: task});
        console.log("go to task: " + task.name);
    }, [task]);

    const onTap = useMemo(() => Gesture.Tap().onEnd(goToTask), [goToTask]);
    // ? STYLING
    const task_pane_container_styling = core_styles.pane;
    const task_pane_text_styling = {...core_styles.body_text, flex: 1};
    return (
        <GestureDetector gesture={onTap}>
            <View style={task_pane_container_styling}>
                {/* todo: add project icon for now circle */}
                <View style={{height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: "purple"}}/>
                <Text style={task_pane_text_styling}>{task.name}</Text>
                {/* todo: add project completion progress bar (its own component) for now just rectangle */}
                <View style={{height: 15, width: 50, borderRadius: 2, backgroundColor: "green"}}/>
            </View>
        </GestureDetector>
    );
}


export default function ProjectTasksView() {
    const project = useContext(ProjectContext);
    const tasks = project.tasks;

    // ? STYLING
    const project_tasks_view_styling = {...core_styles.container, ...project_styles.container};
    return (
        <View style={project_tasks_view_styling}>
            <Text style={core_styles.header_text}>{project.name} Tasks</Text>
            {
                (tasks.length > 0) ?
                    tasks.map((task, idx) => {
                        return (
                            <TaskPane key={idx} task={task}/>
                        )
                    }) : <Text style={core_styles.body_text}>No tasks yet...</Text>
            }
        </View>
    );
}