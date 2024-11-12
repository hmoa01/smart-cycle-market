import React, { FC, useRef, useState } from "react";
import { View, StyleSheet, Text, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ProductImage from "../ui/ProductImage";
import colors from "../utils/colors";

interface Props {
  images?: { url: string; id: string }[];
}

const ImageSlider: FC<Props> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewableConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      setActiveIndex(info.viewableItems[0].index || 0);
    }
  );

  if (!images?.length) null;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={images}
        renderItem={({ item }) => <ProductImage uri={item.url} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfig={viewableConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>
          {activeIndex + 1}/{images?.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  flatList: {
    position: "relative",
  },
  indicator: {
    position: "absolute",
    width: 35,
    height: 25,
    backgroundColor: colors.backDropDark,
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  indicatorText: {
    color: colors.white,
    fontWeight: "600",
  },
});

export default ImageSlider;
