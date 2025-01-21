const puppeteer = require('puppeteer');

const StartLogin = async (formToStart, resultId) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto('https://myaccount.uscis.gov/sign-in', { waitUntil: 'networkidle2' });

    const fillInput = async (selector, value) => {
        await page.click(selector);
        await page.focus(selector);
        await page.evaluate((selector) => (document.querySelector(selector).value = ''), selector);
        await page.type(selector, value);
    };

    // Solicitar correo y contraseña
    await page.evaluate(() => {
        // Crear un overlay para el modal
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

        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'modalLogin';
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
            <p>Introduce tus credenciales para iniciar sesión:</p>
            <input type="text" id="emailInput" placeholder="Correo electrónico" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <input type="password" id="passwordInput" placeholder="Contraseña" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <button id="sendCredentials" style="padding: 5px 10px;">Aceptar</button>
        `;
        document.body.appendChild(modal);

        // Escuchar el botón para capturar los valores
        document.querySelector('#sendCredentials').addEventListener('click', () => {
            const email = document.querySelector('#emailInput').value.trim();
            const password = document.querySelector('#passwordInput').value.trim();
            if (email && password) {
                document.body.setAttribute('data-email', email);
                document.body.setAttribute('data-password', password);
                modal.remove();
                overlay.remove();
            } else {
                alert('Por favor, completa ambos campos.');
            }
        });
    });

    // Recuperar correo y contraseña del modal
    const { email, password } = await page.evaluate(() => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const email = document.body.getAttribute('data-email');
                const password = document.body.getAttribute('data-password');
                if (email && password) {
                    clearInterval(interval);
                    resolve({ email, password });
                }
            }, 500);
        });
    });

    // Usar correo y contraseña para llenar los campos del formulario
    await fillInput('#email-address', email);
    await fillInput('#password', password);

    await page.click('#sign-in-btn');

    // Modal para solicitar el código de verificación
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

    formToStart(page, resultId);
};

module.exports = StartLogin;
