import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  Pressable,
  Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import ProductDetail from "../components/ProductDetail";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useAuth from "../hooks/useAuth";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import colors from "../utils/colors";
import OptionButton from "../ui/OptionButton";
import OptionModal from "../components/OptionModal";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ProfileStackParamList } from "../types/StackProps";
import { NavigationProp } from "@react-navigation/native";
import { deleteItem, Product } from "../store/listings";
import { useDispatch } from "react-redux";

interface Props {}

const menuOptions = [
  {
    name: "Edit",
    icon: <Feather name="edit" size={20} color={colors.primary} />,
  },
  {
    name: "Delete",
    icon: <Feather name="trash-2" size={20} color={colors.primary} />,
  },
];

const SingleProduct: FC<Props> = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const { authState } = useAuth();
  const { authClient } = useClient();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get the product as a string from params
  const { product } = useLocalSearchParams();
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  // Parse the product string into an object of type Product
  const parsedProduct: Product | null =
    typeof product === "string" ? JSON.parse(product) : null;

  // Ensure parsedProduct is not null
  if (!parsedProduct) {
    return (
      <View>
        <Text>No product found</Text>
      </View>
    );
  }

  const isAdmin = authState.profile?.id === parsedProduct?.seller.id;

  const confirmDelete = async () => {
    const id = parsedProduct?.id;
    if (!id) return;
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.delete("/product/" + id)
    );
    setBusy(false);
    if (res?.message) {
      dispatch(deleteItem(id));
      showMessage({ message: res.message, type: "success" });
      navigate("views/Listings");
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      "Are you sure?",
      "This action will remove this product permanently",
      [
        { text: "Delete", style: "destructive", onPress: confirmDelete },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <>
      <AppHeader
        style={styles.header}
        backButton={<BackButton />}
        right={
          <OptionButton onPress={() => setShowMenu(true)} visible={isAdmin} />
        }
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        {parsedProduct ? <ProductDetail product={parsedProduct} /> : <></>}
        <Pressable
          onPress={() => navigate("views/ChatWindow")}
          style={styles.messageBtn}
        >
          <AntDesign name="message1" size={20} color="white" />
        </Pressable>
      </GestureHandlerRootView>
      <OptionModal
        options={menuOptions}
        renderItem={({ icon, name }) => (
          <View style={styles.option}>
            {icon}
            <Text style={styles.optionTitle}>{name}</Text>
          </View>
        )}
        visible={showMenu}
        onRequestClose={setShowMenu}
        onPress={(option) => {
          if (option.name === "Delete") {
            onDeletePress();
          }
          if (option.name === "Edit") {
            router.push({
              pathname: "views/EditProduct",
              params: { product: JSON.stringify(parsedProduct) },
            });
          }
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary,
  },
  messageBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: colors.active,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default SingleProduct;
