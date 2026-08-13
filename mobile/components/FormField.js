import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormField({ label, error, style, ...inputProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#8490a0"
        style={[styles.input, error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: '#2c3d54', fontSize: 14, fontWeight: '700' },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cdd6e1',
    borderRadius: 10,
    borderWidth: 1,
    color: '#12345b',
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputError: { borderColor: '#be3d3d' },
  error: { color: '#be3d3d', fontSize: 13 },
});
