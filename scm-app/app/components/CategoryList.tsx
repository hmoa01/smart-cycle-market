import React, { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import categories from "../utils/categories";
import colors from "../utils/colors";

interface Props {
  onPress(category: string): void;
}

const LIST_ITEM_SIZE = 80;

const CategoryList: FC<Props> = ({ onPress }) => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => onPress(item.name)}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text numberOfLines={2} style={styles.categoryName}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  listItem: {
    width: LIST_ITEM_SIZE,
    marginRight: 20,
  },
  iconContainer: {
    width: LIST_ITEM_SIZE,
    height: LIST_ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    paddingTop: 2,
    color: colors.primary,
  },
});

export default CategoryList;
