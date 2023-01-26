import 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from "@react-navigation/drawer";
import SettingsSection from "./sections/SettingsSection";
import HomeSection from "./sections/HomeSection";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test.db');

const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)',
            [],
            () => {
                console.log("Table created");
            },
            error => {
                console.log(error);
            }
        );
    });
}

const insertData = () => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO test (name, age) VALUES (?, ?)',
            ['John', 20],
            () => {
                console.log("Data inserted");
            },
            error => {
                console.log(error);
            }
        );
    });
}

const readData = () => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM test',
            [],
            (tx, results) => {
                console.log(results.rows);
            },
            error => {
                console.log(error);
            }
        );
    });
}


// Create tab navigator
const Drawer = createDrawerNavigator();
export default function App() {
    createTable();
    insertData();
    readData();
    console.log(db);
    // read from database

    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeSection}/>
                <Drawer.Screen name="Settings" component={SettingsSection}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0ff', color: '#f00', alignItems: 'center', justifyContent: 'center',
    },
});
