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