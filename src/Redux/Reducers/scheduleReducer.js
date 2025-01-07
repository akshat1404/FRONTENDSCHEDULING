import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id:undefined
};

const followedScheduleSlice = createSlice({
  name: 'followedSchedule',
  initialState,
  reducers: {
    setNotfied : (state, action) => {
      state.submittedToday = action.payload.submittedToday;
    },
    setFollowedSchedule: (state, action) => {
      state.id = action.payload.id;
    },
    clearFollowedSchedule: (state) => {
      state.id = undefined;
    },
  },
});

export const { setFollowedSchedule, clearFollowedSchedule, setNotfied} = followedScheduleSlice.actions;
export default followedScheduleSlice.reducer;
