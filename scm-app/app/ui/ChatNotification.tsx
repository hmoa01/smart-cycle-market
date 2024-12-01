import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import colors from "../utils/colors";
import size from "../utils/size";

interface Props {
  indicate?: boolean;
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
}

const ChatNotification: FC<Props> = ({ indicate, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="message"
        size={24}
        color={indicate ? colors.active : colors.primary}
      />
      {indicate && <View style={styles.indicator} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    paddingHorizontal: size.padding,
    position: "relative",
  },
  indicator: {
    width: 15,
    height: 15,
    backgroundColor: colors.active,
    borderRadius: 8,
    position: "absolute",
    top: 0,
    right: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default ChatNotification;
