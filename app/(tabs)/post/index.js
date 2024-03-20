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
import { firebase } from "../../../firebase";
import axios from "axios";
import { useRouter } from "expo-router";

const index = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.130.184:8000/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };

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

  const createPost = async () => {
    try {
      const uploadedUrl = await uploadFile();

      const postData = {
        description: description,
        imageUrl: uploadedUrl,
        userId: userId,
      };

      const response = await axios.post(
        "http://192.168.130.184:8000/create",
        postData
      );
      console.log("post created ", response.data);
      if (response.status === 201) {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("error creating post", error);
    }
  };

  //image'i uri dan firebase storage e yukleyen fonksiyon
  const uploadFile = async () => {
    try {
      console.log("Image URI:", image);
      //fileSytem paketi sayesinde image in cihazdaki uri i alinir
      const { uri } = await FileSystem.getInfoAsync(image);

      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      //uridan dosya adi ayiklanir
      const filename = image.substring(image.lastIndexOf("/") + 1);
      //firebase storage de ref olusturma
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      //yuklenen dosyanın indirme url si alinir
      const downloadURL = await ref.getDownloadURL();
      console.log("FIREBASE URL : ", downloadURL);
      return downloadURL;
      // Alert.alert("Photo uploaded");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <ScrollView style={styles.section}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: user?.profileImage }} />
            <Text style={{ fontWeight: "500" }}>{user?.name}</Text>
          </View>
        </View>

        <View style={styles.postButtonContainer}>
          <Entypo name="back-in-time" size={24} color="black" />
          <TouchableOpacity onPress={createPost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="What do you want to talk about"
        placeholderTextColor={"black"}
        multiline={true}
        numberOfLines={3}
        textAlignVertical={"top"}
      />

      <View>
        {image && <Image source={{ uri: image }} style={styles.postImage} />}
      </View>

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
  postImage: {
    width: "100%",
    height: 240,
    marginVertical: 20,
  },
});
