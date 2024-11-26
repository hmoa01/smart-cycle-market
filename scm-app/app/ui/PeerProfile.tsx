import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import AvatarView from "./AvatarView";
import colors from "../utils/colors";

interface Props {
  name: string;
  avatar: { id: string; url: string };
}

const PeerProfile: FC<Props> = ({ avatar, name }) => {
  return (
    <View style={styles.container}>
      <AvatarView uri={avatar.url} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: {
    color: colors.primary,
    paddingLeft: 5,
    fontWeight: "600",
  },
});

export default PeerProfile;
