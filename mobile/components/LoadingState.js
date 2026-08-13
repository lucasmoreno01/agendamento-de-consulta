import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingState({ message = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#257b78" size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 14, justifyContent: 'center', minHeight: 220 },
  text: { color: '#5b6472', fontSize: 16 },
});
