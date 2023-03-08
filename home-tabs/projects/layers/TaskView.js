import {core_styles, dateToTimeString} from "../ProjectsComponents";
import {View, Text, Button, FlatList} from "react-native";
import React, {useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {getTaskSessions} from "../../../database/tables/timing_tables";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";

function taskUpdateHandler(task, action) {
    switch (action.type) {
        case 'add_sessions':
            return {...task, sessions: action.sessions};
        default:
            return {...task};
    }
}

// a single time block pane
function SessionPane({session}) {
    // ? LOGIC
    // format timestamps to be more readable
    // timestamps are in the format: "2021-05-05T00:00:00.000Z"
    ['planned_start_time', 'planned_end_time', 'actual_start_time', 'actual_end_time'].forEach((key) => {
        if (session[key] !== null && session[key] !== undefined) {
            session[key] = new Date(session[key]);
        }
    });
    let session_state;
    // there are 4 possible session states depending on the timestamps
    // if the actual start time is null and the actual end time is null
    if (session.actual_start_time === null && session.actual_end_time === null) {
        // if the planned end time is in the future, the session is 'upcoming'
        if (session.planned_end_time > new Date()) {
            session_state = 'upcoming';
        }
        // if the planned end time is in the past, the session is 'missed'
        else {
            session_state = 'missed';
        }
    }
    // if the actual start time is not null but the actual end time is null, the session is 'in progress'
    else if (session.actual_start_time !== null && session.actual_end_time === null) {
        session_state = 'in progress';
    }
    // if both actual start time and actual end time are not null
    else {
        // if the planned start time and end time are null, the session is 'completed-unplanned'
        if (session.planned_start_time === null && session.planned_end_time === null) {
            session_state = 'completed-unplanned';
        }
        // if the planned start time and end time are not null, the session is 'completed-planned'
        else if (session.planned_start_time !== null && session.planned_end_time !== null) {
            session_state = 'completed-planned';
        }
    }

    // there are 4 sections to a session pane, each with different attributes depending on the session state
    // these sections correspond to 'duration', 'planned_time', 'actual_time', 'color of end bar (red if missed, green if completed , blue if in progress, yellow if upcoming)'
    let session_section_data;
    session_section_data = ['', '', '', ''];
    switch (session_state) {
        case 'upcoming':
            session_section_data[0] = 0;
            session_section_data[1] = `${dateToTimeString(session.planned_start_time)} - ${dateToTimeString(session.planned_end_time)}`;
            session_section_data[2] = 'Upcoming';
            session_section_data[3] = 'yellow';
            break;
        case 'missed':
            session_section_data[0] = 0;
            session_section_data[1] = `Planned | ${dateToTimeString(session.planned_start_time)} - ${dateToTimeString(session.planned_end_time)}`;
            session_section_data[2] = 'Missed';
            session_section_data[3] = 'red';
            break;
        case 'in progress':
            session_section_data[0] = Math.round((new Date() - session.actual_start_time) / 60000);
            session_section_data[1] = `Planned | ${dateToTimeString(session.planned_start_time)} - ${dateToTimeString(session.planned_end_time)}`;
            session_section_data[2] = `Actual | ${dateToTimeString(session.actual_start_time)} - Now`;
            session_section_data[3] = 'blue';
            break;
        case 'completed-planned':
            session_section_data[0] = Math.round((session.actual_end_time - session.actual_start_time) / 60000);
            session_section_data[1] = `Planned | ${dateToTimeString(session.planned_start_time)} - ${dateToTimeString(session.planned_end_time)}`;
            session_section_data[2] = `Actual | ${dateToTimeString(session.actual_start_time)} - ${dateToTimeString(session.actual_end_time)}`;
            session_section_data[3] = 'green';
            break;
        case 'completed-unplanned':
            session_section_data[0] = Math.round((session.actual_end_time - session.actual_start_time) / 60000);
            session_section_data[1] = 'Unplanned';
            session_section_data[2] = `Actual | ${dateToTimeString(session.actual_start_time)} - ${dateToTimeString(session.actual_end_time)}`;
            session_section_data[3] = 'green';
            break;
    }

    // ? TOUCH HANDLERS
    const navigation = useNavigation();
    const goToSession = useCallback(() => {
        navigation.push("SessionView", {session_id: session.id});
        console.log("go to session");
    }, [session]);

    const onTap = useMemo(() => Gesture.Tap().onEnd(goToSession), [goToSession]);

    // ? STYLING
    const session_pane_styling = core_styles.pane;
    const session_duration_section_styling = {
        flex: 0,
        marginHorizontal: 4,
        alignItems: 'center',
        width: 60,
        borderRightWidth: 1,
        borderRightColor: 'grey',
    }
    const session_time_section_styling = {
        flex: 1,
        height: 40,
        justifyContent: 'space-between',
    }
    const session_end_bar_styling = {
        flex: 0, backgroundColor: session_section_data[3], width: 10, height: '100%'
    }

    const session_pane_heavy_text_styling = core_styles.header_text;
    const session_pane_light_text_styling = {
        ...core_styles.body_text,
        fontSize: 11,
        color: 'grey',
        textTransform: 'uppercase'
    };
    const session_pane_mins_text_styling = {
        ...session_pane_light_text_styling,
        color: 'white',
    }

    return (
        <GestureDetector gesture={onTap}>
            <View style={session_pane_styling}>
                <View style={session_duration_section_styling}>
                    <Text style={session_pane_heavy_text_styling}>{session_section_data[0]}</Text>
                    <Text style={session_pane_mins_text_styling}>MINS</Text>
                </View>
                <View style={session_time_section_styling}>
                    <View>
                        <Text style={session_pane_light_text_styling}>{session_section_data[1]}</Text>
                    </View>
                    <View>
                        <Text style={session_pane_light_text_styling}>{session_section_data[2]}</Text>
                    </View>
                </View>
                <View style={session_end_bar_styling}></View>
            </View>
        </GestureDetector>
    );
}

// a block of time block panes that represent a single date
function SessionsDateView({date, sessions}) {
    // if date is today, set to 'Today', if date is tomorrow, set to 'Tomorrow', if date is yesterday, set to 'Yesterday'
    if (date === new Date().toDateString()) {
        date = 'Today';
    } else if (date === new Date(new Date().getTime() + 86400000).toDateString()) {
        date = 'Tomorrow';
    } else if (date === new Date(new Date().getTime() - 86400000).toDateString()) {
        date = 'Yesterday';
    }
    // ? STYLING
    const sessions_date_view_styling = core_styles.container;
    const sessions_date_view_header_styling = {
        ...core_styles.body_text,
        fontSize: 11,
        color: 'grey',
        textTransform: 'uppercase'
    };
    return (
        <View style={sessions_date_view_styling}>
            <Text style={sessions_date_view_header_styling}>{date}</Text>
            <FlatList data={sessions}
                      renderItem={(item) => {
                          return (
                              <SessionPane session={item.item}/>
                          );
                      }} keyExtractor={(item) => item.id} listKey={date}/>
        </View>
    );
}

export default function TaskView({navigation, route}) {
    const [task, updateTask] = useReducer(taskUpdateHandler, route.params.task);
    const db = useContext(DatabaseContext);
    useEffect(() => {
        getTaskSessions(db, task.id, updateTask)
    }, [])

    const sessions_by_date = task.sessions !== undefined && task.sessions !== null && task.sessions.length > 0 ?
        task.sessions.reduce((acc, session) => {
            const date = new Date(session.planned_start_time).toDateString();
            if (acc[date] === undefined) {
                acc[date] = [];
            }
            acc[date].push(session);
            return acc;
        }, {}) : {};
    // ? STYLING
    const task_view_styling = core_styles.container;
    const task_view_header_styling = core_styles.header_text;

    return (
        <View style={task_view_styling}>
            <Button title={"Back"} onPress={() => navigation.goBack()}/>
            <Text style={task_view_header_styling}>Task View {task.name} - {task.id}</Text>
            <FlatList data={Object.entries(sessions_by_date)}
                      renderItem={(item) => <SessionsDateView date={item.item[0]} sessions={item.item[1]}/>}
            />
        </View>);
}