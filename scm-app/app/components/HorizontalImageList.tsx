import { FC } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

interface Props {
  images: { url: string; id?: string }[];
  onPress?(item: { url: string; id?: string }): void;
  onLongPress?(item: { url: string; id?: string }): void;
  style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({
  images,
  style,
  onPress,
  onLongPress,
}) => {
  return (
    <FlatList
      data={images}
      renderItem={({ item }) => {
        return (
          <Pressable
            onPress={() => onPress && onPress(item)}
            onLongPress={() => onLongPress && onLongPress(item)}
            style={styles.listItem}
          >
            <Image style={styles.image} source={{ uri: item.url }} />
          </Pressable>
        );
      }}
      contentContainerStyle={style}
      keyExtractor={(item) => (item.id ? item.id : item.url)}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
});

export default HorizontalImageList;
