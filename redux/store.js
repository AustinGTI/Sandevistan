import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers, createStore} from "redux";
import {todoReducer} from "./reducer";
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, todoReducer);
combineReducers({todos:todoReducer});
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
