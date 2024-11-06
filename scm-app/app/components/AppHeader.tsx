import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import size from "../utils/size";
import { useNavigation } from "expo-router";

interface Props {
  backButton?: JSX.Element | null;
  center?: JSX.Element | null;
  right?: JSX.Element | null;
  style?: StyleProp<ViewStyle>;
}

const AppHeader: FC<Props> = ({ right, center, style, backButton }) => {
  const { goBack, canGoBack } = useNavigation();
  return (
    <View style={[styles.container, style]}>
      {canGoBack() && <Pressable onPress={goBack}>{backButton}</Pressable>}

      {center}

      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: size.padding,
  },
});

export default AppHeader;
