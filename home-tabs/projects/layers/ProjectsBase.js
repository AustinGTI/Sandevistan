import {Text, View, StyleSheet} from "react-native";
import db from "../../../database/main";
import {printProjectTables, seedProjectTables} from "../../../database/tables/project_tables";

// the tab that will be used to display and edit the projects being worked on
export default function ProjectsBase() {
    printProjectTables(db);
    return (
        <View style={styles.container}>
            <Text>Projects Base</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: "red",
    }
});
