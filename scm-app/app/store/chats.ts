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
    avatar?: { id: string; url: string };
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
    removeUnreadChatCount: (chats, { payload }: PayloadAction<string>) => {
      const index = chats.findIndex((chat) => chat.id === payload);

      if (index !== -1) {
        chats[index].unreadChatCounts = 0;
      }
    },
  },
});

export const { addNewActiveChat, removeUnreadChatCount } = slice.actions;

export const getActiveChats = createSelector(
  (state: RootState) => state,
  ({ chats }) => chats
);

export const getUnreadChatsCount = createSelector(
  (state: RootState) => state,
  ({ chats }) => {
    return chats.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.unreadChatCounts;
    }, 0);
  }
);

export default slice.reducer;
