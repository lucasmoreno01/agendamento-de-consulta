import { router } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 112,
    padding: 20,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e0ea",
    borderRadius: 16,
  },

  cardPressed: {
    backgroundColor: "#f3f6ff",
  },

  content: {
    flex: 1,
    gap: 4,
  },

  title: {
    color: "#12345b",
    fontSize: 17,
    fontWeight: "700",
  },

  description: {
    color: "#5b6472",
    fontSize: 14,
    lineHeight: 20,
  },
})

export default function ActionCard({ title, description, href }) {
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  )
}
