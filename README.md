# Módulo de agendamento de consultas

Aplicação composta por uma API REST em Laravel (`backend/`) e um aplicativo mobile React Native com Expo (`mobile/`). O projeto permite agendar, consultar o histórico, ver detalhes e cancelar consultas do paciente de demonstração.

## Pré-requisitos

- PHP 8.3 ou superior, Composer e extensão `pdo_mysql` habilitada
- MySQL 8+ ou MariaDB
- Node.js 20.19 ou superior e npm
- Expo Go, emulador Android ou simulador iOS 

## Configuração e execução

### 1. Backend

Crie o banco de dados no MySQL, por exemplo `conectasus`. Depois, na raiz do repositório:

```bash
cd backend
copy .env.example .env
composer install
php artisan key:generate
```

No arquivo `backend/.env`, informe a conexão do banco:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=conectasus
DB_USERNAME=root
DB_PASSWORD=sua_senha
```

Prepare os dados e inicie a API:

```bash
php artisan migrate:fresh --seed
php artisan serve
```

A API estará disponível em `http://127.0.0.1:8000/api`.

### 2. Mobile

Em outro terminal:

```bash
cd mobile
copy .env.example .env
npm install
npx expo start
```

Configure `mobile/.env` de acordo com o ambiente:

```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api

# Paciente criado pelo seeder
EXPO_PUBLIC_PATIENT_ID=1
```

Para iOS Simulator, use `http://127.0.0.1:8000/api`. Para um dispositivo físico, substitua a URL pelo IP local da máquina, por exemplo `http://192.168.0.10:8000/api`; o computador e o celular devem estar na mesma rede.

## Dados de demonstração

O comando `php artisan migrate:fresh --seed` cria:

- 1 paciente de demonstração, ID `1`;
- 3 especialidades;
- 6 profissionais distribuídos entre as especialidades;
- 4 consultas, uma para cada status: `agendado`, `confirmado`, `realizado` e `cancelado`.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/specialties` | Lista especialidades. |
| GET | `/api/professionals?specialty_id={id}` | Lista profissionais; filtro opcional por especialidade. |
| GET | `/api/appointments?patient_id={id}&status={status}` | Lista consultas do paciente; filtro de status opcional. |
| POST | `/api/appointments` | Cria uma consulta. |
| GET | `/api/appointments/{id}` | Retorna os detalhes de uma consulta. |
| PATCH | `/api/appointments/{id}/cancel` | Cancela consulta agendada ou confirmada. |

## Decisões de arquitetura

### Backend

- **Modelagem:** `Patient`, `Specialty`, `Professional` e `Appointment` usam relacionamentos Eloquent. Uma consulta pertence a um paciente e profissional; o profissional pertence a uma especialidade.
- **Integridade de dados:** a tabela `appointments` possui índice único em `(professional_id, scheduled_at)`, garantindo que um profissional não seja reservado duas vezes no mesmo horário, inclusive sob requisições concorrentes.
- **Camadas:** controllers API tratam requisição/resposta JSON e delegam a criação e o cancelamento ao `AppointmentService`. A regra de negócio não fica no controller.
- **Validação:** Form Requests validam formato e referências; o serviço aplica regras de data futura, disponibilidade, status inicial e transições de cancelamento. A API retorna `422` para dados/regra inválidos e `409` para conflito de agenda.
- **Seeders:** dados determinísticos facilitam avaliação e testes manuais.

### Mobile

- **Tecnologia:** React Native com Expo, JavaScript e Expo Router para rotas de início, agendamento, histórico e detalhes.
- **HTTP:** Axios é centralizado em `mobile/services/api`; cada recurso da API possui seu próprio serviço.
- **Organização:** as telas ficam em `mobile/screens`, componentes reutilizáveis em `mobile/components`, configurações em `mobile/constants` e formatações em `mobile/utils`.
- **Estado e formulários:** hooks nativos do React (`useState`, `useEffect` e `useCallback`) atendem ao escopo sem estado global ou biblioteca adicional de formulários.
- **Experiência:** o app apresenta estados explícitos de carregamento, erro e conteúdo vazio. Campos de data e horário aceitam somente dígitos, com máscaras `DD/MM/AAAA` e `HH:MM`; a data é convertida para ISO apenas no envio à API.
- **Regras:** a validação visual é complementar; a API é a fonte de verdade para as regras de negócio.

## Funcionalidades implementadas

- Agendamento: especialidade, profissional, data/hora, revisão e confirmação.
- Histórico do paciente de demonstração com filtro por status e atualização manual.
- Detalhes de consulta e cancelamento permitido para status `agendado` e `confirmado`.
- Estados de carregamento, erro e vazio nas telas que consomem a API.
