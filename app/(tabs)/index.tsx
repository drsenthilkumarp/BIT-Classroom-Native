import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = () => {
    router.replace("/(drawer)/Classroom");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.appTitle}>BIT Classroom</Text>

        <Text style={styles.title}>Login</Text>

        {/* Add your logo image here */}
        <Image
          source={require("../../assets/images/logo.png")} // Adjust path if needed
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Google Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d5d4e6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3b82f6",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
