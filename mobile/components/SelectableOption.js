import { Pressable, StyleSheet, Text } from 'react-native';

export default function SelectableOption({ title, subtitle, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: { backgroundColor: '#ffffff', borderColor: '#d9e0e8', borderRadius: 10, borderWidth: 1, gap: 3, padding: 14 },
  selected: { backgroundColor: '#e7f4f3', borderColor: '#257b78', borderWidth: 2 },
  pressed: { opacity: 0.82 },
  title: { color: '#12345b', fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#5b6472', fontSize: 14 },
});
