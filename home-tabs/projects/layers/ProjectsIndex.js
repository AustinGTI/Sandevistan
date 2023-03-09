import {Text, View, StyleSheet, FlatList, Button, TextInput} from "react-native";
import {addDomain, getDomainsAndProjects} from "../../../database/tables/project_tables";
import {useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {core_styles, ModalContainer} from "../ProjectsComponents";


// component to display a single project pane
function ProjectPane({project, navigation}) {
    const goToProject = useCallback(() => {
        navigation.push("ProjectView", {project: project});
        console.log("go to project: " + project.name);
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

// component to add a new domain that will be displayed in a modal
function AddDomainModal({state, setState}) {
    // ? DOMAIN VALUES
    const db = useContext(DatabaseContext);
    const domain = {
        name: "",
        priority: 1,
        description: "",
        color: "blue",
        icon: "circle",
    };

    // ? INPUT HANDLING
    const handleNameChange = useCallback((text) => {
        // check that the string is not 0 and is less than 20 characters
        if (text.length > 0 && text.length < 20) {
            domain.name = text;
        }
    }, []);
    const handlePriorityChange = useCallback((text) => {
        // convert the text to a number
        const num = parseInt(text);
        // check that the number is between 1 and 5
        if (num >= 1 && num <= 5) {
            domain.priority = num;
        }
    }, []);
    const addDomainOnClick = useCallback(() => {
        // add the domain to the database
        addDomain(db, domain, () => setState('executed'));

    }, []);
    // ? ................................

    return (
        <ModalContainer state={state} setState={setState}>
            <Text>Add a New Domain</Text>
            {/* The user enters the name of the new domain and its priority between 1 and 5 */}
            <TextInput style={core_styles.text_input} placeholder={'Domain Name'} maxLength={20} onChangeText={handleNameChange}/>
            <TextInput style={core_styles.text_input} placeholder={'Priority'} keyboardType={'numeric'} onChangeText={handlePriorityChange}/>
            <Button title={'Add Domain'} onPress={addDomainOnClick}/>
        </ModalContainer>
    )
}


// the tab that will be used to display and edit the projects being worked on
export default function ProjectsIndex({navigation}) {
    // ? STATES AND CONTEXTS
    const [domains, setDomains] = useState([]);
    const [modalState, setModalState] = useState('off');
    const db = useContext(DatabaseContext);
    // ? ............................

    // ? EFFECTS
    useEffect(() => {
        // only refresh when modal state is 'executed'
        if (modalState === 'executed') {
            getDomainsAndProjects(db, setDomains);
            setModalState('off');
        }
    }, [modalState]);
    // ? ............................


    // ? RENDER
    return (
        <View style={domain_styles.container}>
            <Button title={'Add Domain'} onPress={() => setModalState('full')}/>
            <FlatList
                data={domains}
                renderItem={({item}) => <DomainPane domain={item} navigation={navigation}/>}
                keyExtractor={(item) => item.id.toString()}
            />
            <AddDomainModal state={modalState} setState={setModalState}/>
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
