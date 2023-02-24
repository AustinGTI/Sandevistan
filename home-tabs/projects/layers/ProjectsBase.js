import {Text, View, StyleSheet, FlatList} from "react-native";
import db from "../../../database/main";
import {getDomainsAndProjects} from "../../../database/tables/project_tables";
import {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";


// component to display a single project pane
function ProjectPane({project}) {
    return (
        <View style={styles.projectPane}>
            <Text>{project.name}</Text>
        </View>
    )
}

// component to display the domain section
function DomainPane({domain}) {
    // const isExpanded  = useSharedValue(false)
    const paneHeight = useSharedValue(0);


    const setIsExpanded = useCallback((state) => {
        paneHeight.value = withTiming(state ? 0 : 1, {duration: 500});
        console.log(paneHeight.value);
        return !state;
    }, []);
    const [isExpanded, toggleIsExpanded] = useReducer(setIsExpanded, false);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: 45 + paneHeight.value * 30 * domain.projects.length,
            backgroundColor: paneHeight.value === 1 ? "red" : "blue",
        }
    });
    const projectPaneBoxStyle = useAnimatedStyle(() => {
        return {
            opacity: (paneHeight.value - 0.5)*2,
        }
    });

    const gesture = useMemo(() => {
        return Gesture.Tap().maxDistance(10).maxDuration(1000)
            .onStart(toggleIsExpanded);
    }, []);
    // noinspection JSValidateTypes
    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.domainPane, animatedStyles]}>
                <View style={styles.domainText}><Text>{domain.name}</Text></View>
                <Animated.View style={[styles.projectPaneContainer,projectPaneBoxStyle]}>
                    {domain.projects.map((project, id) => <ProjectPane project={project} key={id}/>)}
                </Animated.View>
            </Animated.View>
        </GestureDetector>

    )
}


// the tab that will be used to display and edit the projects being worked on
export default function ProjectsBase() {
    const [domains, setDomains] = useState([]);
    useEffect(() => {
        getDomainsAndProjects(db, setDomains);
    }, []);


    return (
        <View style={styles.container}>
            <Text>Projects Base</Text>
            <FlatList
                data={domains}
                renderItem={({item}) => <DomainPane domain={item}/>}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: "red",
    },
    domainPane: {
        flex: 1,
        backgroundColor: "turquoise",
        marginVertical: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    projectPaneContainer: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: "green",
        marginVertical: 5,
        borderRadius: 5,
    },
    projectPane: {
        flex: 1,
        height: 35,
        backgroundColor: "yellow",
        paddingHorizontal: 15,
        marginVertical: 5,
    },
    domainText: {
        height: 35,
    }


});
