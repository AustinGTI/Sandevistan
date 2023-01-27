import * as SQLite from 'expo-sqlite';
import {createProjectTables, printProjectTables, seedProjectTables} from "./tables/project_tables";

const SEED = true;

// Create database or open if it exists
const db = SQLite.openDatabase('database.db');

// create the projects' section tables
createProjectTables(db);
seedProjectTables(db);

export default db;


