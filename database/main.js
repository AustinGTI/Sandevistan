import * as SQLite from 'expo-sqlite';
import {createProjectTables, dropProjectTables, printProjectTables, seedProjectTables} from "./tables/project_tables";

const SEED = true;

// Create database or open if it exists
const db = SQLite.openDatabase('database.db');

// create the projects' section tables
createProjectTables(db);
seedProjectTables(db);


console.log(db);
export default db;


