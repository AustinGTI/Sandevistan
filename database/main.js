import * as SQLite from 'expo-sqlite';
import {createProjectTables, dropProjectTables, printProjectTables, seedProjectTables} from "./tables/project_tables";
import {createTimingTables, dropTimingTables, printTimingTables, seedTimingTables} from "./tables/timing_tables";

const SEED = true;

// Create database or open if it exists
const db = SQLite.openDatabase('database.db');

// create the projects tables
createProjectTables(db);
createTimingTables(db);


// this is temporary code to drop the tables
dropTimingTables(db);
// create the timing tables
seedProjectTables(db);
seedTimingTables(db);

// print the first 10 time blocks in the time_block table
printTimingTables(db, 10);


export default db;


