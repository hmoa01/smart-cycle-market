import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import size from "../utils/size";
import colors from "../utils/colors";

interface Props {}

const EmptyChatContainer: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Breaking the ice can be the hardest part, but trust me, it's worth it!
          Start with a simple 'hello' and watch the conversation unfold.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: size.padding,
  },
  messageContainer: {
    backgroundColor: colors.deActive,
    padding: size.padding,
    borderRadius: 5,
  },
  message: {
    color: colors.active,
    fontSize: 12,
    textAlign: "center",
    writingDirection: "ltr",
    transform: [{ scaleY: -1 }],
  },
});

export default EmptyChatContainer;
