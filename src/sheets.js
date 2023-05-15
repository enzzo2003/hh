const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('./creden.json', 'utf8'));

// Função para autorizar o acesso à API do Google Sheets
async function authorize() {
  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  await client.authorize();
  return client;
}

// Função para obter os alunos e as URLs das imagens das planilhas do Google Sheets
async function getStudents(spreadsheetId, sheetName) {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:B`,
  });

  const students = data.values.map(([name, imageUrl]) => ({ name, imageUrl, className: sheetName }));
  return students;
}

module.exports = { getStudents };
