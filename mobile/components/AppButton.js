import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function AppButton({ title, onPress, loading = false, disabled = false, variant = 'primary' }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        isDisabled && styles.disabledButton,
        pressed && !isDisabled && styles.pressedButton,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#257b78' : '#ffffff'} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#257b78',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#257b78',
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: '#be3d3d',
  },
  disabledButton: {
    backgroundColor: '#aeb9c5',
    borderColor: '#aeb9c5',
  },
  pressedButton: {
    opacity: 0.84,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#257b78',
  },
});
