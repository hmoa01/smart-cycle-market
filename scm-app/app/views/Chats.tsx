import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import useClient from "../hooks/useClient";
import EmptyView from "../ui/EmptyView";
import { useSelector } from "react-redux";
import { getActiveChats } from "../store/chats";
import RecentChat from "../components/RecentChat";
import size from "../utils/size";

interface Props {}

const Chats: FC<Props> = (props) => {
  const { authClient } = useClient();
  const chats = useSelector(getActiveChats);

  // const dispatch = useDispatch();

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
            <RecentChat
              name={item.peerProfile.name}
              avatar={item.peerProfile.avatar}
            />
          )}
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
