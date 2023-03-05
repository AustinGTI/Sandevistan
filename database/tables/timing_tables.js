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
            ' created_at TEXT NOT NULL,' +
            ' updated_at TEXT NOT NULL);' +
            ' FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE,'
        );
    }, (error) => console.log(error), () => console.log("Timing tables created successfully"));
}


// function to print a given number of time blocks from the time_block table
export function printTimingTables(db, num_time_blocks) {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM time_block LIMIT ?;',
            [num_time_blocks],
            (_, {rows: {_array}}) =>
            {
                console.log(_array);
            },
            (error) => console.log(error)
        );
    });
}


// function to drop either the given time block id or all time blocks
export function dropTimingTables(db, time_block_id = null) {
    db.transaction(tx => {
        if (time_block_id) {
            tx.executeSql(
                'DELETE FROM time_block WHERE id = ?;',
                [time_block_id],
                (_, {rows: {_array}}) => console.log(_array),
                (error) => console.log(error)
            );
        } else {
            tx.executeSql(
                'DELETE FROM time_block;',
                [],
                (_, {rows: {_array}}) => console.log(_array),
                (error) => console.log(error)
            );
        }
    }, (error) => console.log(error), () => console.log("Time blocks dropped successfully"));
}


// function to seed timing tables with fake data
export function seedTimingTables(db, only_if_empty = true) {
    // TODO: fix the standard deviations used, as of now they are not normal distributions
    // seed timing tables
    db.transaction(tx => {
        // if only_if_empty is true, first check if the time_block table is empty
        let seed_tables = true;
        if (only_if_empty) {
            tx.executeSql(
                'SELECT COUNT(*) FROM time_block;',
                [],
                (_, {rows: {_array}}) => {
                    // if the time_block table is empty, seed it
                    seed_tables = _array[0]["COUNT(*)"] === 0;
                },
                (error) => console.log(error)
            );
        }
        // if seed_tables is false, return
        if (!seed_tables) {
            return;
        }
        // generate data for 100 days, 5 of which are in the future
        const no_of_days = 10;
        let start_date = new Date();
        start_date.setDate(start_date.getDate() - no_of_days - 5);
        for (let i = 0; i < no_of_days; i++) {
            // generate 7 time blocks per weekday, 5 per saturday, 0 per sunday
            const day = start_date.getDay();
            // the end of the day is 5 pm on weekdays, 1 pm on saturdays, and 10 am on sundays
            let end_of_day = 17;
            if (day === 0) {
                end_of_day = 10;
            } else if (day === 6) {
                end_of_day = 13;
            }
            // start time is 6 am
            start_date.setHours(6);
            while (start_date.getHours() < end_of_day) {
                // generate random time block
                // move forward in time by between 0 and 30 minutes in 5 minute increments
                start_date.setMinutes(start_date.getMinutes() + faker.datatype.number({max: 6}) * 5);
                // the duration is an normal distribution with a mean of 120 minutes and a standard deviation of 30 minutes
                // to the closest 15 minutes capped between 15 and 120 minutes
                const duration = Math.min(Math.max(Math.round(faker.datatype.number({min: 90, max: 120})), 15), 120);

                // the end time is the start time plus the duration
                const planned_end_date = new Date(start_date);
                planned_end_date.setMinutes(planned_end_date.getMinutes() + duration);

                let missed, actual_start_date, actual_end_date, actual_duration;
                // if the event is in the past, generate actual times
                // ? ACTUAL TIMES
                // with a 70% chance, the time block is performed else it is missed
                if (planned_end_date < new Date() && Math.random() < 0.7) {
                    console.log("not missed");
                    missed = false;
                    // the actual start time is a offset positively from the planned start time by a standard deviation of 15 minutes
                    actual_start_date = new Date(start_date);
                    actual_start_date.setMinutes(actual_start_date.getMinutes() + Math.abs(faker.datatype.number({
                        min: 0,
                        max: 30
                    })));
                    // the duration is normally distributed around the planned duration with a standard deviation of 15 minutes
                    actual_duration = Math.round(faker.datatype.number({min: duration - 30, max: duration + 30}));
                    // the actual end time is the actual start time plus the actual duration
                    actual_end_date = new Date(actual_start_date);
                    actual_end_date.setMinutes(actual_end_date.getMinutes() + actual_duration);
                }
                // if the time block is missed, the actual times are null and missed is true
                else {
                    missed = true;
                    actual_start_date = null;
                    actual_end_date = null;
                    actual_duration = 0;
                }

                // the task id is a random number between 1 and 300
                const task_id = faker.datatype.number({min: 1, max: 300});
                // the percentage complete is the actual duration divided by the planned duration
                const percentage_complete = actual_duration ? actual_duration / duration : 0;
                // the created at and updated at are the same times are between 1 week before the start date and the start date
                const created_at = faker.date.between(new Date(start_date.setDate(start_date.getDate() - 7)), start_date);
                const updated_at = created_at;


                tx.executeSql(
                    'INSERT INTO time_block (planned_start_time, planned_end_time, planned_duration,' +
                    ' actual_start_time, actual_end_time, actual_duration,' +
                    ' percentage_complete, missed, task_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?);',
                    [start_date.toISOString(), planned_end_date.toISOString(), duration,
                        actual_start_date ? actual_start_date.toISOString() : null, actual_end_date ? actual_end_date.toISOString() : null, actual_duration,
                        percentage_complete, missed, task_id, created_at.toISOString(), updated_at.toISOString()]
                );
                // the new start time is the actual end time or planned end time if the time block was missed
                start_date = new Date(actual_end_date || planned_end_date);
            }
            console.log('Day: ', i, ' logged, date: ', start_date.getDate(), '/', start_date.getMonth(), '/', start_date.getFullYear());
            // move to the next day
            start_date.setDate(start_date.getDate() + 1);
        }
    }, (error) => console.log(error), () => console.log("Timing tables seeded successfully"));
}


// ? DATA RETRIEVAL FUNCTIONS
// function to get the time blocks for a given task id with optional start and end dates and run a callback function on the result
// end date is by default the current date
// start date is by default 7 days before the end date
function getTaskTimeBlocks(db,task_id, callback, start_date = null, end_date = null) {
    // if the end date is not given, set it to the current date
    if (!end_date) {
        end_date = new Date();
    }
    // if the start date is not given, set it to 7 days before the end date
    if (!start_date) {
        start_date = new Date(end_date);
        start_date.setDate(start_date.getDate() - 7);
    }

    // get the time blocks for the task id between the start and end dates
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM time_block WHERE task_id = ? AND planned_start_time BETWEEN ? AND ?;',
            [task_id, start_date.toISOString(), end_date.toISOString()],
            (tx, result) => {
                // run the callback function on the result
                callback(result);
            }
        );
    });
}

// ? HELPER FUNCTIONS
// ..................

// TODO: function to return a random number chosen from a normal distribution with mean and standard deviation given
// and optional increment to round to
function normalRandom(mean, standard_deviation, increment = 1) {
    // generate a random number between 0 and 1
    let random = Math.random();
    // if the random number is less than 0.5, subtract it from 1
    if (random < 0.5) {
        random = 1 - random;
    }
    // return the mean plus the standard deviation times the random number
    return mean + standard_deviation * random;
}