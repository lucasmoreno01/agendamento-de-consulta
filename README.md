# Modulo de agendamento de consultas

Repositorio com uma API Laravel em `backend/` e um aplicativo Expo em `mobile/`.

## Execucao

Prepare e inicie a API:

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve
```

Em outro terminal, configure e inicie o aplicativo:

```bash
cd mobile
copy .env.example .env
npm install
npx expo start
```

Para Android Emulator, mantenha `EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api`. Em dispositivo fisico, substitua pelo IP local da maquina. O seeder cria o paciente de demonstracao com ID `1`; esse valor e configurado por `EXPO_PUBLIC_PATIENT_ID`.

## Decisoes do mobile

- React Native com Expo e JavaScript.
- Expo Router organiza as rotas de inicio, agendamento, historico e detalhes.
- Axios centraliza a comunicacao HTTP em `mobile/services/api`.
- Hooks do React gerenciam estado e formularios, sem estado global adicional.
- As validacoes visuais sao locais; as regras de negocio permanecem validadas pela API.

Consulte [mobile/README.md](mobile/README.md) para os detalhes de configuracao e funcionalidades do aplicativo.
