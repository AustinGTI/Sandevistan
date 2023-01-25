export const ADD_TODO = "ADD_TODO";

let todoId = 0;

export const addTodo = (todo) => {
    return {
        type: ADD_TODO,
        payload:{
            id:++todoId,
            todo
        }
    }
}

export const ADD_PERSON = "ADD_PERSON";

let personId = 0;

export const addPerson = (person) => {
    return {
        type: ADD_PERSON,
        payload:{
            id:++personId,
            person
        }
    }
}
