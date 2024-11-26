import React, { FC } from "react";
import { View, StyleSheet, Platform, StatusBar, Text } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import AvatarView from "../ui/AvatarView";
import PeerProfile from "../ui/PeerProfile";

interface Props {}

type peerProfileType = {
  id: string;
  name: string;
  avatar: { id: string; url: string };
};

const ChatWindow: FC<Props> = (props) => {
  const { conversationId, peerProfile } = useLocalSearchParams();

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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {},
});

export default ChatWindow;
