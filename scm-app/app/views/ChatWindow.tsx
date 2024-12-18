import React, { FC, useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import PeerProfile from "../ui/PeerProfile";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import useAuth from "../hooks/useAuth";
import EmptyChatContainer from "../ui/EmptyChatContainer";
import socket, { newMessageResponse } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  Conversation,
  selectConversationById,
  updateConversation,
} from "../store/conversation";
import { runAxiosAsync } from "../api/runAxiosAsync";
import useClient from "../hooks/useClient";
import EmptyView from "../ui/EmptyView";
import { useFocusEffect } from "@react-navigation/native";

interface Props {}

type peerProfileType = {
  id: string;
  name: string;
  avatar: { id: string; url: string };
};

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: { id: string; url: string };
    };
  };
  to: string;
  conversationId: string;
};

const getTime = (value: IMessage["createdAt"]) => {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const formatConversationToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      received: chat.viewed,
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar?.url,
      },
    };
  });
  //optional for sort messages
  // const messages = formattedValues || [];
  // return messages.sort((a, b) => b.createdAt.getTime() - b.createdAt.getTime());

  return formattedValues || [];
};

let timeoutId: NodeJS.Timeout | null;
const TYPING_TIMEOUT = 2000;

const ChatWindow: FC<Props> = (props) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { authClient } = useClient();
  const [fetchingChats, setFetchingChats] = useState(false);
  const [typing, setTyping] = useState(false);

  const profile = authState.profile;
  if (!profile) return null;

  const parsedPeerProfile: peerProfileType | null =
    typeof peerProfile === "string" ? JSON.parse(peerProfile) : null;
  const parsedConversationId: string | null =
    typeof conversationId === "string" ? JSON.parse(conversationId) : null;

  if (!parsedConversationId) return null;

  const conversation = useSelector(
    selectConversationById(parsedConversationId)
  );

  const handleOnMessageSend = (messages: IMessage[]) => {
    if (!profile) return;
    if (!parsedConversationId) return null;
    if (!parsedPeerProfile) return null;
    const currentMessage = messages[messages.length - 1];

    const newMessage: OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        },
      },
      conversationId: parsedConversationId,
      to: parsedPeerProfile.id,
    };

    //update store and ui

    dispatch(
      updateConversation({
        conversationId: parsedConversationId,
        chat: { ...newMessage.message, viewed: false },
        peerProfile: {
          ...parsedPeerProfile,
          avatar: parsedPeerProfile.avatar,
        },
      })
    );

    //sending message to our api
    socket.emit("chat:new", newMessage);
  };

  const emitTypingEnd = (timeout: number) => {
    return setTimeout(() => {
      socket.emit("chat:typing", {
        active: false,
        to: parsedPeerProfile?.id,
      });
      timeoutId = null;
    }, timeout);
  };

  const handleOnInputChange = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = emitTypingEnd(TYPING_TIMEOUT);
    } else {
      socket.emit("chat:typing", { active: true, to: parsedPeerProfile?.id });
      timeoutId = emitTypingEnd(TYPING_TIMEOUT);
    }
  };

  const fetchOldChats = async () => {
    setFetchingChats(true);
    const res = await runAxiosAsync<{ conversation: Conversation }>(
      authClient("/conversation/chats/" + parsedConversationId)
    );
    setFetchingChats(false);
    if (res?.conversation) {
      dispatch(addConversation([res.conversation]));
    }
  };

  const sendSeenRequest = () => {
    runAxiosAsync(
      authClient.patch(
        `/conversation/seen/${parsedConversationId}/${parsedPeerProfile?.id}`
      )
    );
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      await fetchOldChats();
      await sendSeenRequest();
    };

    handleApiRequest();
  }, []);

  const updateTypingStatus = (data: { typing: boolean }) => {
    setTyping(data.typing);
  };

  useFocusEffect(
    useCallback(() => {
      const updateSeenStatus = (data: newMessageResponse) => {
        socket.emit("chat:seen", {
          messageId: data.message.id,
          conversationId: parsedConversationId,
          peerId: parsedPeerProfile?.id,
        });
      };

      socket.on("chat:message", updateSeenStatus);
      socket.on("chat:typing", updateTypingStatus);

      return () => {
        socket.off("chat:message", updateSeenStatus);
        socket.off("chat:typing", updateTypingStatus);
      };
    }, [])
  );

  if (fetchingChats) return <EmptyView title="Please wait..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        style={styles.header}
        backButton={<BackButton />}
        center={
          <PeerProfile
            name={parsedPeerProfile?.name!}
            avatar={parsedPeerProfile?.avatar!}
          />
        }
      />
      <GiftedChat
        messages={formatConversationToIMessage(conversation)}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar?.url,
        }}
        onSend={handleOnMessageSend}
        renderChatEmpty={() => <EmptyChatContainer />}
        inverted={false}
        onInputTextChanged={handleOnInputChange}
        isTyping={typing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
});

export default ChatWindow;
