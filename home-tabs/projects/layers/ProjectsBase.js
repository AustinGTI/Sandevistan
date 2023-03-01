import {Text, View, StyleSheet, FlatList} from "react-native";
import db from "../../../database/main";
import {getDomainsAndProjects} from "../../../database/tables/project_tables";
import {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";


// component to display a single project pane
function ProjectPane({project, navigation}) {
    const goToProject = useCallback(() => {
        navigation.push("ProjectView", {project_id: project.id});
    }, [project]);

    const onTap = useMemo(() => Gesture.Tap().onEnd(goToProject),[goToProject]);
    return (
        <GestureDetector gesture={onTap}>
            <View style={project_styles.pane}>
                {/* todo: add project icon for now circle */}
                <View style={{height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: "blue"}}/>
                <Text style={[project_styles.text, {flexGrow: 1}]}>{project.name}</Text>
                {/* todo: add project completion progress bar (its own component) for now just rectangle */}
                <View style={{height: 15, width: 50, borderRadius: 2, backgroundColor: "green"}}/>
                {/* todo: convert priority from number to color for now just number */}
                <Text style={project_styles.text}>{project.priority}</Text>
            </View>
        </GestureDetector>
    )
}

// component to display the domain section
function DomainPane({domain , navigation}) {
    const [is_expanded, setExpanded] = useState(false);
    const expandContract = useCallback(() => {
        setExpanded(!is_expanded);
    }, [is_expanded]);
    const onTap = useMemo(() => Gesture.Tap().onEnd(expandContract), [expandContract]);
    return (
        <View>
            <GestureDetector gesture={onTap}>
                <View style={domain_styles.pane}>
                    {/* todo: add real domain icon, for now circle */}
                    <View style={{height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: "blue"}}/>
                    <Text style={[domain_styles.text, {flexGrow: 1}]}>{domain.name}</Text>

                    {/* todo: convert priority from number to color for now just number */}
                    <Text style={domain_styles.text}>{domain.priority}</Text>
                </View>
            </GestureDetector>
            {is_expanded &&
                <View style={project_styles.container}>
                    <FlatList data={domain.projects} renderItem={({item}) => <ProjectPane project={item} navigation={navigation}/>}
                              keyExtractor={(item) => item.id.toString()}/>
                </View>}
        </View>

    )
}


// the tab that will be used to display and edit the projects being worked on
export default function ProjectsBase({navigation}) {
    const [domains, setDomains] = useState([]);
    useEffect(() => {
        getDomainsAndProjects(db, setDomains);
    }, []);


    return (
        <View style={domain_styles.container}>
            <Text>Projects Base</Text>
            <FlatList
                data={domains}
                renderItem={({item}) => <DomainPane domain={item} navigation={navigation}/>}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

const domain_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    pane: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5,

        paddingVertical: 10,
        paddingHorizontal: 5,
        margin: 5,
    },
    text: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
        paddingHorizontal: 5,
    }
});

const project_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    pane: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 7,

        padding: 5,
        marginHorizontal: 10,
    },
    text: {
        color: "#fff",
        fontSize: 15,
        textTransform: "capitalize",
        paddingHorizontal: 5,
    }
});
