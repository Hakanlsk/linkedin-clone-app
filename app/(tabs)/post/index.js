import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";

const index = () => {
  const [description, setDescription] = useState("");
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
      />
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
});
