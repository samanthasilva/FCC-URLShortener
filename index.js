require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlParser = require('url');
const path = require('path');

const app = express();

// Configuração básica
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos e HTML
app.use(express.static(path.join(__dirname)));

// Rota para servir o HTML principal
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Banco de dados em memória
let urlDatabase = [];
let urlCounter = 1;

// Endpoint POST para criar uma URL curta
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Parse da URL
  const parsedUrl = urlParser.parse(originalUrl);

  // Validação da URL
  if (!parsedUrl.hostname) {
    return res.json({ error: 'invalid url' });
  }

  // Verificação DNS
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      let existingUrl = urlDatabase.find(entry => entry.original_url === originalUrl);

      if (existingUrl) {
        res.json({
          original_url: existingUrl.original_url,
          short_url: existingUrl.short_url
        });
      } else {
        let newUrlEntry = {
          original_url: originalUrl,
          short_url: urlCounter++
        };
        urlDatabase.push(newUrlEntry);

        res.json({
          original_url: newUrlEntry.original_url,
          short_url: newUrlEntry.short_url
        });
      }
    }
  });
});

// Endpoint GET para redirecionar usando a URL curta
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

// Iniciar servidor
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// Código para manipulação do DOM no navegador
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    const messages = document.querySelector('.app__messages');

    const message = [
      'Hello there!',
      'Welcome to the <span>request header parser</span> microservice.',
      'Fancy words, right?',
      'Simply put, it means you can ping the <span>server</span> at the following <span>endpoint</span>:',
      '<code>[project_url]/api/whoami</code>',
      'and have in return information regarding <span>your device</span>.',
      'Something similar to the following:',
      '<code>{"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5", "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}</code>',
      'And that\'s it!'
    ];

    let counter = 0;
    const intervalID = setInterval(() => {
      // Cria um novo elemento de mensagem
      const messageElement = document.createElement('div');
      messageElement.classList.add('messages--message');
      messageElement.innerHTML = message[counter];
      
      // Adiciona a nova mensagem no início do contêiner
      messages.prepend(messageElement);
      
      counter++;
      
      if (counter === message.length) {
        clearInterval(intervalID);
      }
    }, 3000);
  });
}

