import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const index = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.section}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: "https://www.shutterstock.com/image-illustration/3d-render-attractive-cartoon-character-260nw-1933348058.jpg",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View style={styles.postButtonContainer}>
          <Entypo name="back-in-time" size={24} color="black" />
          <Pressable style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="What do you want to talk about"
        placeholderTextColor={"black"}
        multiline={true}
        numberOfLines={10}
        textAlignVertical={"top"}
      />

      <TouchableOpacity style={styles.mediaButtonContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
          <MaterialIcons name="perm-media" size={24} color="black" />
        </TouchableOpacity>

        <Text>Media</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 8,
  },
  postButton: {
    padding: 10,
    backgroundColor: "#0072b1",
    width: 80,
    borderRadius: 20,
  },
  postButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  input: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
  },
  mediaButtonContainer: {
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
  },
  mediaButton: {
    width: 40,
    height: 40,
    marginTop: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
