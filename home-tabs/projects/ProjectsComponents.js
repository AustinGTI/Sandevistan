import {Button, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import React, {useCallback, useContext, useEffect, useMemo, useReducer} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {DatabaseContext} from "../../contexts/global_contexts";
import {addDomain} from "../../database/tables/project_tables";


//region CONSTANTS
export const HEADER_HEIGHT = 50;
//endregion


//region COMPONENTS
// a single button that links to a single project view
const ProjectViewButton = ({view, is_active}) => {
    const navigation = useNavigation();
    const navigate = useCallback(() => navigation.navigate(view), [view]);
    const tap = Gesture.Tap().onBegin(navigate);
    // ? STYLING
    const button_view_styling = {...core_styles.button, ...(is_active ? core_styles.active_button : core_styles.inactive_button)};
    const button_text_styling = {...core_styles.body_text, color: button_view_styling.color};
    return (
        <GestureDetector gesture={tap} key={view}>
            <View style={button_view_styling}>
                <Text style={button_text_styling}>{view.slice(7, -4)}</Text>
            </View>
        </GestureDetector>
    );
}


// a component composed of 3 buttons that allow the user to navigate between the 3 project views
export const ProjectViewButtons = ({current_view}) => {
    const views = ["ProjectDetailsView", "ProjectTasksView", "ProjectTreeView"];
    // ? STYLING
    const buttons_container_styling = {...core_styles.container, flex: 0, flexDirection: 'row'};
    return (
        <View style={buttons_container_styling}>
            {views.map(
                (view, vi) =>
                    <ProjectViewButton view={view} is_active={view === current_view} key={vi}/>
            )}
        </View>
    );
}


// a generic modal container that can be used to display any component, comes from bottom of screen
// the modal has 3 main states: off, partial and full (not visible, small bottom pane visible, full screen visible(up to 80% of screen height))
// there is a 4th state 'executed' which is used to indicate that a task has been completed and the modal should close and main page should refresh
export const ModalContainer = ({children, state, setState}) => {
    const PARTIAL_HEIGHT = 50;
    // ? TOUCH HANDLERS
    const handleOutsideTap = useCallback(() => {
        if (state === 'full') setState('partial');
    }, [state, setState]);
    const onTap = useMemo(() => Gesture.Tap().onBegin(handleOutsideTap), [handleOutsideTap]);
    // ...............

    // ? STYLING
    const modal_container_styling = {
        ...core_styles.container,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    };
    const modal_styling = {
        ...core_styles.container,
        backgroundColor: 'transparent',
        height: (state === 'full' ? '100%' : PARTIAL_HEIGHT),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    };
    const modal_top_view_styling = {flex: (state === 'full' ? 1 : 0)};
    const modal_container_partial_styling = {...modal_container_styling, height: PARTIAL_HEIGHT};
    const modal_container_off_styling = {...modal_container_styling, height: 0};
    const modal_container_styling_map = {
        'off': modal_container_off_styling,
        'partial': modal_container_partial_styling,
        'full': modal_container_styling,
    };
    if (state === 'off' || state === 'executed') return null;

    return <View
        style={modal_styling}>
        {/* if the state is 'full', the top view is an invisible touchable area that sets state to 'partial' on touch */}
        <GestureDetector gesture={onTap}>
            <View style={modal_top_view_styling}/>
        </GestureDetector>

        <View style={modal_container_styling_map[state]}>
            {/* close and expand/collapse buttons */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 5
            }}>
                <Button title={'close'} onPress={() => setState('off')}/>
                <Button title={state === 'full' ? 'collapse' : 'expand'}
                        onPress={() => setState(state === 'full' ? 'partial' : 'full')}/>
            </View>
            {/* the content of the modal if state is full */}
            {state === 'full' && children}
        </View>
    </View>
}

// a wrapper for a modal that allows a user to edit and create db entries
export const ModalForm = ({default_obj, state, setState, children, onSubmit, button_title}) => {
    // ? VALIDATION / DATA MANAGEMENT
    const setObject = useCallback((prev_object, action) => {
        const new_object = {...prev_object};
        // for each key-val pair in the action, update the object
        for (let key in action) {
            new_object[key] = action[key];
        }
        return new_object;
    }, []);
    // .................................

    // ? CONSTANTS
    const db = useContext(DatabaseContext);
    const [object, updateObject] = useReducer(setObject, default_obj);
    // .................................

    // ? EFFECTS
    useEffect(() => {
        // if state is 'executed' or 'off' then reset the form
        if (state === 'executed' || state === 'off') {
            updateObject(default_obj);
        }
    }, [state]);
    // if the key,value pairs of the default object change, update the object
    useEffect(() => {
        updateObject(default_obj);
    }, [JSON.stringify(default_obj)]);
    // .................................

    // ? INPUT HANDLING
    const submitObjectOnClick = useCallback(() => {
        const raw_object = {};
        // first check that all the fields are valid
        for (let key in object) {
            console.log(key + " : " + object[key]['valid']);
            if (!object[key]['valid']) {
                alert("Invalid " + key + " field, ( " + object[key]['error'] + " )");
                return;
            }
            raw_object[key] = object[key]['value'];
        }
        console.log('submitting object: ' + JSON.stringify(raw_object) + ' to db');
        // add the object to the database
        onSubmit(db, raw_object, () => setState('executed'));
    }, [object]);
    // ? ................................

    // ? RENDER
    // add data, data_key and updateForm props to each child based on data_key
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                data: object[child.props.data_key],
                data_key: child.props.data_key,
                updateForm: updateObject
            });
        }
        return child;
    });

    return (
        <ModalContainer state={state} setState={setState}>
            {childrenWithProps}
            <Button title={button_title} onPress={submitObjectOnClick}/>
        </ModalContainer>
    )
    // ................................
}

// a function for setting the modal state of a component based on arguments
// the setModalState function, converts the active modal to the one given and sets its state to the state given
export const setModalState = (prev_state, params) => {
        console.log("setModalState: " + JSON.stringify(params));
        const new_state = {...prev_state};
        // if params is just a string, set state to string
        if (typeof (params) === 'string') {
            new_state['state'] = params;
            return new_state;
        }
        // otherwise set the active modal and its state
        new_state['active_modal'] = params['modal'];
        new_state['state'] = params['state'];

        // if data is included in the params, add it to the state
        if (params['data']) {
            new_state['data'] = params['data'];
        }
        // otherwise set to null (this only happens if params is not a string, that way data is only refreshed on modal change)
        else {
            new_state['data'] = null;
        }
        console.log("new state: " + JSON.stringify(new_state));
        return new_state;
    };


// region INPUT COMPONENTS
// .......................

// a generic text input component
export const CoreTextInput = ({
                                  data,
                                  updateForm,
                                  data_key,
                                  multiline = false,
                                  numeric = false,
                                  required = true,
                                  min_len = 3,
                                  max_len = 16,
                                  style = {}
                              }) => {
    // ? VALIDATION
    const updateData = useCallback((new_val) => {
        const new_data = {value: new_val, valid: true, error: ''};
        // perform validation
        // check if required, if so check if empty
        if (required && new_data.value === '') {
            new_data.valid = false;
            new_data.error = 'This field is required';
        }
        // check if numeric, if so check if not a number
        else if (numeric && isNaN(new_data.value)) {
            new_data.valid = false;
            new_data.error = 'This field must be a number';
        }
        // check if min length is met
        else if (new_data.value.length < min_len) {
            new_data.valid = false;
            new_data.error = `This field must be at least ${min_len} characters long`;
        }
        // check if max length is met
        else if (new_data.value.length > max_len) {
            new_data.valid = false;
            new_data.error = `This field must be at most ${max_len} characters long`;
        }
        // if all checks pass, set valid to true and error to empty string
        else {
            new_data.valid = true;
            new_data.error = '';
        }
        // update the form with the new data and the action type as the key
        updateForm({[data_key]: new_data});
    }, [])

    // ? EFFECTS
    // validate the input data on mount
    useEffect(() => {
        updateData(data.value);
    }, []);

    // ? STYLING
    const text_input_styling = {...core_styles.container, ...style};
    return (
        <View style={text_input_styling}>
            <Text style={core_styles.label}>{data_key}</Text>
            <TextInput
                style={{...core_styles.text_input, ...style}}
                value={data.value}
                onChangeText={text => updateData(text)}
                placeholder={data_key}
                multiline={multiline}
                keyboardType={numeric ? 'numeric' : 'default'}
            />
            {!data.valid && <Text style={core_styles.input_error}>{data.error}</Text>}
        </View>)
}

//endregion

//endregion

//region CLASSES
// .............

// a class that represents a single data point in a form {value: string, valid: boolean, error: string}
export class FormDataPoint {
    constructor(value, valid = true, error = '') {
        this.value = value;
        this.valid = valid;
        this.error = error;
    }
}

//endregion

//region STYLES
// .............

// styles to be applied in general to components of the projects tab
export const core_styles = StyleSheet.create({
    // CONTAINERS
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#000',
        color: '#fff',
    },
    pane: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        margin: 5,
    },

    // TEXT
    header_text: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
        paddingHorizontal: 10,
    },
    body_text: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 5,
    },

    // BUTTONS
    button: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        margin: 2,
        borderRadius: 3,
    },
    active_button: {
        backgroundColor: "#fff",
        color: "#000",
    },
    inactive_button: {
        backgroundColor: "#000",
        color: "#fff",
    },

    // INPUT STYLING
    label: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 5,
        textTransform: "uppercase",
    },
    text_input: {
        backgroundColor: '#fff',
        color: '#000',
        padding: 5,
        margin: 5,
    },
    input_error: {
        color: 'red',
        fontSize: 12,
    }
});

// styles to be applied specifically to the pages of a single project
export const project_styles = StyleSheet.create({
    container: {
        paddingTop: HEADER_HEIGHT,
    }
});

//endregion

//region FUNCTIONS
// .............

// a function to convert a js date object to an am/pm time string with hours and minutes eg. 12:34 pm
export const dateToTimeString = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const am_pm = hours >= 12 ? 'pm' : 'am';
    const hours_12 = hours % 12 || 12;
    return `${hours_12}:${minutes < 10 ? '0' : ''}${minutes} ${am_pm}`;
}


//endregion