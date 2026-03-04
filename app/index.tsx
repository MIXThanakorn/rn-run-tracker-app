import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/runimg.png")}
        style={styles.imglogo}
      />
      <Text style={[styles.appname, { fontSize: 32, marginTop: 20 }]}>
        Run tracker
      </Text>
      <Text style={[styles.appname, { fontSize: 16, marginTop: 10 }]}>
        วิ่งเพื่อสุขภาพ
      </Text>
      <ActivityIndicator
        size="large"
        color="#00ff62"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  appname: {
    color: "black",
    fontFamily: "Kanit_400Regular",
  },
  imglogo: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});
