import React, {useCallback, useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import Animated from "react-native-reanimated";

// function that takes in time in seconds and returns an array with the time in hours, minutes, and seconds
function secondsToTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 3600) / 60);
    let seconds = time - hours * 3600 - minutes * 60;
    return [hours, minutes, seconds];
}

// function that converts an int to a string and pads it up to the given length with 0s
function pad(num, size) {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
}


export default function TimingTab() {
    // declare state variable time that stores the time left on the timer
    const [time, setTime] = useState(60);
    // declare state variable that stores a boolean value for whether the timer is running
    const [isRunning, setIsRunning] = useState(false);
    //derive the hours, minutes, and seconds from the time and pad them with 0s
    let [hours, minutes, seconds] = secondsToTime(time).map((t) => pad(t, 2));
    // declare a function that updates the time state variable based on the new hours, minutes, and seconds
    const updateTime = useCallback((hrs, mins, scs) => {
        // set value to 0 if it is null or negative or not a number
        if (hrs === "" || hrs < 0 || isNaN(hrs)) hrs = 0;
        if (mins === "" || mins < 0 || isNaN(mins)) mins = 0;
        if (scs === "" || scs < 0 || isNaN(scs)) scs = 0;
        // convert hours minutes and seconds to integers then add them together to get the total time in seconds
        let newTime = parseInt(hrs) * 3600 + parseInt(mins) * 60 + parseInt(scs);
        // update the time state variable
        setTime(newTime);
        // update the hours, minutes and seconds variables
        [hours, minutes, seconds] = secondsToTime(newTime).map((t) => pad(t, 2));

    }, []);

    // count down the timer if isRunning and time is greater than 0
    if (isRunning && time > 0) {
        setTimeout(() => {
            setTime(time - 1);
        }, 1000);
    }

    return (
        <View style={styles.container}>
            <View style={styles.titlebox}>
                <Text style={styles.title}>POMODORO TIMER</Text>
            </View>
            <View style={styles.timebox}>
                {/* If the timer is running, display static text of the time, else display text inputs to change the time */}
                {isRunning ? (
                    <Text style={styles.time}>{`${hours}:${minutes}:${seconds}`}</Text>
                ) : (
                    <>
                        <TextInput style={styles.time} defaultValue={hours} placeholder={'00'}
                                   onChangeText={hrs => updateTime(hrs, minutes, seconds)}></TextInput>
                        <Text style={styles.time}>:</Text>
                        <TextInput style={styles.time} defaultValue={minutes} placeholder={'00'}
                                   onChangeText={mins => updateTime(hours, mins, seconds)}></TextInput>
                        <Text style={styles.time}>:</Text>
                        <TextInput style={styles.time} defaultValue={seconds} placeholder={'00'}
                                   onChangeText={secs => updateTime(hours, minutes, secs)}></TextInput>
                    </>
                )}

            </View>
            <View style={styles.btnbox}>
                <Button title={isRunning ? "Stop" : "Start"} onPress={() => setIsRunning(!isRunning)}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink",
    }
    , timebox: {
        height: 200,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    }
    , time: {
        fontSize: 60,
        fontFamily: "monospace",
        color: "black"
    }
    , btnbox: {
        flexDirection: "row",
        justifyContent: "space-around",
    }
    , titlebox: {
        alignItems: "center",
    }
    , title: {
        fontSize: 30,
    }
});