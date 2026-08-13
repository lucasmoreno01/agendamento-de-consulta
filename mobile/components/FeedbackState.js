import { StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';

export default function FeedbackState({ title, description, actionTitle, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction ? <AppButton title={actionTitle} onPress={onAction} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12, justifyContent: 'center', minHeight: 220, paddingHorizontal: 24 },
  title: { color: '#12345b', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  description: { color: '#5b6472', fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
