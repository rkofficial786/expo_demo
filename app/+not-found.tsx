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
    backgroundColor: '#000000', // mainBlack
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF', // mainWhite
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#72777C', // secondWhite
    marginBottom: 30,
  },
  link: {
    backgroundColor: '#FFB902', // accentYellow
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  linkText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
  },
});