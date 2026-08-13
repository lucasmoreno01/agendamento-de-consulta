import { StyleSheet, Text, View } from 'react-native';

import ActionCard from '../components/ActionCard';
import ScreenContainer from '../components/ScreenContainer';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CUIDADO EM SAÚDE</Text>
        <Text style={styles.title}>Olá! Como podemos ajudar?</Text>
        <Text style={styles.description}>
          Agende uma consulta ou acompanhe seus atendimentos em um só lugar.
        </Text>
      </View>

      <View style={styles.actions}>
        <ActionCard
          icon="+"
          title="Agendar consulta"
          description="Escolha especialidade, profissional, data e horário."
          href="/appointments"
        />
        <ActionCard
          icon="≡"
          title="Meu histórico"
          description="Consulte seus agendamentos e atendimentos anteriores."
          href="/history"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 32,
  },
  eyebrow: {
    color: '#257b78',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: '#12345b',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },
  description: {
    color: '#5b6472',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 16,
  },
});
