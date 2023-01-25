import { ADD_TODO} from "./action";

const initialState = {
    todos:[]
}

export const todoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos:[...state.todos, action.payload]
            }
        default:
            return state;
    }
}