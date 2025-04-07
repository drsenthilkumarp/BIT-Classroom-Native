import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "expo-router";

type Material = {
  title: string;
  files: DocumentPicker.DocumentPickerAsset[];
};

export default function Classwork(): JSX.Element {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialTitle, setMaterialTitle] = useState<string>("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentFiles, setCurrentFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const handleOptionPress = (type: string) => {
    setModalVisible(false);
    if (type === "Material") {
      setMaterialModalVisible(true);
    }
  };

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setCurrentFiles((prev) => [...prev, ...result.assets]);
    }
  };

  const saveMaterial = () => {
    if (!materialTitle.trim()) {
      Alert.alert("Title is required");
      return;
    }

    if (currentFiles.length === 0) {
      Alert.alert("Attach at least one file");
      return;
    }

    setMaterials((prev) => [
      ...prev,
      { title: materialTitle.trim(), files: currentFiles },
    ]);
    setMaterialTitle("");
    setCurrentFiles([]);
    setMaterialModalVisible(false);
  };

  const deleteMaterial = (index: number) => {
    const updated = [...materials];
    updated.splice(index, 1);
    setMaterials(updated);
  };

  const downloadFile = async (uri: string, fileName: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access storage is required!");
      return;
    }

    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({ from: uri, to: fileUri });
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert("Download complete!", fileName);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download failed", "Something went wrong.");
    }
  };

  const renderFiles = (files: DocumentPicker.DocumentPickerAsset[]) =>
    files.map((file, idx) =>
      file && file.name && file.uri ? (
        <View key={idx} style={styles.fileItem}>
          <Ionicons name="document-text-outline" size={20} color="#2563eb" />
          <Text numberOfLines={1} style={styles.fileName}>{file.name}</Text>
          <TouchableOpacity onPress={() => downloadFile(file.uri!, file.name!)}>
            <Ionicons name="download-outline" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>
      ) : null
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={materials}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No materials uploaded yet.</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.materialCard}>
            <View style={styles.materialHeader}>
              <Text style={styles.materialTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteMaterial(index)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {renderFiles(item.files)}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {["Attendance", "Quiz", "Material"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalButton}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.modalButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={materialModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setMaterialModalVisible(false)}>
          <ScrollView style={styles.modalContainer} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.modalLabel}>Material Title</Text>
            <TextInput
              placeholder="Enter title"
              value={materialTitle}
              onChangeText={setMaterialTitle}
              style={styles.input}
            />

            <TouchableOpacity style={styles.attachBtn} onPress={pickFiles}>
              <Ionicons name="attach" size={20} color="white" />
              <Text style={styles.attachText}>Attach File</Text>
            </TouchableOpacity>

            {currentFiles.length > 0 ? (
              renderFiles(currentFiles)
            ) : (
              <Text style={{ color: "#6b7280", marginBottom: 10 }}>No file attached.</Text>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveMaterial}>
              <Text style={styles.saveButtonText}>Save Material</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#6b7280",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#3b82f6",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 10,
  },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  attachText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  materialCard: {
    backgroundColor: "#e0f2fe",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  materialTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1e3a8a",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fileName: {
    marginLeft: 5,
    flex: 1,
    marginRight: 10,
  },
});
