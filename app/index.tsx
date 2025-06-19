import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dating App</Text>
      <Text style={styles.subtitle}>Welcome to your app!</Text>

      <Link href="./screens/recommend" style={styles.link}>
        <Text style={styles.linkText}>Go to Recommend Screen</Text>
      </Link>

      {/* <Link
        href="./not-found"
        style={[styles.link, { backgroundColor: Colors.accentRed }]}
      >
        <Text style={styles.linkText}>Test Screen</Text>
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.xxxl,
    color: Colors.mainWhite,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.lg,
    color: Colors.secondWhite,
    marginBottom: 40,
  },
  link: {
    backgroundColor: Colors.accentBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: "center",
  },
  linkText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
  },
});
