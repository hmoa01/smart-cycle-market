import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import store, { RootState } from ".";

export type Profile = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: { id: string; url: string };
  accessToken: string;
};

interface AuthState {
  pending: boolean;
  profile: null | Profile;
}

const initialState: AuthState = {
  pending: false,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthState(state, { payload }: PayloadAction<AuthState>) {
      state.pending = payload.pending;
      state.profile = payload.profile;
    },
  },
});

export const { updateAuthState } = authSlice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  (state) => state.auth
);

export default authSlice.reducer;
