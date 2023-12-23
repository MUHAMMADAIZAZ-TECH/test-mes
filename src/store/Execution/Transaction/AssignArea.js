// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  success: false,
  message: '',
};
const AssignAreaSlice = createSlice({
  name: 'AssignArea',
  initialState,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1,
  },
});

export const { increment, decrement } = AssignAreaSlice.actions;
export default AssignAreaSlice.reducer;
