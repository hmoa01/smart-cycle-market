import { FontAwesome } from "@expo/vector-icons";
import React, { FC } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import profile from "../(tabs)/profile";
import colors from "../utils/colors";

interface Props {
  uri?: string;
  size?: number;
  onPress?(): void;
}

const iconContainerFactor = 0.7;
const iconSizeFactor = 0.8;

const AvatarView: FC<Props> = ({ uri, size = 50, onPress }) => {
  const iconContainerSize = size * iconContainerFactor;
  const iconSize = size * iconSizeFactor;

  return (
    <Pressable
      onPress={onPress}
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        styles.container,
        !uri && styles.profileIcon,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.flex1} />
      ) : (
        <View
          style={[
            {
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 2,
            },
            styles.iconContainer,
          ]}
        >
          <FontAwesome name="user" size={iconSize} color={colors.white} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  flex1: {
    flex: 1,
  },
  profileIcon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default AvatarView;
