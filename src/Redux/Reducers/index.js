import {combineReducers} from 'redux';
import userReducer from './userReducer';
import scheduleReducer from './scheduleReducer';

const rootReducer = combineReducers({
    user: userReducer,
    schedule: scheduleReducer
})

export default rootReducer;