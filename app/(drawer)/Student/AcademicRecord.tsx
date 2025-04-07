import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Mentor() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
      title: "Academic",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#3b82f6",
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ marginRight: 15 }}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=15" }}
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddPress = () => {
    router.push("/apply-leave"); // Replace with actual route
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mentor Dashboard</Text>

      {/* + Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileImageContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
