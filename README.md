# Projeto PauloSomativa - Sistema de Gestão de Aeronaves e Manutenção

## Descrição

Este projeto é um sistema backend para gerenciamento de aeronaves, suas manutenções e peças/componentes relacionados. Utiliza Prisma ORM para comunicação com banco MySQL e Node.js + TypeScript para a lógica de negócio.

---

## Tecnologias utilizadas

- Node.js com TypeScript  
- Prisma ORM  
- MySQL (banco de dados)  
- Docker (para containerização dos serviços)  
- REST API (possível extensão futura)  

---

## Modelagem do Banco de Dados

O banco contém três entidades principais:

- **Aircraft** (Aeronave)  
- **Maintenance** (Manutenção)  
- **Component** (Peça/Componente)

As relações são:

- Uma aeronave pode ter várias manutenções (1:N)  
- Cada manutenção pode ter várias peças/componentes (1:N)

---

## Arquitetura Proposta com Docker

+-------------+ +----------------+ +------------------+
| | | | | |
| Client | <---> | API Gateway | <---> | MySQL Database |
| (ex: React) | | (opcional) | | (Persistência) |
| | | | | |
+-------------+ +----------------+ +------------------+
|
| Rede Docker Interna
|
-----------------------------------------------------------
| | | |
+-----------+ +------------+ +--------------+ +--------------+
| Aircraft | | Maintenance| | Component(s) | ... | Outros Serv. |
| Service | | Service | | Service | | (Containers) |
+-----------+ +------------+ +--------------+ +--------------+
(Node.js) (Node.js) (Node.js)

yaml
Copiar
Editar

- Cada serviço roda em um container Docker isolado.
- Comunicação interna entre containers pela rede Docker.
- Banco de dados MySQL pode rodar em container separado ou ser um serviço externo.

---

## Funcionalidades principais

- CRUD de aeronaves  
- Registro de manutenções vinculadas a aeronaves  
- Cadastro e consulta de componentes/peças vinculadas às manutenções  

---

## Como rodar o projeto

1. Clonar o repositório  
2. Configurar o banco MySQL (local ou em container) e ajustar a variável `DATABASE_URL` no `.env`  
3. Rodar as migrations ou `prisma db push` para criar as tabelas  
4. Executar `npx prisma generate` para gerar o client  
5. Construir e rodar os containers Docker dos serviços com `docker-compose up --build` (ou scripts equivalentes)

---

## Exemplo de uso (repository)

```ts
const newComponent = await prisma.component.create({
  data: {
    name: "Filtro de óleo",
    partNumber: "F1234",
    amount: 2,
    supplier: "Fornecedor XYZ",
    maintenanceId: "cuid-da-manutenção"
  }
});
