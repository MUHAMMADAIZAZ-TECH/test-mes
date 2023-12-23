// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import AssignArea from './Execution/Transaction/AssignArea';
import Mpr from './Execution/ProductMpr/Mpr.Slice';

const rootReducer = combineReducers({
    AssignArea,
    Mpr
});

export default rootReducer;
