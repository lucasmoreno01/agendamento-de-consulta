import { StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../components/ScreenContainer';

export default function PlaceholderScreen({ title, description }) {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e6ee',
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  title: {
    color: '#12345b',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: '#5b6472',
    fontSize: 16,
    lineHeight: 24,
  },
});
