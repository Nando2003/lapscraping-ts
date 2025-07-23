Para rodar sua aplicação `laptop-scraping`, siga as instruções abaixo.

## Laptop Scraping Application

Este projeto é uma aplicação de web scraping desenvolvida em TypeScript que coleta informações sobre laptops de um site de e-commerce e as disponibiliza através de uma API RESTful. Ele utiliza Redis para caching dos resultados da raspagem.

## Como Rodar a Aplicação

A aplicação pode ser executada tanto em modo de desenvolvimento quanto em produção utilizando Docker Compose.

### Pré-requisitos

Certifique-se de ter o [Docker](https://www.docker.com/get-started/) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados em sua máquina.

### Configuração do Ambiente

1.  **Variáveis de Ambiente**: A aplicação utiliza variáveis de ambiente para configuração do Redis e do modo de debug. Crie um arquivo `.env` na pasta `dotenv_files/` (ou seja, `dotenv_files/.env`) com base no `.env-example` fornecido:

    ```bash
    cp dotenv_files/.env-example dotenv_files/.env
    ```

    O conteúdo do `dotenv_files/.env-example` é:

    ```
    DEBUG=1
    REDIS_HOST=laptop_redis
    REDIS_PORT=6379
    ```

    Você pode alterar `DEBUG` para `0` para rodar em modo de produção.

### Rodando com Docker Compose

Navegue até o diretório raiz do projeto onde o arquivo `docker-compose.yml` está localizado.

1.  **Construir e Iniciar os Serviços**:

    Para iniciar a aplicação e o servidor Redis, execute:

    ```bash
    docker-compose up --build
    ```

      * `--build`: Garante que as imagens Docker sejam construídas (ou reconstruídas) antes de iniciar os contêineres.

    A aplicação estará acessível em `http://localhost:3000`.
    O Redis estará acessível em `http://localhost:3001`.

### Modos de Execução

O `entrypoint.sh` gerencia o modo de execução da aplicação:

  * **Modo de Desenvolvimento (`DEBUG=1`)**:
    A aplicação é iniciada com `npm run dev`, que usa `ts-node-dev` para recarregar automaticamente as alterações de código. Isso é ideal para desenvolvimento.
  * **Modo de Produção (`DEBUG=0`)**:
    A aplicação primeiro executa `npm run build` para compilar o TypeScript para JavaScript, e então `npm start` para iniciar a aplicação compilada.

### Endpoints da API

Uma vez que a aplicação esteja rodando, você pode acessar os seguintes endpoints:

  * **API Principal**: `http://localhost:3000/api/laptops`

      * **Método**: `GET`
      * **Descrição**: Lista laptops, com filtro por título e opções de ordenação.
      * **Parâmetros de Query**:
          * `searchByTitle` (opcional, string): Texto para buscar no nome do laptop.
          * `sortBy` (opcional, string): Ordena por `price` (preço) ou `name` (nome). Padrão é `price`.
          * `reverse` (opcional, boolean): Se `true`, inverte a ordem dos resultados.

  * **Documentação Swagger**: `http://localhost:3000/docs`

      * **Descrição**: Documentação interativa da API gerada automaticamente com Swagger UI.

### Estrutura do Projeto

  * `src/services/scraping-service.ts`: Contém a lógica principal para raspar os dados dos laptops.
  * `src/routes/laptop-routes.ts`: Define as rotas da API para buscar e filtrar laptops.
  * `src/external/redis-connection.ts`: Gerencia a conexão com o Redis.
  * `src/models/laptop-models.ts`: Define as interfaces de dados para `Laptop` e `LaptopReview`.
  * `src/server.ts`: Configura e inicia o servidor Express, integra as rotas e a documentação Swagger.
  * `docker-compose.yml`: Define os serviços Docker para a aplicação Express e o servidor Redis.
  * `Dockerfile`: Contém as instruções para construir a imagem Docker da aplicação.
  * `entrypoint.sh`: Script de entrada para o contêiner Docker, alternando entre modos de desenvolvimento e produção.
  * `package.json`: Lista as dependências do projeto e os scripts npm.
  * `tsconfig.json`: Configurações do compilador TypeScript.
  * `.dockerignore`: Arquivos e diretórios a serem ignorados pelo Docker durante a construção da imagem.
  * `.gitignore`: Arquivos e diretórios a serem ignorados pelo Git.