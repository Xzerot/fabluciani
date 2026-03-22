/**
 * Génère un PDF prêt à l'impression de la carte de visite.
 * Usage : node scripts/export-carte.mjs
 * Prérequis : npm install puppeteer --save-dev
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '../print/carte-de-visite.html');
const outputPath = resolve(__dirname, '../print/carte-de-visite-PRINT.pdf');

console.log('🖨️  Génération du PDF...');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Charger le fichier HTML local
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

// Attendre que les polices Google Fonts soient chargées
await page.evaluateHandle('document.fonts.ready');

// Générer le PDF
await page.pdf({
  path: outputPath,
  format: 'A4',
  landscape: true,
  printBackground: true,       // Indispensable pour les couleurs de fond
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();

console.log(`✅ PDF généré : ${outputPath}`);
console.log('   → Envoyez ce fichier directement à votre imprimeur.');
