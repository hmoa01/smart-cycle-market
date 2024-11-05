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
import { newProductSchema, yupValidate } from "../utils/validator";
import mime from "mime";

import { runAxiosAsync } from "../api/runAxiosAsync";
import useClient from "../hooks/useClient";

interface Props {}

const defaultInfo = {
  name: "",
  description: "",
  category: "",
  price: "",
  purchasingDate: new Date(),
};

const imageOptions = [{ value: "Remove Image", id: "remove" }];

const NewListings: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [images, setImages] = useState<string[]>([]);
  const { authClient } = useClient();
  const { category, name, description, price, purchasingDate } = productInfo;

  const handleChange = (name: string) => (text: string) => {
    setProductInfo({ ...productInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { error } = await yupValidate(newProductSchema, productInfo);

    if (error) showMessage({ message: error, type: "danger" });

    const formData = new FormData();

    type productInfoKeys = keyof typeof productInfo;

    for (let key in productInfo) {
      const value = productInfo[key as productInfoKeys];

      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    const newImages = images.map((img, index) => ({
      name: "image_" + index,
      mimetype: mime.getType(img),
      uri: img,
    }));

    for (let img of newImages) {
      formData.append("images", img as any);
    }

    const res = await runAxiosAsync(
      authClient.post("/product/list", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );

    console.log(res);
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
            onLongPress={(img) => {
              setSelectedImage(img);
              setShowImageOptions(true);
            }}
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

        {/* Image Options */}
        <OptionModal
          visible={showImageOptions}
          onRequestClose={setShowImageOptions}
          options={imageOptions}
          renderItem={(item) => (
            <Text style={styles.imageOption}>{item.value}</Text>
          )}
          onPress={(option) => {
            if (option.id === "remove") {
              const newImages = images.filter((img) => img !== selectedImage);
              setImages([...newImages]);
            }
          }}
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
  imageOption: {
    fontWeight: "700",
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
});

export default NewListings;
