# ImobiManager: Sistema de Gestão de Propriedades Imobiliárias

## Descrição

ImobiManager é uma API RESTful desenvolvida em Node.js e TypeScript para gerenciar um sistema simples de propriedades imobiliárias. O projeto utiliza PostgreSQL como banco de dados e TypeORM para interação com o banco. 

## Tecnologias Utilizadas

* **Node.js:** ≥ 18
* **TypeScript:** Para tipagem estática e melhor organização do código.
* **PostgreSQL:** ≥ 14
* **TypeORM:** ORM para interação com o banco de dados.

## Funcionalidades

* **Cadastro de Propriedades:** Criação, leitura, atualização e exclusão de propriedades.
* **Cadastro de Construtoras:** Criação de construtoras e vinculação com propriedades.
* **Gerenciamento de Endereços:** População automática de endereços via API de CEP.
* **Upload de Imagens:** Upload de imagens para as propriedades e armazenamento no backend.
* **Filtros:** Filtragem de propriedades por preço, número de quartos, banheiros e localização (opcional).
* **Editor WYSIWYG:** Para descrição detalhada das propriedades.

## Arquitetura

* **Backend:** Node.js com Express.js para a API RESTful.
* **Banco de Dados:** PostgreSQL para armazenamento de dados.
* **ORM:** TypeORM para interação com o banco de dados.

## Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DanielSantanaSilva/Imobi-Manager-Api.git

2. **Instale as dependências:**
   ```bash
   npm install

3. **Configure o banco de dados:**
Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente para conexão com o banco de dados.

4. **Execute a aplicação:**
   ```bash
   npm start

## Contribuindo
Agradecemos sua contribuição! Para contribuir com o projeto, siga estes passos:

* Fork o repositório.
* Crie uma nova branch.
* Faça suas alterações e commit.
* Envie um pull request.

Licença:
Este projeto está licenciado sob a licença MIT.

Autores
Daniel Santana Silva - Desenvolvedor principal
