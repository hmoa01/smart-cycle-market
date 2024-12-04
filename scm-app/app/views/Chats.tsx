import React, { FC } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import EmptyView from "../ui/EmptyView";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveChat,
  getActiveChats,
  removeUnreadChatCount,
} from "../store/chats";
import RecentChat, { Separator } from "../components/RecentChat";
import size from "../utils/size";
import { useRouter } from "expo-router";

interface Props {}

const Chats: FC<Props> = (props) => {
  const router = useRouter();
  const chats = useSelector(getActiveChats);
  const dispatch = useDispatch();

  const onChatPress = async (chat: ActiveChat) => {
    dispatch(removeUnreadChatCount(chat.id));

    router.push({
      pathname: "views/ChatWindow",
      params: {
        conversationId: JSON.stringify(chat.id),
        peerProfile: JSON.stringify(chat.peerProfile),
      },
    });
  };

  if (!chats.length)
    return (
      <>
        <AppHeader style={{ marginTop: 30 }} backButton={<BackButton />} />
        <EmptyView title="There is no chats." />
      </>
    );

  return (
    <>
      <AppHeader style={{ marginTop: 20 }} backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <Pressable onPress={() => onChatPress(item)}>
              <RecentChat
                name={item.peerProfile.name}
                avatar={item.peerProfile.avatar?.url}
                timestamp={item.timestamp}
                lastMessage={item.lastMessage}
                unreadMessageCount={item.unreadChatCounts}
              />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: size.padding,
  },
});

export default Chats;
