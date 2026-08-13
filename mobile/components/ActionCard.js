import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ActionCard({ icon, title, description, href }) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e0e6ee',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    minHeight: 112,
    padding: 20,
  },
  cardPressed: {
    backgroundColor: '#f0f7f7',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#dff3f1',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  icon: {
    color: '#257b78',
    fontSize: 28,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#12345b',
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: '#5b6472',
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    color: '#257b78',
    fontSize: 32,
    fontWeight: '300',
  },
});
