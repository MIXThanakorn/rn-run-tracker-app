import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RunType } from "@/types/runtype";
export default function Run() {
  const { uid } = useLocalSearchParams();
  const [RunData, setRunData] = useState<RunType[]>([]);
  //ส่วนแสดงข้อมูลการวิ่งทั้งหมด

  const fetchRuns = async () => {
    if (!uid) return;

    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .eq("user_id", uid);

    if (error) {
      console.error("Error fetching runs:", error);
    } else {
      setRunData(data as RunType[]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (uid) {
        fetchRuns();
      }
    }, [uid]),
  );

  const handleAddRun = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push({
        pathname: "/add",
        params: { uid: user.id },
      });
    }
  };

  const renderItem = ({ item }: { item: RunType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
        <View style={styles.distanceBadge}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.dateText}>
            {(() => {
              const date = new Date(item.run_date);
              const buddhistYear = "พ.ศ. " + (date.getFullYear() + 543);
              return (
                new Intl.DateTimeFormat("th-TH", {
                  month: "long",
                  day: "numeric",
                }).format(date) +
                " " +
                buddhistYear
              );
            })()}
          </Text>
        </View>
        <Text style={styles.distanceText}>{item.distance} km</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/runimg.png")}
        style={styles.imglogo}
      />
      <FlatList
        data={RunData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={styles.floatingBtn} onPress={handleAddRun}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  imglogo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 15,
  },
  floatingBtn: {
    padding: 10,
    backgroundColor: "#00ff62",
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 60,
    right: 40,
    elevation: 3,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    // Shadow สำหรับ iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation สำหรับ Android
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  distanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  dateText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#888",
  },

  distanceText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
    color: "#00ff62",
  },
});
