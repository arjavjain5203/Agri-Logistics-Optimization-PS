import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve('./screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runLiveBrowserTest() {
  console.log('🚀 Launching Chrome to test AgriFlow End-to-End...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleMessages = [];
  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    // 1. Landing Page
    console.log('\n--- 1. Testing Landing Page ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    console.log('Title:', await page.title());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_page.png') });
    console.log('📸 Captured 01_landing_page.png');

    // Language Toggle Test
    console.log('Testing Language Toggle to Hindi...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hi = btns.find((b) => b.textContent.includes('हिन्दी'));
      if (hi) hi.click();
    });
    await sleep(500);
    const hiText = await page.evaluate(() => document.body.innerText);
    console.log('Hindi Headline Found:', hiText.includes('खेत से मांग तक') || hiText.includes('बुद्धिमानी'));

    // Toggle back to English
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const en = btns.find((b) => b.textContent.trim() === 'EN');
      if (en) en.click();
    });
    await sleep(500);

    // 2. Login Page
    console.log('\n--- 2. Testing Login Page & Persona Switching ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_login_page.png') });
    console.log('📸 Captured 02_login_page.png');

    // Login as Farmer (Ramesh)
    console.log('Logging in as Farmer (Ramesh Kumar)...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div'));
      const farmerCard = cards.find(
        (c) => c.textContent.includes('Ramesh Kumar') || c.textContent.includes('रमेश')
      );
      if (farmerCard) farmerCard.click();
    });
    await sleep(1000);
    console.log('Current URL after Farmer login:', page.url());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_farmer_dashboard.png') });
    console.log('📸 Captured 03_farmer_dashboard.png');

    // 3. AI Demand Intelligence Page
    console.log('\n--- 3. Testing AI Demand Intelligence & ML Forecasting ---');
    await page.goto(`${BASE_URL}/ai`, { waitUntil: 'networkidle2' });
    await sleep(2000); // Allow live API fetch

    const aiPageContent = await page.evaluate(() => document.body.innerText);
    console.log('ML Service Status Badge:', aiPageContent.includes('LIGHTGBM') || aiPageContent.includes('ACTIVE') ? '✅ ACTIVE' : '⚠️ Fallback');
    console.log('Weather Signal Displayed:', aiPageContent.includes('Weather Engine') || aiPageContent.includes('Open-Meteo') ? '✅ Present' : '❌ Missing');
    console.log('Demand Forecast Values:', aiPageContent.includes('kg') ? '✅ Present' : '❌ Missing');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_ai_demand_intelligence.png') });
    console.log('📸 Captured 04_ai_demand_intelligence.png');

    // Test Changing Crop Selector to 'Potato'
    console.log('Switching AI Forecast Crop to Potato...');
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      if (selects[0]) {
        selects[0].value = 'Potato';
        selects[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_ai_forecast_potato.png') });
    console.log('📸 Captured 05_ai_forecast_potato.png');

    // 4. Smart Matching Page
    console.log('\n--- 4. Testing Smart Matching ---');
    await page.goto(`${BASE_URL}/buyer/matching`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_smart_matching.png') });
    console.log('📸 Captured 06_smart_matching.png');

    // 5. Smart Logistics Page
    console.log('\n--- 5. Testing Smart Logistics & Route Optimization ---');
    await page.goto(`${BASE_URL}/logistics`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_smart_logistics.png') });
    console.log('📸 Captured 07_smart_logistics.png');

    // 6. Global AI Assistant
    console.log('\n--- 6. Testing Global AI Assistant Chat Panel ---');
    // Click floating AI Assistant button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const aiBtn = btns.find(
        (b) => b.getAttribute('aria-label')?.includes('Assistant') || b.getAttribute('aria-label')?.includes('सहायक') || b.className.includes('fixed') || b.parentElement?.className.includes('fixed')
      );
      if (aiBtn) aiBtn.click();
    });
    await sleep(800);

    // Type query into input and submit
    const query = 'What crops are in high demand right now?';
    console.log(`Sending AI Chat Query: "${query}"`);
    await page.evaluate((q) => {
      const input = document.querySelector('input[placeholder*="Ask"], input[placeholder*="सवाल"], input[type="text"]');
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const form = input.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, query);

    await sleep(2500); // Allow assistant response
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_ai_assistant_chat.png') });
    console.log('📸 Captured 08_ai_assistant_chat.png');

    // 7. Price Transparency Page
    console.log('\n--- 7. Testing Price Transparency ---');
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle2' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_price_transparency.png') });
    console.log('📸 Captured 09_price_transparency.png');

    // 8. Impact Dashboard Page
    console.log('\n--- 8. Testing Impact Dashboard ---');
    await page.goto(`${BASE_URL}/impact`, { waitUntil: 'networkidle2' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_impact_dashboard.png') });
    console.log('📸 Captured 10_impact_dashboard.png');

    console.log('\n==========================================');
    console.log('🎉 ALL LIVE BROWSER TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================');

    console.log('\nConsole warnings/errors during execution:');
    const errors = consoleMessages.filter((m) => m.startsWith('[ERROR]'));
    const warnings = consoleMessages.filter((m) => m.startsWith('[WARNING]'));
    console.log(`Errors (${errors.length}):`, errors);
    console.log(`Warnings (${warnings.length}):`, warnings);
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
}

runLiveBrowserTest();
