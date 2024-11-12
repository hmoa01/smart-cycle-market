import { NavigationProp } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { useNavigation } from "expo-router";
import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { newUserSchema, yupValidate } from "../utils/validator";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "../api/client";
import { SignInResponse } from "./SignIn";
import useAuth from "../hooks/useAuth";
import { AuthStackParamList } from "../types/StackProps";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const handleChange = (name: string) => (text: string) =>
    setUserInfo({ ...userInfo, [name]: text });

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }
    setBusy(true);
    const res = await runAxiosAsync<{ message: string | undefined }>(
      client.post("/auth/sign-up", values)
    );
    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      const signInResponse = await runAxiosAsync<SignInResponse>(
        client.post("/auth/sign-in", values)
      );
      signIn(values!);
    }
    setBusy(false);
  };
  const { name, email, password } = userInfo;

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
          <FormInput
            value={email}
            onChangeText={handleChange("email")}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />

          <AppButton active={!busy} onPress={handleSubmit} title="Sign Up" />
          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("(auth)/ForgetPassword")}
            onRightPress={() => navigate("(auth)/SignIn")}
            leftTitle="Forget Password"
            rightTitle="Sign In"
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 30,
  },
});

export default SignUp;
