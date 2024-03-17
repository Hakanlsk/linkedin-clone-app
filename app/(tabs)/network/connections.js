import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Ionicons, Octicons, Entypo, Feather } from "@expo/vector-icons";
import moment from "moment";

const connections = () => {
  const [connections, setConnections] = useState([]);
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

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `http://192.168.130.184:8000/connections/${userId}`
      );
      setConnections(response.data.connections);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(connections);
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={{ fontWeight: "500" }}>
          {connections.length} Connections
        </Text>
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={22} color="black" />
          <Octicons name="three-bars" size={22} color="black" />
        </View>
      </View>

      <View style={styles.line} />
      <View>
        {connections?.map((item, index) => (
          <View style={styles.connectionBox} key={index}>
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                source={{ uri: item?.profileImage }}
              />
            </View>

            <View style={styles.textContainer}>
              <Text>{item?.name}</Text>
              <Text style={{ color: "gray" }}>B.Tech | Computer Science</Text>
              <Text style={{ color: "gray" }}>
                connected on {moment(item?.createdAt).format("MMMM do YYYY")}{" "}
              </Text>
            </View>

            <View style={styles.sendAndThreeDot}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
              <Feather name="send" size={20} color="black" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default connections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    height: 2,
    borderColor: "#E0E0E0",
    borderWidth: 2,
    marginTop: 12,
  },
  connectionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    margin: 10,
  },
  imageView: {
    flex: 1,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 24,
  },
  textContainer: {
    flexDirection: "column",
    gap: 2,
    flex: 4,
  },
  sendAndThreeDot: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
});
