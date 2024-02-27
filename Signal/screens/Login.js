import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Input, Image } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);
  const SignIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error),
    );
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://baianasystem.com.br/wp-content/uploads/2020/10/700941550772606-2-300x300.jpg",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => SetEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          type="password"
          onChangeText={(text) => SetPassword(text)}
          style={styles.input}
        />
      </View>
      <Button
        title={"Login"}
        onPress={SignIn}
        containerStyle={styles.button}
        color={"#2E8B57"}
        disabled={email === "" || password === ""}
      />
      <Button
        title={"Register"}
        containerStyle={styles.button}
        color={"#2E8B57"}
        type={"clear"}
        onPress={() => navigation.navigate("Register")}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  form: {},
  button: {
    marginTop: 8,
    marginBottom: 8,
    width: 200,
  },
  input: {
    marginBottom: 8,
    marginTop: 8,
    borderBottomWidth: 1,
    borderColor: "grey",
    height: 35,
    width: 340,
  },
});
