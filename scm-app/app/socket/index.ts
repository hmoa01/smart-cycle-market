import { io } from "socket.io-client";
import client, { baseURL } from "../api/client";
import { Profile, updateAuthState } from "../store/auth";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { runAxiosAsync } from "../api/runAxiosAsync";
import asyncStorage, { Keys } from "../utils/asyncStorage";
import { TokenResponse } from "../hooks/useClient";
import { updateConversation } from "../store/conversation";

const socket = io(baseURL, { path: "/socket-message", autoConnect: false });

type MessageProfile = {
  id: string;
  name: string;
  avatar?: string;
};

type newMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    user: MessageProfile;
  };
  from: MessageProfile;
  conversationId: string;
};

export const handleSocketConnection = (
  profile: Profile,
  dispatch: Dispatch<UnknownAction>
) => {
  socket.auth = { token: profile?.accessToken };
  socket.connect();

  //   socket.on("connect", () => {
  //     console.log("connected:", socket.connected);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("disconnected:", socket.connected);
  //   });

  socket.on("chat:message", (data: newMessageResponse) => {
    const { conversationId, from, message } = data;

    //this will update on going conversation or messages in between two users
    dispatch(
      updateConversation({
        conversationId,
        chat: { ...message, viewed: false },
        peerProfile: from,
      })
    );
  });

  socket.on("connect_error", async (error) => {
    const refreshToken = asyncStorage.get(Keys.REFRESH_TOKEN);
    if (error.message === "jwt expired") {
      const res = await runAxiosAsync<TokenResponse>(
        client.post(`${baseURL}/auth/refresh-token`, { refreshToken })
      );
      if (res) {
        await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
        dispatch(
          updateAuthState({
            profile: { ...profile!, accessToken: res.tokens.access },
            pending: false,
          })
        );
        socket.auth = { token: res.tokens.access };
        socket.connect();
      }
    }

    console.log("Error in socket:", error.message);
  });
};

export default socket;
