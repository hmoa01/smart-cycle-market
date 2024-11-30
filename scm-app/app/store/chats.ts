import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface ActiveChat {
  id: string;
  lastMessage: string;
  timestamp: string;
  unreadChatCounts: number;
  peerProfile: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const initialState: ActiveChat[] = [];

const slice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addNewActiveChat: (state, { payload }: PayloadAction<ActiveChat[]>) => {
      return payload;
    },
  },
});

export const { addNewActiveChat } = slice.actions;

export const getActiveChats = createSelector(
  (state: RootState) => state,
  ({ chats }) => chats
);

export default slice.reducer;
