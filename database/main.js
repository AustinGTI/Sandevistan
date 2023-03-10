import * as SQLite from 'expo-sqlite';
import {createProjectTables, dropProjectTables, printProjectTables, seedProjectTables} from "./tables/project_tables";
import {createTimingTables, dropTimingTables, printTimingTables, seedTimingTables} from "./tables/timing_tables";

const SEED = true;

// Create database or open if it exists
const db = SQLite.openDatabase('database.db');

// this is temporary code to drop the tables
dropProjectTables(db);
dropTimingTables(db);

// create the projects tables
createProjectTables(db);
createTimingTables(db);

// create the timing tables
seedProjectTables(db);
seedTimingTables(db);



export default db;


