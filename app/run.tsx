import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
export default function Run() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/runimg.png")}
        style={styles.imglogo}
      />

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  imglogo: {
    width: 150,
    height: 150,
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
});
