import {createSlice} from '@reduxjs/toolkit';

const routingSlice = createSlice({
  name: 'routing',
  initialState: {
    currentRoute: '',
  },
  reducers: {
    setRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
  },
});

export const {setRoute} = routingSlice.actions;
export default routingSlice.reducer;
