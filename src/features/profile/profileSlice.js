import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

export const getUserProfile = createAsyncThunk(
  "profile/getById",
  async (uid, {rejectWithValue}) => {
    return firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        return {
          uid: doc.id,
          ...doc.data(),
          createdOn: doc.data()?.createdOn.seconds,
        };
      })
      .catch((err) => {
        return rejectWithValue(err);
      });
  },
);

const initialState = {
  isFetching: false,
  errors: null,
  user: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {reset: (state) => initialState},
  extraReducers: {
    [getUserProfile.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
      state.user = null;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
    },
    [getUserProfile.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
  },
});

export const {reset} = profileSlice.actions;
export default profileSlice.reducer;
