# FIAP Food Preparation - Microsserviço de Preparação

## 📋 Descrição

Este é o microsserviço responsável pela operacionalização do processo de produção de pedidos da lanchonete FIAP Food, incluindo:

- Gerenciamento da fila de pedidos para a cozinha
- Controle de status de preparação
- Atualização de tempo de espera
- Notificação de pedidos prontos
- Interface para a cozinha

## 🏗️ Arquitetura

### Tecnologias Utilizadas
- **Framework**: NestJS
- **Banco de Dados**: PostgreSQL (SQL)
- **ORM**: TypeORM
- **Mensageria**: RabbitMQ
- **Containerização**: Docker
- **Orquestração**: Kubernetes
- **Cloud**: AWS EKS

### Padrões Arquiteturais
- **Clean Architecture**
- **CQRS (Command Query Responsibility Segregation)**
- **Event Sourcing**
- **Domain-Driven Design (DDD)**

## 🧪 Testes e Qualidade

### Cobertura de Testes
Este projeto mantém uma cobertura de testes superior a **80%** conforme exigido:

![Test Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)

#### Tipos de Teste Implementados:
- ✅ **Testes Unitários** - Jest
- ✅ **Testes de Integração** - Jest + Supertest
- ✅ **Testes BDD** - Cucumber
- ✅ **Testes de Aceitação** - Cucumber + Docker

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes de integração
npm run test:integration

# Testes BDD/Aceitação
npm run test:acceptance

# Todos os testes
npm run test:all
```

### Relatórios de Cobertura

Os relatórios de cobertura são gerados automaticamente e podem ser encontrados em:
- **Arquivo local**: `./coverage/lcov-report/index.html`
- **CI/CD**: Integrado com SonarQube
- **Badge**: ![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fiap-food-preparation&metric=coverage)

## 🚀 Deploy e CI/CD

### Pipeline de Deploy
O projeto utiliza GitHub Actions para CI/CD com as seguintes etapas:

1. **Análise de Código** (ESLint + SonarQube)
2. **Build da Aplicação**
3. **Testes Unitários**
4. **Testes de Integração**
5. **Testes de Aceitação**
6. **Build do Container Docker**
7. **Deploy no Kubernetes (AWS EKS)**

### Proteção de Branches
- ✅ Branch `main` protegida
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ SonarQube quality gate (70% coverage mínimo)

## 📚 Funcionalidades

### Endpoints Principais

#### Preparação
- `GET /preparations` - Listar pedidos na fila
- `POST /preparations` - Iniciar preparação de pedido
- `PUT /preparations/:id/status` - Atualizar status de preparação
- `GET /preparations/queue` - Visualizar fila da cozinha

### Estados de Preparação

```mermaid
stateDiagram-v2
    [*] --> Recebido
    Recebido --> EmPreparacao: Iniciar Preparação
    EmPreparacao --> Pronto: Finalizar Preparação
    Pronto --> Finalizado: Cliente Retirou
    Finalizado --> [*]
```

### Comunicação com Outros Microsserviços

```mermaid
graph TD
    A[Orders Service] -->|Solicitar Preparação| B[Preparation Service]
    B -->|Status: Em Preparação| A
    B -->|Status: Pronto| A
    B -->|Status: Finalizado| A
```

## 🍳 Interface da Cozinha

### Dashboard em Tempo Real
- **Fila de Pedidos**: Visualização em tempo real
- **Tempo de Espera**: Cálculo automático por pedido
- **Priorização**: Algoritmo FIFO (First In, First Out)
- **Notificações**: Alertas sonoros para novos pedidos

### Exemplo de Tela da Cozinha

```
+----------------------------------+
|        FILA DE PREPARAÇÃO        |
+----------------------------------+
| Pedido #001 | 15min | [PREPARAR] |
| Pedido #002 | 8min  | [PREPARAR] |
| Pedido #003 | 3min  | [PREPARAR] |
+----------------------------------+
|      EM PREPARAÇÃO (2)           |
+----------------------------------+
| Pedido #004 | 5min  | [PRONTO]   |
| Pedido #005 | 12min | [PRONTO]   |
+----------------------------------+
```

## 🐳 Executar Localmente

### Pré-requisitos
- Node.js 20.9+
- Docker
- Docker Compose
- PostgreSQL

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/thallis-andre/fiap-food-preparation.git
cd fiap-food-preparation

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar dependências (PostgreSQL, RabbitMQ)
docker-compose up -d

# Executar migrações
npm run migration:run

# Iniciar a aplicação
npm run start:dev
```

### Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/fiap-food-preparation
RABBITMQ_URL=amqp://localhost:5672
```

## 🗄️ Banco de Dados

### Modelo de Dados

```sql
CREATE TABLE preparations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED',
    estimated_time INTEGER,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preparations_status ON preparations(status);
CREATE INDEX idx_preparations_created_at ON preparations(created_at);
```

### Migrações

```bash
# Criar nova migração
npm run migration:create -- --name=NomeDaMigracao

# Executar migrações
npm run migration:run

# Reverter migração
npm run migration:revert
```

## 📊 Monitoramento

### Health Check
- **Endpoint**: `/health`
- **PostgreSQL**: Verificação de conectividade
- **RabbitMQ**: Verificação de conectividade

### Métricas
- **Tempo médio de preparação**
- **Número de pedidos na fila**
- **Taxa de throughput**
- **Tempo de espera por pedido**

### Logs
- **Framework**: Winston
- **Formato**: JSON estruturado
- **Níveis**: error, warn, info, debug

## 🎯 Algoritmos

### Estimativa de Tempo
```typescript
calculateEstimatedTime(orderItems: OrderItem[]): number {
  const baseTime = 5; // minutos base
  const itemTime = orderItems.reduce((total, item) => {
    return total + (item.preparationTime * item.quantity);
  }, 0);
  
  return baseTime + itemTime;
}
```

### Priorização de Pedidos
- **FIFO**: First In, First Out
- **Pedidos especiais**: Prioridade alta
- **Tempo de espera**: Ajuste automático

## 🏷️ Versionamento

Este projeto segue o padrão [Semantic Versioning](https://semver.org/).

## 👥 Autor

- **Desenvolvedor/Arquiteto**: Thallis André Faria Moreira - RM360145

## 

Este projeto é propriedade da FIAP - Faculdade de Informática e Administração Paulista.