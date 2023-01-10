import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../@types";

const initialState: User = {
  name: null,
  bio: null,
  email: null,
  phoneNumber: null,
  photo: null,
  password: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      console.log("action payload: ", action.payload);
      Object.assign(state, action.payload);
    },
    removeUser: (state) => {
      Object.assign(state, {
        name: null,
        bio: null,
        email: null,
        phoneNumber: null,
        photo: null,
        password: null,
      });
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
