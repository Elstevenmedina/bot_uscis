const puppeteer = require('puppeteer');

const StartLogin = async (formToStart, resultId) => {
    const browser = await puppeteer.launch({
        headless: false,  
        args: ['--no-sandbox', '--disable-setuid-sandbox']  
    });
    const page = await browser.newPage();

    await page.goto('https://myaccount.uscis.gov/sign-in', { waitUntil: 'networkidle2' });

    const fillInput = async (selector, value) => {
        await page.click(selector);
        await page.focus(selector);
        await page.evaluate((selector) => (document.querySelector(selector).value = ''), selector); 
        await page.type(selector, value);
    };

    await fillInput('#email-address', 'raymond.steven.medina@gmail.com');
    await fillInput('#password', '2676018mP.');

    await page.click('#sign-in-btn');

    await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'overlayFondo';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '999',
        });
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'modalCode';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '20px',
            zIndex: '1000',
        });
        modal.innerHTML = `
            <p>Introduce el código que recibiste en tu correo electrónico:</p>
            <input type="text" id="userCode" placeholder="Código" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <button id="sendCode" style="padding: 5px 10px;">Aceptar</button>
        `;
        document.body.appendChild(modal);

        document.querySelector('#sendCode').addEventListener('click', () => {
            const code = document.querySelector('#userCode').value.trim();
            if (code) {
                document.body.setAttribute('data-code', code); 
                modal.remove(); 
                overlay.remove();
            } else {
                alert('Por favor, introduce un código válido.');
            }
        });
    });

    const codeUser = await page.evaluate(() => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const code = document.body.getAttribute('data-code');
                if (code) {
                    clearInterval(interval);
                    resolve(code);
                }
            }, 500); 
        });
    });

    await fillInput('#secure-verification-code', codeUser);

    await page.click('[aria-label="Submit"]');

    formToStart(page, resultId)

};


module.exports = StartLogin;
