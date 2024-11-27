import React, { FC } from "react";
import { View, StyleSheet, Platform, StatusBar, Text } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import AvatarView from "../ui/AvatarView";
import PeerProfile from "../ui/PeerProfile";
import { GiftedChat } from "react-native-gifted-chat";
import useAuth from "../hooks/useAuth";
import EmptyChatContainer from "../ui/EmptyChatContainer";

interface Props {}

type peerProfileType = {
  id: string;
  name: string;
  avatar: { id: string; url: string };
};

const ChatWindow: FC<Props> = (props) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = useLocalSearchParams();

  const profile = authState.profile;
  if (!profile) return null;

  const parsedPeerProfile: peerProfileType | null =
    typeof peerProfile === "string" ? JSON.parse(peerProfile) : null;

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
        messages={[]}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar?.url,
        }}
        onSend={(message) => console.log(message)}
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
