import { NavigationProp } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { useNavigation } from "expo-router";
import { FC, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import axios from "axios";
import { newUserSchema, yupValidate } from "../utils/validator";
import { runAxiosAsync } from "../api/runAxiosAsync";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleChange = (name: string) => (text: string) =>
    setUserInfo({ ...userInfo, [name]: text });

  const apiUrl =
    Platform.OS === "android"
      ? "http://10.0.2.2:8000" // Android Emulator
      : "http://localhost:8000"; // iOS Simulator or Web

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    const res = await runAxiosAsync<{ message: string }>(
      axios.post(`${apiUrl}/auth/sign-up`, values)
    );

    console.log(res);
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

          <AppButton onPress={handleSubmit} title="Sign Up" />
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
