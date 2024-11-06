import React, { FC } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import AvatarView from "../ui/AvatarView";
import useAuth from "../hooks/useAuth";
import colors from "../utils/colors";
import size from "../utils/size";
import FormDivider from "../ui/FormDivider";
import ProfileOptionListItem from "../components/ProfileOptionListItem";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../types/StackProps";

interface Props {}

const Profile: FC<Props> = (props) => {
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AvatarView uri={profile?.avatar} size={80} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name}</Text>
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
    </ScrollView>
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
});

export default Profile;
