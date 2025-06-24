import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Test Screen' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Test Screen Working!</Text>
        <Text style={styles.subtitle}>Poppins Font Test</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go Back</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.xxl,
    color: Colors.mainWhite,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.secondWhite,
    marginBottom: 30,
  },
  link: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  linkText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.mainBlack,
  },
});