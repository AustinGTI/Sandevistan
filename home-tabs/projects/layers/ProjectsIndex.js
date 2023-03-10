import {Text, View, StyleSheet, FlatList, Button, TextInput, TouchableWithoutFeedback} from "react-native";
import {addDomain, getDomainsAndProjects} from "../../../database/tables/project_tables";
import {useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {core_styles, CoreTextInput, FormDataPoint, ModalContainer} from "../ProjectsComponents";
import {useNavigation} from "@react-navigation/native";


// component to display a single project pane
function ProjectPane({project, touchable}) {
    const navigation = useNavigation();
    const goToProject = useCallback(() => {
        if (touchable) {
            navigation.push("ProjectView", {project: project});
            console.log("go to project: " + project.name);
        }
    }, [project, touchable]);

    const onTap = useMemo(() => Gesture.Tap().onEnd(goToProject), [goToProject]);
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
function DomainPane({domain, touchable}) {
    const [is_expanded, setExpanded] = useState(false);
    const expandContract = useCallback(() => {
        if (touchable) setExpanded(!is_expanded);
    }, [is_expanded, touchable]);
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
                    <FlatList data={domain.projects}
                              renderItem={({item}) => <ProjectPane project={item} touchable={touchable}/>}
                              keyExtractor={(item) => item.id.toString()}/>
                </View>}
        </View>

    )
}

// the default set of domain data values
class DefaultDomain {
    constructor() {
        this.name = new FormDataPoint("");
        this.priority = new FormDataPoint(1);
        this.description = new FormDataPoint("");
        this.color = new FormDataPoint("blue");
        this.icon = new FormDataPoint("circle");
    }
}

// component to add a new domain that will be displayed in a modal
function AddDomainModal({state, setState}) {
    // ? VALIDATION / DATA MANAGEMENT
    const setDomain = useCallback((prev_domain, action) => {
        const new_domain = {...prev_domain};
        // for each key-val pair in the action, update the domain
        for (let key in action) {
            new_domain[key] = action[key];
        }
        return new_domain;
    }, []);


    // ? CONSTANTS
    const db = useContext(DatabaseContext);
    const [domain, updateDomain] = useReducer(setDomain, new DefaultDomain());

    // ? EFFECTS
    useEffect(() => {
        // if state is 'executed' or 'off' then reset the form
        if (state === 'executed' || state === 'off') {
            updateDomain(new DefaultDomain());
        }
    }, [state]);

    // ? INPUT HANDLING
    const addDomainOnClick = useCallback(() => {
        const raw_domain = {};
        // first check that all the fields are valid
        for (let key in domain) {
            console.log(key + " : " + domain[key]['valid']);
            if (!domain[key]['valid']) {
                alert("Invalid " + key + " field, ( " + domain[key]['error'] + " )");
                return;
            }
            raw_domain[key] = domain[key]['value'];
        }
        // add the domain to the database
        addDomain(db, raw_domain, () => setState('executed'));

    }, [domain]);
    // ? ................................

    return (
        <ModalContainer state={state} setState={setState}>
            <Text>Add a New Domain</Text>
            {/* The user enters the name of the new domain and its priority between 1 and 5 */}
            <CoreTextInput data={domain.name} data_key={'name'} updateForm={updateDomain}/>
            <Button title={'Add Domain'} onPress={addDomainOnClick}/>
        </ModalContainer>
    )
}


// the tab that will be used to display and edit the projects being worked on
export default function ProjectsIndex() {
    // ? STATES,CONSTANTS AND CONTEXTS
    const [domains, setDomains] = useState(null);
    const [modalState, setModalState] = useState('off');
    const db = useContext(DatabaseContext);
    // ? ............................

    // ? EFFECTS
    useEffect(() => {
        // only refresh when modal state is 'executed' or component is mounted
        if (modalState === 'executed' || domains === null) {
            getDomainsAndProjects(db, setDomains);
            setModalState('off');
        }
    }, [modalState]);
    console.log(modalState);
    // ? ............................


    // ? RENDER
    return (
        <View style={domain_styles.container}>
            <Button title={'Add Domain'} onPress={() => setModalState('full')}/>
            <FlatList
                data={domains}
                renderItem={({item}) => <DomainPane domain={item} touchable={true}/>}
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
