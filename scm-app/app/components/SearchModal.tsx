import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Text,
} from "react-native";
import SearchBar from "./SearchBar";
import colors from "../utils/colors";
import size from "../utils/size";

interface Props {
  visible: boolean;
  onClose(visible: boolean): void;
}

const searchResults = [
  { id: 1, name: "iPhone 13 Pro Max" },
  { id: 2, name: "Samsung Galaxy S21 Ultra" },
  { id: 3, name: "MacBook Pro 16-inch" },
  { id: 4, name: "Dell XPS 13" },
  { id: 5, name: "Sony Playstation 5" },
  { id: 6, name: "Nintendo Switch OLED" },
  { id: 7, name: "Canon EOS R5" },
  { id: 8, name: "Sony A7 III" },
  { id: 9, name: "Bose QuietComfort 45" },
  { id: 10, name: "AirPods Pro" },
  { id: 11, name: "Nike Air Max 270" },
  { id: 12, name: "Adidas Ultraboost 21" },
  { id: 13, name: "Lululemon Align Pants" },
  { id: 14, name: "Patagonia Nano Puff Jacket" },
  { id: 15, name: "Yeti Tundra 45 Cooler" },
  { id: 16, name: "Hydro Flask 32 oz Wide Mouth" },
  { id: 17, name: "Kindle Paperwhite" },
  { id: 18, name: "Fujifilm Instax Mini 11" },
  { id: 19, name: "Anker PowerCore 10000" },
  { id: 20, name: "Google Nest Thermostat" },
];

const SearchModal: FC<Props> = ({ visible, onClose }) => {
  const handleClose = () => {
    onClose(!visible);
  };
  return (
    <Modal animationType="fade" onRequestClose={handleClose} visible={visible}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={colors.primary}
              />
            </Pressable>
            <View style={styles.searchBar}>
              <SearchBar />
            </View>
          </View>
          {/* SUGGESTIONS */}
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <Pressable>
                <Text style={styles.suggestionListItem}>{item.name}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.suggestionList}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  innerContainer: {
    padding: size.padding,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    marginLeft: size.padding,
  },
  suggestionList: {
    paddingHorizontal: size.padding,
  },
  suggestionListItem: {
    color: colors.primary,
    fontWeight: "600",
    paddingVertical: 7,
    fontSize: 18,
  },
});

export default SearchModal;
