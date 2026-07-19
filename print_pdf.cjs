const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const fileUrl = 'file:///' + path.resolve(__dirname, 'Blueprint_Ecocademy.html').replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    
    await page.waitForSelector('.mermaid svg', { timeout: 10000 }).catch(() => console.log('Mermaid SVG timeout.'));
    await new Promise(r => setTimeout(r, 2000));
    
    await page.pdf({
      path: path.resolve(__dirname, 'Blueprint_Ecocademy.pdf'),
      format: 'A4',
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' },
      printBackground: true
    });
    
    await browser.close();
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();
