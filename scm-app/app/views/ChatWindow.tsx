import React, { FC } from "react";
import { View, StyleSheet, Platform, StatusBar, Text } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import AvatarView from "../ui/AvatarView";
import PeerProfile from "../ui/PeerProfile";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import useAuth from "../hooks/useAuth";
import EmptyChatContainer from "../ui/EmptyChatContainer";
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  Conversation,
  selectConversationById,
  updateConversation,
} from "../store/conversation";

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
      avatar?: string;
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
        avatar: chat.user.avatar,
      },
    };
  });
  //optional for sort messages
  // const messages = formattedValues || [];
  // return messages.sort((a, b) => b.createdAt.getTime() - b.createdAt.getTime());

  return formattedValues || [];
};

const ChatWindow: FC<Props> = (props) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = useLocalSearchParams();
  const dispatch = useDispatch();

  const profile = authState.profile;
  if (!profile) return null;

  const parsedPeerProfile: peerProfileType | null =
    typeof peerProfile === "string" ? JSON.parse(peerProfile) : null;

  const parsedConversationId: string | null =
    typeof conversationId === "string" ? JSON.parse(conversationId) : null;

  if (!parsedConversationId) return null;

  const chats = useSelector(selectConversationById(parsedConversationId));

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
          avatar: profile.avatar?.url,
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
          avatar: parsedPeerProfile.avatar.url,
        },
      })
    );

    //sending message to our api
    socket.emit("chat:new", newMessage);
  };

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
        messages={formatConversationToIMessage(chats)}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar?.url,
        }}
        onSend={handleOnMessageSend}
        renderChatEmpty={() => <EmptyChatContainer />}
        inverted={false}
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
