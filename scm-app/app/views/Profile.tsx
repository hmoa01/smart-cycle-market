import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import AvatarView from "../ui/AvatarView";
import useAuth from "../hooks/useAuth";
import colors from "../utils/colors";
import size from "../utils/size";
import FormDivider from "../ui/FormDivider";
import ProfileOptionListItem from "../components/ProfileOptionListItem";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../types/StackProps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { ProfileRes } from "..";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../store/auth";
import { showMessage } from "react-native-flash-message";
import { selectImages } from "../utils/helper";
import mime from "mime";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Props {}

const Profile: FC<Props> = (props) => {
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const [username, setUserName] = useState(profile?.name || "");
  const [busy, setBusy] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
  const { authClient } = useClient();
  const dispatch = useDispatch();

  const isNameChanged =
    profile?.name !== username && username.trim().length >= 3;

  const getVerificationLink = async () => {
    setBusy(true);
    const res = await runAxiosAsync(
      authClient.get<{ message: string }>("/auth/verify-token")
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  const handleProfileImageSelection = async () => {
    const [image] = await selectImages({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (image) {
      const formData = new FormData();
      formData.append("avatar", {
        name: "Avatar",
        uri: image.url,
        type: mime.getType(image.url),
      } as any);
      setUpdatingAvatar(true);
      const res = await runAxiosAsync<ProfileRes>(
        authClient.patch("/auth/update-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
      setUpdatingAvatar(false);
      if (res) {
        dispatch(
          updateAuthState({
            profile: { ...profile!, ...res.profile },
            pending: false,
          })
        );
      }
    }
  };

  const updateProfile = async () => {
    const res = await runAxiosAsync(
      authClient.patch<{ profile: ProfileRes }>("/auth/update-profile", {
        name: username,
      })
    );

    if (res) {
      showMessage({ message: "Name updated successfully.", type: "success" });
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...profile!, ...res.profile },
        })
      );
    }
  };

  const fetchProfile = async () => {
    setRefreshing(true);
    const res = await runAxiosAsync(
      authClient.get<{ profile: ProfileRes }>("/auth/profile")
    );
    setRefreshing(false);
    if (res) {
      dispatch(
        updateAuthState({
          profile: { ...res.profile, ...profile! },
          pending: false,
        })
      );
    }
  };
  console.log(profile);
  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />
        }
      >
        {profile?.verified !== true ? (
          <View style={styles.verificationLinkContainer}>
            <Text style={styles.verificationTitle}>
              It look like your profile is not verified.
            </Text>
            {busy ? (
              <Text style={styles.verificationLink}>Please Wait...</Text>
            ) : (
              <Text
                onPress={getVerificationLink}
                style={styles.verificationLink}
              >
                Tap here to get the link.
              </Text>
            )}
          </View>
        ) : null}
        <View style={styles.profileContainer}>
          <AvatarView
            uri={profile?.avatar?.url}
            size={80}
            onPress={handleProfileImageSelection}
          />

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <TextInput
                value={username}
                onChangeText={(text) => setUserName(text)}
                style={styles.name}
              />
              {isNameChanged && (
                <Pressable onPress={updateProfile}>
                  <AntDesign name="check" size={23} color={colors.primary} />
                </Pressable>
              )}
            </View>

            <Text style={styles.email}>{profile?.email}</Text>
          </View>
        </View>

        <FormDivider />

        <ProfileOptionListItem
          style={styles.marginBottom}
          antIconName="message1"
          title="Messages"
          onPress={() => navigate("views/Chats")}
        />
        <ProfileOptionListItem
          style={styles.marginBottom}
          antIconName="appstore-o"
          title="Your Listings"
          onPress={() => navigate("views/Listings")}
        />
        <ProfileOptionListItem
          antIconName="logout"
          onPress={signOut}
          title="Log out"
        />
        <LoadingSpinner visible={updatingAvatar} />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
    paddingTop: 2,
  },
  marginBottom: {
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  verificationLinkContainer: {
    paddingVertical: 10,
    backgroundColor: colors.deActive,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  verificationTitle: {
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  verificationLink: {
    fontWeight: "600",
    color: colors.active,
    textAlign: "center",
    paddingTop: 5,
  },
});

export default Profile;
