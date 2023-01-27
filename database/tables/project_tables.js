// function to create the project tables
import {faker} from "@faker-js/faker";

export function createProjectTables(db) {
    db.transaction(tx => {
        // creating the domains table
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS domains (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, description TEXT, color TEXT NOT NULL, icon TEXT NOT NULL, priority INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);'
        );
        // creating the projects table
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT UNIQUE NOT NULL, description TEXT, color TEXT NOT NULL, priority INTEGER NOT NULL,domain_id INTEGER NOT NULL, deadline TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE);'
        );
        // creating the tasks table
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, description TEXT, color TEXT NOT NULL, estimated_time INTEGER NOT NULL, elapsed_time INTEGER NOT NULL, minimum_time INTEGER NOT NULL, maximum_time INTEGER NOT NULL, project_id INTEGER NOT NULL,  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE);'
        );
        // todo :create a many to many table between tasks to create a task tree : each entry indicates that the 'first' task must be completed before the 'second' task can be started
    },
        (error) => {
            console.log(error);
        },
        () => {
            console.log('Project tables created successfully');
        }
    );

}

// function to seed the project tables with fake data
export function seedProjectTables(db) {
    // todo: seed the project tables with fake data
    console.log('Seeding the project tables with fake data...');
    let domains = domainSeeder(0);
    db.transaction(tx => {
        domains.forEach(domain => {
            console.log(domain);
            tx.executeSql(
                'INSERT INTO domains (name, description, color, icon, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
                [domain.name, domain.description, domain.color, domain.icon, domain.priority, domain.created_at, domain.updated_at],
                (tx, results) => {
                    console.log('seeded domain: ' + results.insertId);
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        });
    },
        (error) => {
            console.log('seed error ',error);
        },
        () => {
            console.log('Project tables seeded successfully...');
        }
    );
}

// function to drop the project tables
export function dropProjectTables(db) {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS domains;'
        );
        tx.executeSql(
            'DROP TABLE IF EXISTS projects;'
        );
        tx.executeSql(
            'DROP TABLE IF EXISTS tasks;'
        );
    });
}

// print out the attributes of the project tables
export function printProjectTables(db) {
    console.log('printing the project tables');
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM domains;',
            [],
            (_, {rows: {_array}}) => console.log('domains: ', _array.length)
        );
        tx.executeSql(
            'SELECT * FROM projects;',
            [],
            (_, {rows: {_array}}) => console.log(_array)
        );
        tx.executeSql(
            'SELECT * FROM tasks;',
            [],
            (_, {rows: {_array}}) => console.log(_array)
        );
    },
        (error) => {
            console.log(error);
        },
        () => {
            console.log('Project tables printed successfully');
        }
    );
}


// SEEDER FUNCTIONS
function domainSeeder(num) {
    let domains = [];
    for (let i = 0; i < num; i++) {
        domains.push({
            name: faker.random.word(),
            description: faker.lorem.paragraph(),
            color: faker.internet.color(),
            icon: faker.internet.avatar(),
            priority:Math.round(Math.random() * 5),
            created_at: faker.date.past().toDateString(),
            updated_at: faker.date.recent().toDateString(),
        });
    }
    return domains;
}