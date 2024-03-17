import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import localhost from "../../localhost";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //kullanıcı daha once giris yaptiysa asyncstorage sayesinde direkt home yonlendirmesi yapilir
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLoginStatus();
  }, []);
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios.post(`http://192.168.130.184:8000/login`, user).then((response) => {
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
      router.replace("/(tabs)/home");
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
          <Text style={styles.title}>Log in to your Account</Text>
        </View>

        <View style={styles.formContainer}>
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

          <View>
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
          </View>

          <View style={styles.forgotView}>
            <Text>Keep me logged in</Text>
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 80 }} />

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

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
    marginTop: 70,
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
