import React, { FC, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import FormInput from "../ui/FormInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../utils/colors";
import DatePicker from "../ui/DatePicker";
import OptionModal from "../components/OptionModal";
import categories from "../utils/categories";
import CategoryOption from "../ui/CategoryOption";
import { AntDesign } from "@expo/vector-icons";
import AppButton from "../ui/AppButton";
import CustomKeyAvoidingView from "../ui/CustomKeyAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "../components/HorizontalImageList";

interface Props {}

const defaultInfo = {
  name: "",
  description: "",
  category: "",
  price: "",
  purchasingDate: new Date(),
};

const NewListings: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [images, setImages] = useState<string[]>([]);

  const { category, name, description, price, purchasingDate } = productInfo;

  const handleChange = (name: string) => (text: string) => {
    setProductInfo({ ...productInfo, [name]: text });
  };

  const handleSubmit = () => {
    console.log(productInfo);
  };

  const handleOnImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
        allowsMultipleSelection: true,
      });

      if (!assets) return;

      // console.log(JSON.stringify(assets, null, 2));
      const imageUris = assets.map(({ uri }) => uri);
      setImages([...images, ...imageUris]);
    } catch (error) {
      showMessage({ message: (error as any).message, type: "danger" });
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable
            style={styles.fileSelector}
            onPress={handleOnImageSelection}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>

          <HorizontalImageList
            images={images}
            onLongPress={(img) => console.log(img)}
          />
        </View>

        <FormInput
          value={name}
          onChangeText={handleChange("name")}
          placeholder="Product name"
        />
        <FormInput
          value={price}
          placeholder="Price"
          onChangeText={handleChange("price")}
          keyboardType="numeric"
        />
        <DatePicker
          title="Purchasing Date:"
          value={purchasingDate}
          onChange={(purchasingDate) =>
            setProductInfo({ ...productInfo, purchasingDate })
          }
        />
        <Pressable
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryTitle}>{category || "Category"}</Text>
          <AntDesign name="caretdown" color="black" />
        </Pressable>

        <FormInput
          value={description}
          onChangeText={handleChange("description")}
          placeholder="Description"
          multiline
          numberOfLines={4}
        />

        <AppButton title="List Product" onPress={handleSubmit} />

        <OptionModal
          visible={showCategoryModal}
          onRequestClose={setShowCategoryModal}
          options={categories}
          renderItem={(item) => <CategoryOption {...item} />}
          onPress={(item) =>
            setProductInfo({ ...productInfo, category: item.name })
          }
        />
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
  },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  btnTitle: {
    color: colors.primary,
    marginBottom: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },

  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
});

export default NewListings;
