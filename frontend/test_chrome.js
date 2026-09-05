import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testConnection() {
  console.log('Launching local Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  const title = await page.title();
  console.log('Page title:', title);

  await browser.close();
  console.log('Chrome test successful!');
}

testConnection().catch(err => {
  console.error('Chrome test error:', err);
  process.exit(1);
});
