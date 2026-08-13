# App de agendamento de consultas

Aplicativo React Native com Expo para criar, consultar e cancelar consultas do paciente de demonstracao.

## Requisitos

- Node.js 20.19 ou superior
- API Laravel em execucao e banco preparado com `php artisan migrate:fresh --seed`

## Como executar

1. Copie `.env.example` para `.env`.
2. Ajuste `EXPO_PUBLIC_API_URL` para a API Laravel. No Android Emulator use `http://10.0.2.2:8000/api`; em dispositivo fisico, use o IP local da maquina, por exemplo `http://192.168.0.10:8000/api`.
3. Confirme `EXPO_PUBLIC_PATIENT_ID=1`, o paciente criado pelo seeder.
4. Instale e execute:

   ```bash
   npm install
   npx expo start
   ```

## Decisoes tecnicas

- **Navegacao:** Expo Router, com rotas de Home, agendamento, historico e detalhe.
- **HTTP:** Axios centralizado em `services/api`, um arquivo por recurso da API.
- **Estado e formularios:** hooks nativos do React (`useState`, `useEffect` e `useCallback`); nenhum estado global e nenhuma dependencia adicional sao necessarios para este escopo.
- **Validacao:** o aplicativo valida campos obrigatorios, formato de data/hora e data futura. O backend permanece a fonte de verdade para todas as regras de negocio.

## Funcionalidades

- Fluxo de agendamento com selecao de especialidade e profissional, data, horario, revisao e confirmacao.
- Historico do paciente demo com filtro por status e atualizacao manual.
- Detalhe e cancelamento de consultas com status `agendado` ou `confirmado`.
- Estados visiveis de carregamento, erro e lista vazia nas telas que consomem a API.
