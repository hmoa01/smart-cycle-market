import React, { FC } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import AvatarView from "../ui/AvatarView";
import colors from "../utils/colors";
import size from "../utils/size";

interface Props {
  avatar?: string;
  name: string;
}

const { width } = Dimensions.get("window");

const profileImageSize = 50;
const itemWidth = width - size.padding * 2;

const RecentChat: FC<Props> = ({ avatar, name }) => {
  return (
    <View style={styles.container}>
      <AvatarView uri={avatar} size={profileImageSize} />
      <View style={styles.chatInfo}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: itemWidth,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
  },
  chatInfo: {
    paddingLeft: size.padding,
    width: itemWidth - profileImageSize,
  },
});

export default RecentChat;
