import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scheduleId: '',
  scheduleName: '',
  scheduleType: '',
};

const followedScheduleSlice = createSlice({
  name: 'followedSchedule',
  initialState,
  reducers: {
    setFollowedSchedule: (state, action) => {
      state.scheduleId = action.payload.scheduleId;
      state.scheduleName = action.payload.scheduleName;
      state.scheduleType = action.payload.scheduleType;
    },
    clearFollowedSchedule: (state) => {
      state.scheduleId = '';
      state.scheduleName = '';
      state.scheduleType = '';
    },
  },
});

export const { setFollowedSchedule, clearFollowedSchedule } = followedScheduleSlice.actions;
export default followedScheduleSlice.reducer;
