import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();

  const toggleSwitch = () => {
    setNotificationsEnabled((previousState) => !previousState);
  };

  const handleAboutPress = () => {
    Alert.alert("About", "This is the BIT Classroom App v1.0.");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
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
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=18" }} // Replace with actual image
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingRow}>
        <Ionicons name="notifications-outline" size={24} color="gray" />
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleSwitch}
          thumbColor={notificationsEnabled ? "#3b82f6" : "#f4f3f4"}
          trackColor={{ false: "#ccc", true: "#93c5fd" }}
        />
      </View>

      <TouchableOpacity style={styles.settingRow} onPress={handleAboutPress}>
        <Ionicons name="information-circle-outline" size={24} color="gray" />
        <Text style={styles.label}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3b82f6",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});
