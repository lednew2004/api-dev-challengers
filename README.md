# Challengers API

API REST para gerenciamento de desafios de programação com autenticação JWT, upload de imagens e validação de soluções.

## 📋 Requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 12+
- Docker e Docker Compose (opcional)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <https://github.com/lednew2004/api-dev-challengers.git>
cd challengers
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Porta da aplicação
PORT=3333

# JWT Secret para assinatura de tokens
JWT_SECRET=sua_chave_secreta_aqui

# Credenciais Cloudinary (para upload de imagens)
CLOUD_NAME=seu_cloud_name
API_KEY=sua_api_key
API_SECRET=sua_api_secret

# Banco de dados (se não usar Docker)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/challengers
```

### 4. Configurar banco de dados

#### Opção A: Com Docker Compose

```bash
docker-compose up -d
```

#### Opção B: PostgreSQL local

Certifique-se de que PostgreSQL está rodando e crie um banco de dados:

```sql
CREATE DATABASE challengers;
```

### 5. Executar migrations

```bash
npx prisma migrate dev
```

## 💻 Como rodar o projeto

### Desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`

## 📁 Estrutura do projeto

```
src/
├── server.ts              # Arquivo principal do servidor
├── env.ts                 # Validação de variáveis de ambiente
├── lib/
│   └── prisma.ts          # Cliente Prisma
└── htpp/
    ├── controllers/
    │   ├── users/         # Autenticação e perfil de usuários
    │   ├── challenger/    # Gerenciamento de desafios
    │   └── solution/      # Gerenciamento de soluções
    └── middlewares/
        └── verify-jwt.ts  # Middleware de autenticação

prisma/
├── schema.prisma          # Esquema do banco de dados
└── migrations/            # Histórico de migrations
```

## 🔌 Principais funcionalidades

- **Autenticação**: Registro e login com JWT
- **Desafios**: Criar, buscar e gerenciar desafios de programação
- **Soluções**: Submeter e validar soluções para desafios
- **Perfil**: Gerenciar perfil do usuário e links sociais
- **Upload de imagens**: Integração com Cloudinary

## 🔐 Variáveis de ambiente - Detalhes

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `PORT` | number | Porta da aplicação | 3333 |
| `JWT_SECRET` | string | Chave secreta JWT (use uma chave forte!) | abc123xyz... |
| `CLOUD_NAME` | string | Nome da conta Cloudinary | minha-cloud |
| `API_KEY` | string | Chave API Cloudinary | 123456789 |
| `API_SECRET` | string | Secret API Cloudinary | abc_xyz_123 |
| `DATABASE_URL` | string | URL de conexão PostgreSQL | postgresql://user:pass@localhost:5432/db |

## 📝 Dicas

- Gere uma chave JWT_SECRET forte usando: `openssl rand -base64 32`
- Para credenciais Cloudinary, crie uma conta em https://cloudinary.com
- CORS está configurado por padrão para `http://localhost:5173` (aplicação frontend)

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue ou entre em contato.
