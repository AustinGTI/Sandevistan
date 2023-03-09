import {faker} from "@faker-js/faker";

// function to create the project tables
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
export function seedProjectTables(db, only_if_empty = true) {
    // if the only_if_empty flag is set to true, then the tables will only be seeded if they are empty
    const seeder_amounts = {
        domains: 3,
        projects: 7,
        tasks: 25,
    }
    const table_seeder_pairs = {
        domains: domainSeeder,
        projects: (num) => projectSeeder(num,seeder_amounts.domains),
        tasks: (num) => taskSeeder(num,seeder_amounts.projects),
}
    db.transaction(tx => {
            for (const table_name in table_seeder_pairs) {
                // checking if the table is empty
                tx.executeSql(
                    'SELECT * FROM ' + table_name + ';',
                    [],
                    (tx, results) => {
                        if (results.rows.length === 0 || !only_if_empty) {
                            // seeding the table
                            const seeder = table_seeder_pairs[table_name];
                            const num = seeder_amounts[table_name];
                            const data = seeder(num);
                            for (const entry of data) {
                                let keys = [];
                                let values = [];
                                for (const key in entry) {
                                    keys.push(key);
                                    values.push(entry[key]);
                                }
                                keys = keys.join(',');
                                tx.executeSql(
                                    'INSERT INTO ' + table_name + ' (' + keys + ') VALUES (' + '?, '.repeat(values.length).slice(0, -2) + ');',
                                    values,
                                    (tx, results) => {
                                        // do nothing
                                    },
                                    (tx, error) => {
                                        console.log('error seeding ' + table_name + ' ' + error);
                                    }
                                );
                            }

                        } else {
                            console.log(table_name + ' is not empty, so it was not seeded');
                        }
                    });
            }
        },
        (error) => {
            console.log(error);
        },
        () => {
            console.log('Project tables seeded successfully');
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
                (_, {rows: {_array}}) => console.log('projects: ', _array.length)
            );
            tx.executeSql(
                'SELECT * FROM tasks;',
                [],
                (_, {rows: {_array}}) => console.log('tasks: ', _array.length)
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


// ? DATA RETRIEVAL FUNCTIONS
// ..........................

// function to get domains and their projects
export function getDomainsAndProjects(db, callback) {
    const raw_domains = [];
    db.transaction((tx) => {
            tx.executeSql("SELECT * FROM domains", [], (_, {rows}) => {
                // create an object for each domain, fill it with the domain's attributes and push it into the raw_domains array
                rows._array.forEach((domain) => {
                        const domain_object = {
                            id: domain.id,
                            name: domain.name,
                            priority: domain.priority,
                            color: domain.color,
                            projects: []
                        };
                        raw_domains.push(domain_object);
                    }
                );
                // for all the domains, get the projects and push them into the domain
                raw_domains.forEach((domain) => {
                        tx.executeSql(`SELECT * FROM projects WHERE domain_id=${domain.id}`, [], (_, {rows}) => {
                            rows._array.forEach((project) => {
                                const project_object = {
                                    id: project.id,
                                    name: project.name,
                                    priority: project.priority,
                                    description: project.description,
                                    color: project.color,
                                };
                                domain.projects.push(project_object);
                            });
                        }, (error) => {
                            console.log(error, 'error retrieving projects for domain', domain.name);
                        });
                    }
                );
            });
        }, (error) => {
            console.log(error);
        },
        () => {
            callback(raw_domains);
        });
}

// function to get a project's tasks given its id
export function getProjectTasks(db, project_id, callback) {
    const tasks = [];
    db.transaction((tx) => {
        // get the tasks and push them into the project
        tx.executeSql(`SELECT id,name,description FROM tasks WHERE project_id=?`, [project_id], (_, {rows}) => {
            rows._array.forEach((task) => {
                const task_object = {
                    id: task.id,
                    name: task.name,
                    description: task.description,
                };
                tasks.push(task_object);
            });
            callback({type: 'add_tasks', tasks: tasks});
        }, (error) => {
            console.log(error, 'error retrieving tasks for project id ', project_id);
        });
    });
}

// ..........................

// ? DATA ENTRY FUNCTIONS
// ..........................

// function to add a domain
export function addDomain(db, domain, callback) {
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO domains (name, description, color, icon, priority, created_at, updated_at) VALUES (?,?,?,?,?,?,?);',
            [domain.name, domain.description, domain.color, domain.icon, domain.priority, created_at, updated_at],
            (tx, results) => {
                callback();
            },
            (tx, error) => {
                console.log(error);
            }
        );
    });
}


// ? HELPER FUNCTIONS
// .................

// SEEDER FUNCTIONS
function domainSeeder(num) {
    let domains = [];
    for (let i = 0; i < num; i++) {
        domains.push({
            name: faker.random.word(),
            description: faker.lorem.paragraph(),
            color: faker.internet.color(),
            icon: faker.internet.avatar(),
            priority: Math.floor(Math.random() * 5) + 1,
            created_at: faker.date.past().toDateString(),
            updated_at: faker.date.recent().toDateString(),
        });
    }
    return domains;
}

function projectSeeder(num, no_of_domains) {
    let projects = [];
    for (let i = 0; i < num; i++) {
        projects.push({
            name: faker.random.word(),
            description: faker.lorem.paragraph(),
            color: faker.internet.color(),
            priority: Math.floor(Math.random() * 5) + 1,
            // ideally, domain_id has to be the id of an existing domain
            domain_id: Math.floor(Math.random() * no_of_domains) + 1,
            deadline: faker.date.future().toDateString(),
            created_at: faker.date.past().toDateString(),
            updated_at: faker.date.recent().toDateString(),
        });
    }
    return projects;
}

function taskSeeder(num, no_of_projects) {
    let tasks = [];
    let estimated_time = Math.round(Math.random() * 1000);
    let elapsed_time = Math.round(Math.random() * estimated_time);
    let maximum_time = Math.round(Math.random() * 4 * 60);
    let minimum_time = Math.round(Math.random() * maximum_time);
    for (let i = 0; i < num; i++) {
        tasks.push({
            name: faker.random.word(),
            description: faker.lorem.paragraph(),
            color: faker.internet.color(),
            estimated_time: estimated_time,
            elapsed_time: elapsed_time,
            minimum_time: minimum_time,
            maximum_time: maximum_time,
            // ideally, project_id has to be the id of an existing project
            project_id: Math.floor(Math.random() * no_of_projects) + 1,
            created_at: faker.date.past().toDateString(),
            updated_at: faker.date.recent().toDateString(),
        });
    }
    return tasks;
}

// AUXILIARY FUNCTIONS
// function to check if a table is empty
// fixme : this function is an asynchronous function, but it is being called as a synchronous function, which is not good
async function isTableEmpty(db, table_name) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM ' + table_name + ';',
                [],
                (tx, results) => {
                    let is_empty = results.rows.length === 0;
                    resolve(is_empty);
                },
                (tx, error) => {
                    console.log('error checking if ' + table_name + ' is empty ' + error);
                }
            );
        });
    });
}