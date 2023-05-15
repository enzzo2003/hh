// Importando Bibliotecas do NPM PACKAGE
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const cors = require('cors');
const { text } = require('body-parser');
const { enviarEmail, upload } = require('../src/nodemailer');
const { getStudents } = require('../src/sheets');


// Criando uma instacia do Express e assim lendo as CREDEN de serviço
const app = express();
const credentials = JSON.parse(fs.readFileSync('./creden.json', 'utf8'));
// Configura o servidor EXPRESS para usar MIDDLEWARE = processa soli , respostas = req , resp = response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Aqui foi COnfigurado o ENDPOINT para fazer a chamada e obter os alunos e as imagens
// METODO DA REQUISIÇAO "GET"
app.get('/students/:sheetName', async (req, res) => {
  const spreadsheetId = '1IaYIo6PwRK6i0Aola0Akxrd8VMlur1_OIWYGctTz4O4';
  const sheetName = req.params.sheetName; // Pega o parâmetro 'sheetName' da URL

  try {
    const students = await getStudents(spreadsheetId, sheetName);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro a buscar Alunos Na Planilha do google sheets (SERVIDOR)'); 
  }
});




// Aqui configurado o ENDPOINT do nodemailer para enviar emails 
// METODO DA REQUISIÇAO "POST"
app.post('/enviar-email', upload.single('arquivo'), enviarEmail);


// Configuraçao para o servidor na porta 3000 ou independente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Funfando PORTA: ${PORT}`);
});
