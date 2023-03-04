import {faker} from "@faker-js/faker";

// function to create timing tables
export function createTimingTables(db) {
    // create timing tables
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS time_block (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
            ' planned_start_time TEXT NOT NULL,' +
            ' planned_end_time TEXT NOT NULL,' +
            ' actual_start_time TEXT,' +
            ' actual_end_time TEXT,' +
            ' planned_duration INTEGER NOT NULL,' +
            ' actual_duration INTEGER,' +
            ' percentage_complete INTEGER NOT NULL,' +
            ' missed BOOLEAN NOT NULL,' +
            ' task_id INTEGER NOT NULL,' +
            ' FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE,' +
            ' created_at TEXT NOT NULL,' +
            ' updated_at TEXT NOT NULL);'
        );
    }, (error) => console.log(error), () => console.log("Timing tables created successfully"));
}


// function to seed timing tables with fake data
export function seedTimingTables(db) {
    // seed timing tables
    db.transaction(tx => {
        // generate data for 200 days
        const start_date = new Date();
        start_date.setDate(start_date.getDate() - 200);
        for (let i = 0; i < 200; i++) {
            // generate 7 time blocks per weekday, 5 per saturday, 0 per sunday
            const day = start_date.getDay();
            const num_time_blocks = day === 0 ? 0 : day === 6 ? 5 : 7;
            // start time is 6 am
            start_date.setHours(6);
            while (start_date.getHours() < 17) {
                // generate random time block
                // move forward in time by between 0 and 30 minutes in 5 minute increments
                start_date.setMinutes(start_date.getMinutes() + faker.random.number(6) * 5);
                // the duration is an normal distribution with a mean of 120 minutes and a standard deviation of 30 minutes
                // to the closest 15 minutes capped between 15 and 120 minutes
                const duration = Math.min(Math.max(Math.round(faker.random.number({mean: 120, standard_deviation: 30})), 15), 120);

                // the end time is the start time plus the duration
                const planned_end_date = new Date(start_date);
                planned_end_date.setMinutes(planned_end_date.getMinutes() + duration);

                // if the event is in the past, generate actual times
                if (planned_end_date < new Date()) {
                    // ? ACTUAL TIMES
                    // with a 70% chance, the time block is performed else it is missed
                    if (faker.random.boolean(0.7)) {
                        // the actual start time is a offset positively from the planned start time by a standard deviation of 15 minutes
                        const actual_start_date = new Date(start_date);
                        actual_start_date.setMinutes(actual_start_date.getMinutes() + Math.abs(faker.random.number({mean: 0, standard_deviation: 15})));
                        // the duration is normally distributed around the planned duration with a standard deviation of 15 minutes
                    }
                }


                tx.executeSql(
                    'INSERT INTO time_block (planned_start_time, planned_end_time, planned_duration, percentage_complete, missed, task_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?);',
                    [faker.date.past().toString(), faker.date.future().toString(), faker.random.number(1000), faker.random.number(100), faker.random.boolean(), faker.random.number(100), faker.date.past().toString(), faker.date.past().toString()]
                );
            }
        }
    }, (error) => console.log(error), () => console.log("Timing tables seeded successfully"));
}