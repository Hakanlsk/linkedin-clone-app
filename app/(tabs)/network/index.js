import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import UserProfile from "../../../components/UserProfile";
import localhost from "../../../localhost";
import ConnectionRequest from "../../../components/ConnectionRequest";
import { useRouter } from "expo-router";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
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

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);
  const fetchUsers = async () => {
    axios
      .get(`http://192.168.130.184:8000/users/${userId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.130.184:8000/connection-request/${userId}`
      );
      if (response.status === 200) {
        const connectionRequestsData = response.data?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.profileImage,
        }));

        setConnectionRequests(connectionRequestsData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(connectionRequests);
  return (
    <ScrollView style={styles.scrollContainer}>
      <Pressable
        onPress={() => router.push("/network/connections")}
        style={styles.topContainer}
      >
        <Text style={styles.text}>Manage my Network</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </Pressable>

      <View style={styles.lineView} />

      <View style={styles.topContainer}>
        <Text style={styles.text}>Invitations (0)</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </View>

      <View style={styles.lineView} />

      <View>
        {connectionRequests.map((item, index) => (
          <ConnectionRequest
            item={item}
            key={index}
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            userId={userId}
          />
        ))}
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <View style={styles.growNetwork}>
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>
        <Text>
          Find and contact the right people. Plus see who's viewed your profile
        </Text>
        <View style={styles.premiumView}>
          <Text style={styles.premiumText}>Try Premium</Text>
        </View>
      </View>

      <FlatList
        data={users}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, key }) => (
          <UserProfile userId={userId} item={item} key={index} />
        )}
      />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  lineView: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginVertical: 10,
  },
  growNetwork: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumView: {
    backgroundColor: "#FFC72C",
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 8,
  },
  premiumText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});
