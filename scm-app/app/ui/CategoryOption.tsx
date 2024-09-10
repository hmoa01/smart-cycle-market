import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../utils/colors";

interface Props {
  icon: JSX.Element;
  name: string;
}

const CategoryOption: FC<Props> = ({ icon, name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.category}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { transform: [{ scale: 0.5 }] },
  category: {
    color: colors.primary,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default CategoryOption;
