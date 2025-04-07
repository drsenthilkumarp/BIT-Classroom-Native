import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

// Type definitions
type Student = {
  id: string;
  name: string;
  reg: string;
  status: "Present" | "Absent";
  percentage: number;
};

// Navigation type
type RootStackParamList = {
  Attendance: undefined;
};

// Utility functions
const generateRandomPercentage = (): number =>
  Math.floor(Math.random() * 41) + 60;

const generateStudents = (): Student[] => {
  const names = [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ivy", "Jack",
    "Kevin", "Liam", "Mia", "Nora", "Oscar", "Paul", "Queen", "Rachel", "Steve", "Tina",
    "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane", "Abby", "Ben", "Cathy", "Dan",
    "Ella", "Finn", "Gina", "Henry", "Isla", "Jake", "Kara", "Leo", "Mona", "Nate",
    "Olive", "Pete", "Quinn", "Rita", "Sam", "Tess", "Ugo", "Vera", "Will", "Xena",
    "Yuri", "Zack", "Amy", "Brian", "Clara", "Dylan", "Elsa", "Fred", "Gloria", "Howard"
  ];
  return names.map((name, index) => ({
    id: `${index + 1}`,
    name,
    reg: `REG${(index + 1).toString().padStart(3, "0")}`,
    status: Math.random() > 0.5 ? "Present" : "Absent",
    percentage: generateRandomPercentage(),
  }));
};

const Attendance: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>(generateStudents());
  const [search, setSearch] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [originalStatuses, setOriginalStatuses] = useState<string[]>([]);
  const [showReport, setShowReport] = useState<boolean>(false);

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setCountdown(10);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setOtp("");
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const toggleSelectAll = () => {
    if (!selectAll) {
      setOriginalStatuses(students.map((s) => s.status));
      setStudents((prev) => prev.map((s) => ({ ...s, status: "Present" })));
    } else {
      setStudents((prev) =>
        prev.map((s, i) => ({ ...s, status: originalStatuses[i] || s.status }))
      );
    }
    setSelectAll(!selectAll);
  };

  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.length - presentCount;

  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.reg.toLowerCase().includes(query) ||
      s.status.toLowerCase().includes(query) ||
      (query.startsWith("%>") && s.percentage > parseInt(query.slice(2))) ||
      (query.startsWith("%<") && s.percentage < parseInt(query.slice(2))) ||
      (query.startsWith("%=") && s.percentage === parseInt(query.slice(2)))
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.hourTitle}>Hours</Text>
      <View style={styles.hourSelector}>
        {[1, 2, 3, 4, 5, 6, 7].map((hr) => (
          <TouchableOpacity
            key={hr}
            style={[
              styles.hourButton,
              selectedHours.includes(hr) && styles.hourButtonSelected,
            ]}
            onPress={() => {
              setSelectedHours((prev) =>
                prev.includes(hr)
                  ? prev.filter((h) => h !== hr)
                  : [...prev, hr]
              );
            }}
          >
            <Text
              style={{
                color: selectedHours.includes(hr) ? "white" : "black",
              }}
            >
              {hr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.otpButton} onPress={generateOtp}>
          <Text style={styles.buttonText}>Generate OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => setShowReport((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {showReport ? "Hide Report" : "Show Report"}
          </Text>
        </TouchableOpacity>
      </View>

      {otp !== "" && (
        <View style={styles.otpContainer}>
          <Text style={styles.otpDisplay}>OTP: {otp}</Text>
          <Text style={styles.timeLeft}>Time left: {countdown} sec</Text>
        </View>
      )}

      <View style={styles.countRow}>
        <Text style={styles.countLabel}>Present: {presentCount}</Text>
        <Text style={styles.countLabel}>Absent: {absentCount}</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, reg no, status or % (e.g., %>75, %=90, %<60)"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <View>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentReg}>{item.reg}</Text>
              <Text
                style={[
                  styles.attendancePercent,
                  { color: item.percentage >= 80 ? "green" : "red" },
                ]}
              >
                {item.percentage}% attendance
              </Text>
            </View>
            <Text
              style={
                item.status === "Present" ? styles.present : styles.absent
              }
            >
              {item.status}
            </Text>
          </View>
        )}
      />

      {showReport && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportHeader}>Attendance Report</Text>
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reportItem}>
                <Text style={styles.reportText}>
                  {item.name} ({item.reg}) - {item.status} - {item.percentage}%
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  hourTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3b82f6",
    marginBottom: 6,
  },
  hourSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  hourButton: {
    padding: 10,
    margin: 4,
    backgroundColor: "#ddd",
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  hourButtonSelected: {
    backgroundColor: "#3b82f6",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  otpButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  reportButton: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  otpDisplay: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    color: "#dc2626",
    fontWeight: "bold",
  },
  otpContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  timeLeft: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  studentItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentReg: {
    fontSize: 14,
    color: "#555",
  },
  attendancePercent: {
    fontSize: 12,
  },
  present: {
    color: "green",
    fontWeight: "bold",
  },
  absent: {
    color: "red",
    fontWeight: "bold",
  },
  reportContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 10,
  },
  reportHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#0284c7",
  },
  reportItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  reportText: {
    fontSize: 14,
  },
});
