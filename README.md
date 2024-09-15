# Vue.js Client CRUD - Frontend

Este projeto é uma aplicação Vue.js para operações CRUD (Create, Read, Update, Delete). Ele usa o Vue.js 3 como framework JavaScript, integrações com Bootstrap para estilos, e utiliza várias bibliotecas como Axios, Vue Router, SweetAlert2 e Vue Toastification. Além disso, o projeto está configurado para ser executado em um ambiente Docker e inclui testes unitários usando Jest.

## Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript para construção da interface de usuário.
- **Axios** - Cliente HTTP para comunicação com APIs.
- **Bootstrap 5** - Biblioteca de estilos CSS.
- **Bootstrap Vue 3** - Integração de componentes Vue com Bootstrap 5.
- **Vue Router** - Roteamento de páginas na aplicação.
- **SweetAlert2** - Biblioteca de alertas personalizados.
- **Vue Toastification** - Biblioteca para exibição de notificações/toasts.
- **Jest** - Framework de testes unitários.
- **Docker** - Utilizado para a containerização da aplicação.

## Requisitos

- **Node.js** versão 16 ou superior.
- **Docker** versão 20.10 ou superior.
- **Docker Compose** versão 1.29 ou superior.

## Configuração e Execução

### Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/vue-js-client-crud.git
cd vue-js-client-crud
```

## Executando localmente
```bash
npm install
npm run serve
```

## Executando no Docker
- **Construir a imagem Docker e executar container:**
```bash
docker-compose up -d --build
```