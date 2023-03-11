import {Text, View, StyleSheet, FlatList, Button, TextInput, TouchableWithoutFeedback} from "react-native";
import {addDomain, addProject, getDomainsAndProjects} from "../../../database/tables/project_tables";
import React, {useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {DatabaseContext} from "../../../contexts/global_contexts";
import {
    core_styles,
    CoreTextInput,
    FormDataPoint,
    ModalContainer,
    ModalForm,
    setModalState
} from "../ProjectsComponents";
import {useNavigation} from "@react-navigation/native";


// region DATA CLASSES
// the default set of domain data values
class DefaultDomain {
    constructor(params = {}) {
        const {name, priority, description, color, icon} = params;
        this.name = new FormDataPoint(name || "");
        this.priority = new FormDataPoint(priority || 1);
        this.description = new FormDataPoint(description || "");
        this.color = new FormDataPoint(color || "blue");
        this.icon = new FormDataPoint(icon || "circle");
    }
}

// the default set of project data values
class DefaultProject {
    constructor(params = {}) {
        const {name, description, priority,color, icon, domain_id} = params;
        this.name = new FormDataPoint(name || "");
        this.description = new FormDataPoint(description || "");
        this.priority = new FormDataPoint(priority || 1);
        this.color = new FormDataPoint(color || "blue");
        this.icon = new FormDataPoint(icon || "circle");
        this.domain_id = new FormDataPoint(domain_id || 0);
    }
}

// endregion



// region COMPONENTS

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
function DomainPane({domain, touchable, addProject}) {
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
                    {/* add project button */}
                    <Button title={'+'} onPress={addProject}/>
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

// the tab that will be used to display and edit the projects being worked on
// MAIN COMPONENT
export default function ProjectsIndex() {
    // ? STATES,CONSTANTS AND CONTEXTS
    const [domains, setDomains] = useState(null);
    // the modal state contains the active modal and the state of the active modal
    const [modalState, updateModalState] = useReducer(setModalState, {
        'active_modal': null,
        'state': 'off',
        'data': null
    });
    const db = useContext(DatabaseContext);
    // ? ............................

    // ? EFFECTS
    useEffect(() => {
        // only refresh when modal state is 'executed' or component is mounted
        if (modalState.state === 'executed' || domains === null) {
            getDomainsAndProjects(db, setDomains);
            // if the modal state is 'executed' then turn it off
            if (modalState.state === 'executed') {
                updateModalState({modal: null, state: 'off'});
            }
        }
    }, [modalState]);
    // ? ............................

    // ? RENDER
    return (
        <View style={domain_styles.container}>
            <Button title={'Add Domain'} onPress={() => updateModalState({modal: 'add_domain', state: 'full'})}/>
            {/*<Button title={'Add Project'} onPress={() => updateModalState({modal: 'add_project', state: 'full'})}/>*/}
            <FlatList
                data={domains}
                renderItem={({item}) => <DomainPane domain={item} touchable={true} addProject={() => updateModalState({
                    modal: 'add_project',
                    state: 'full',
                    data: {domain_id: item.id}
                })}/>}
                keyExtractor={(item) => item.id.toString()}
            />
            {/* The modal that will be used to add a new domain , modal key is 'add_domain' */}
            {/*function ModalForm({default_obj, state, setState, children, onSubmit, button_title}) {*/}
            <ModalForm default_obj={new DefaultDomain()}
                       state={modalState.active_modal === 'add_domain' ? modalState.state : 'off'}
                       setState={updateModalState}
                       onSubmit={addDomain}
                       button_title={'Add Domain'}>
                <CoreTextInput data_key={'name'}/>
            </ModalForm>

            <ModalForm
                default_obj={new DefaultProject({domain_id: modalState.data ? modalState.data.domain_id : undefined})}
                state={modalState.active_modal === 'add_project' ? modalState.state : 'off'}
                setState={updateModalState}
                onSubmit={addProject}
                button_title={'Add Project'}>
                <CoreTextInput data_key={'name'}/>
            </ModalForm>
        </View>
    )
}

// endregion

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
