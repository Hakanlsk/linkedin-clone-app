import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import localhost from "../../localhost";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    console.log("hello");
    const user = {
      name: name,
      email: email,
      password: password,
      profileImage: image,
    };

    axios
      .post(`http://192.168.130.184:8000/register`, user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Image
          style={styles.img}
          source={{
            uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <Text style={styles.title}>Register to your Account</Text>
        </View>

        <View style={styles.formContainer}>
          {/* name */}
          <View style={styles.inputContainer}>
            <Ionicons
              style={styles.inputIcon}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              placeholder="enter your Name"
            />
          </View>
          {/* email */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              style={styles.inputIcon}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="enter your Email"
            />
          </View>
          {/* password */}
          <View style={styles.inputContainer}>
            <AntDesign
              style={styles.inputIcon}
              name="lock1"
              size={24}
              color="gray"
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={styles.input}
              placeholder="enter your Password"
            />
          </View>

          {/* image url */}
          <View style={styles.inputContainer}>
            <Entypo
              style={styles.inputIcon}
              name="image"
              size={24}
              color="gray"
            />
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={styles.input}
              placeholder="enter your Image url"
            />
          </View>

          <View style={styles.forgotView}>
            <Text>Keep me logged in</Text>
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 50 }} />

          <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/login")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  img: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    color: "#041E42",
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
  },
  inputIcon: {
    marginLeft: 8,
  },
  input: {
    marginVertical: 7,
    width: 250,
    fontSize: 18,
  },
  forgotView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginButton: {
    width: 200,
    backgroundColor: "#0072B1",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
  loginText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
