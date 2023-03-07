import {core_styles, dateToTimeString, formatTimestamp} from "../ProjectsComponents";
import {View, Text, Button, FlatList} from "react-native";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {getTaskTimeBlocks} from "../../../database/tables/timing_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";

function taskUpdateHandler(task, action) {
    switch (action.type) {
        case 'add_time_blocks':
            return {...task, time_blocks: action.time_blocks};
        default:
            return {...task};
    }
}

// a single time block pane
function TimeBlockPane({time_block}) {
    // format timestamps to be more readable
    // timestamps are in the format: "2021-05-05T00:00:00.000Z"
    ['planned_start_time', 'planned_end_time', 'actual_start_time', 'actual_end_time'].forEach((key) => {
        if (time_block[key] !== null && time_block[key] !== undefined) {
            time_block[key] = new Date(time_block[key]);
        }
    });
    // ? STYLING
    const time_block_pane_styling = core_styles.pane;
    const time_block_pane_text_styling = core_styles.body_text;

    return (
        <View style={time_block_pane_styling}>
            <Text style={time_block_pane_text_styling}>
                {dateToTimeString(time_block.planned_start_time)} -
                {dateToTimeString(time_block.planned_end_time)}
            </Text>
        </View>
    );
}

// a block of time block panes that represent a single date
function TimeBlockDateView({date, time_blocks}) {
    // if date is today, set to 'Today', if date is tomorrow, set to 'Tomorrow', if date is yesterday, set to 'Yesterday'
    if (date === new Date().toDateString()) {
        date = 'Today';
    } else if (date === new Date(new Date().getTime() + 86400000).toDateString()) {
        date = 'Tomorrow';
    } else if (date === new Date(new Date().getTime() - 86400000).toDateString()) {
        date = 'Yesterday';
    }
    // ? STYLING
    const time_block_date_view_styling = core_styles.container;
    const time_block_date_view_header_styling = core_styles.header_text;
    return (
        <View style={time_block_date_view_styling}>
            <Text style={time_block_date_view_header_styling}>{date}</Text>
            <FlatList data={time_blocks}
                      renderItem={(item) => {
                          return (
                              <TimeBlockPane time_block={item.item}/>
                          );
                      }} keyExtractor={(item) => item.id} listKey = {date}/>
        </View>
    );
}

export default function TaskView({navigation, route}) {
    const [task, updateTask] = useReducer(taskUpdateHandler, route.params.task);
    const db = useContext(DatabaseContext);
    useEffect(() => {
        getTaskTimeBlocks(db, task.id, updateTask)
    }, [])
    const date_blocks = task.time_blocks !== undefined && task.time_blocks !== null && task.time_blocks.length > 0 ?
        task.time_blocks.reduce((acc, time_block) => {
            const date = new Date(time_block.planned_start_time).toDateString();
            if (acc[date] === undefined) {
                acc[date] = [];
            }
            acc[date].push(time_block);
            return acc;
        }, {}) : {};
    // ? STYLING
    const task_view_styling = core_styles.container;
    const task_view_header_styling = core_styles.header_text;

    return (
        <View style={task_view_styling}>
            <Button title={"Back"} onPress={() => navigation.goBack()}/>
            <Text style={task_view_header_styling}>Task View {task.name} - {task.id}</Text>
            <FlatList data={Object.entries(date_blocks)}
                      renderItem={(item) => <TimeBlockDateView date={item.item[0]} time_blocks={item.item[1]}/>}
                      />
        </View>);
}