import React, { FC, useEffect } from "react";
import { View, StyleSheet, Text, Platform, StatusBar } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import EmptyView from "../ui/EmptyView";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";

interface Props {}

const Chats: FC<Props> = (props) => {
  const { authClient } = useClient();
  const chats = [];

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{
      chats: {
        id: string;
        lastMessage: string;
        timestamp: Date;
        unreadChatCounts: number;
        peerProfile: { id: string; name: string; avatar?: string };
      };
    }>(authClient("/conversation/last-chats"));

    if (res) {
      console.log(res.chats);
    }
  };

  useEffect(() => {
    fetchLastChats();
  }, []);

  if (!chats.length)
    return (
      <>
        <AppHeader style={{ marginTop: 20 }} backButton={<BackButton />} />
        <EmptyView title="There is no chats." />
      </>
    );

  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default Chats;
