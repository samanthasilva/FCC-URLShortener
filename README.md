# URL Shortener Microservice

Este é um microserviço para encurtamento de URLs desenvolvido como parte do projeto de Desenvolvimento Back-End e APIs. Ele permite que você converta URLs longas em URLs curtas que podem ser usadas para redirecionamento.

## Como Funciona

1. **Encurtar uma URL**
   - Envie uma requisição POST para `/api/shorturl` com um campo `url` contendo a URL que você deseja encurtar.
   - Exemplo de Requisição:
     ```bash
     curl -X POST https://seu-domínio.com/api/shorturl -d "url=https://www.exemplo.com"
     ```
   - A resposta será um objeto JSON contendo a URL original e uma URL encurtada gerada pelo serviço:
     ```json
     {
       "original_url": "https://www.exemplo.com",
       "short_url": 1
     }
     ```

2. **Redirecionar usando uma URL Encurtada**
   - Acesse `/api/shorturl/<short_url>` onde `<short_url>` é o código curto fornecido na resposta da etapa anterior.
   - O servidor irá redirecioná-lo automaticamente para a URL original.

## Rotas da API

- `POST /api/shorturl`: Recebe uma URL longa e retorna uma URL encurtada.
- `GET /api/shorturl/:short_url`: Redireciona a URL curta para a URL original.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento JavaScript do lado do servidor.
- **Express.js**: Framework web para Node.js.

## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/samanthasilva/seu-repositorio-urlshortener.git
   cd seu-repositorio-urlshortener
