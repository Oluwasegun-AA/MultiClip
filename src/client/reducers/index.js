import { combineReducers } from 'redux';
import uploadReducer from './uploadReducer';

const rootReducers = combineReducers({
  file: uploadReducer,
});

export default rootReducers;
