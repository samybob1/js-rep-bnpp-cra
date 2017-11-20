const fs = require('fs');
const path = require('path');
const moment = require('moment');
const puppeteer = require('puppeteer');
const { argv } = require('yargs');
const userHome = require('user-home');

module.exports = generatePdf;

async function generatePdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `http://localhost:${argv.port}`;
  const pdfPath = getOutputPath();

  await page.goto(url, {
    waitUntil: 'networkidle'
  });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true
  });

  await browser.close();

  console.info(`Here is your PDF: "${pdfPath}" 😜`);
}

function getOutputPath() {
  const STATE_PATH = path.join(process.env.PWD, 'dist', 'state.json');
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
  const [firstName, lastName] = state.name.split(' ');

  const trigram = firstName[0].toUpperCase() +
    lastName.substr(0, 2).toUpperCase();

  const date = moment()
    .set('year', state.date.year)
    .set('month', state.date.month)
    .format('YYYY-MM');

  const outputFolder = `${userHome}/Desktop`;
  const outputFileName = `CRA-BNPP-${trigram}-${date}.pdf`;

  if (fs.existsSync(outputFolder)) {
    return `${outputFolder}/${outputFileName}`;
  }

  return path.join(process.env.PWD, 'outputs', outputFileName);
}
