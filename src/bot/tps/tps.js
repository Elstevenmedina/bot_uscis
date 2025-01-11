const resultsDB = require('../../models/resultados');

const nextClick = async (page) => {
    await page.waitForSelector('[data-testid="next-button"]');
    await page.click('[data-testid="next-button"]');
}

const fillInput = async (page, selector, value) => {
    try {
        await page.click(selector);
        await page.focus(selector);
        await page.evaluate((selector) => (document.querySelector(selector).value = ''), selector); 
        await page.type(selector, value);
    }catch(e){
        console.log(e)
    }
};

const startTPS = async (page) => {
    try {
        await page.goto('https://my.uscis.gov/forms/application-for-temporary-protected-status/start/overview');
        
        const result = await resultsDB.findOne({Titulo: 'TPS'});
        const inputs = result.Inputs.sort((a, b) => a.Pagina - b.Pagina);
        
        //esperar tres segundos
        await nextClick(page);
        await nextClick(page);
        
        await page.waitForSelector('input[name="gettingStarted.typeOfApplication.tps"]');
        await page.click('input[name="gettingStarted.typeOfApplication.tps"]');
        await page.waitForSelector('input[name="gettingStarted.typeOfApplication.requestForEA"]');
        await page.click('input[name="gettingStarted.typeOfApplication.requestForEA"]');
        
        await page.waitForSelector('input[name="gettingStarted.typeOfApplication.nameOfTPSCountry"]');
        await page.click('input[name="gettingStarted.typeOfApplication.nameOfTPSCountry"]');

        await page.waitForSelector('ul[role="listbox"]'); 

        let optionText = inputs.find(input => input.Nombre === '¿En que pais naciste').Valor;
        optionText = optionText.charAt(0).toUpperCase() + optionText.slice(1);
        optionText = optionText.replace(/ /g, '');//remove spaces
        const optionSelector = `li[role="option"]:contains("${optionText}")`; 
        await page.evaluate((optionText) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            console.log({options})
            const option = options.find(opt => opt.textContent.trim() === optionText);
            if (option) option.click();
        }, optionText);

        await page.evaluate(() => {
            const input = document.querySelector('input[name="gettingStarted.typeOfApplication.nameOfTPSCountry"]');
            return input.value;
        });
        
        await nextClick(page);
        await page.waitForSelector('input[name="formikFactoryUIMeta.gettingStarted.preparerAndInterpreterInformation.hasHelper"]');
        await page.click('input[name="formikFactoryUIMeta.gettingStarted.preparerAndInterpreterInformation.hasHelper"]');
        await nextClick(page);
        
        const firstName = inputs.find(input => input.Nombre === 'Primer Nombre').Valor;
        const secondName = inputs.find(input => input.Nombre === 'Segundo Nombre ').Valor;
        const lastNames = inputs.find(input => input.Nombre === 'Apellidos').Valor;
        
        await fillInput(page,'input[name="applicant.yourName.name.firstName"]', firstName);
        await fillInput(page,'input[name="applicant.yourName.name.middleName"]', secondName);
        await fillInput(page,'input[name="applicant.yourName.name.lastName"]', lastNames);
        
        await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.yourName.additionalNames.hasAdditionalNames"]');
        await page.click('input[name="formikFactoryUIMeta.applicant.yourName.additionalNames.hasAdditionalNames"]');
        
        await nextClick(page);
        
        const phoneNumber = inputs.find(input => input.Nombre === 'Número de contacto').Valor;
        await fillInput(page,'input[name="applicant.yourContactInformation.contactInformation.daytimePhone"]', phoneNumber);
        
        await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.yourContactInformation.contactInformation.sameAsDaytimePhone"]');
        await page.click('input[name="formikFactoryUIMeta.applicant.yourContactInformation.contactInformation.sameAsDaytimePhone"]');
        
        const emailAddress = inputs.find(input => input.Nombre === 'Correo electrónico').Valor;
        await fillInput(page,'input[name="applicant.yourContactInformation.contactInformation.emailAddress"]', emailAddress);
        await fillInput(page,'input[name="applicant.yourContactInformation.mailingAddress.inCareOfName"]', `${firstName} ${secondName} ${lastNames}`);
        
        const street = inputs.find(input => input.Nombre === 'Dirección de la calle').Valor;
        const city = inputs.find(input => input.Nombre === 'Ciudad ').Valor;
        const apt = inputs.find(input => input.Nombre === 'Numero de apartamento, suite, unidad  ').Valor;
        let state = inputs.find(input => input.Nombre === 'Estado / Provincia').Valor;
        const zipCode = inputs.find(input => input.Nombre === 'Código Postal').Valor;
        
        await fillInput(page,'input[name="applicant.yourContactInformation.mailingAddress.addressLineOne"]', `${street}`);
        await fillInput(page,'input[name="applicant.yourContactInformation.mailingAddress.addressLineTwo"]', `${apt}`);
        await fillInput(page,'input[name="applicant.yourContactInformation.mailingAddress.city"]', city);
        await fillInput(page,'input[name="applicant.yourContactInformation.mailingAddress.zipCode"]', zipCode);
        
        await page.waitForSelector('input[name="applicant.yourContactInformation.mailingAddress.state"]');
        await page.click('input[name="applicant.yourContactInformation.mailingAddress.state"]');

        await page.waitForSelector('ul[role="listbox"]');

        state = state.charAt(0).toUpperCase() + state.slice(1);
        state = state.replace(/ /g, '');//remove spaces
        console.log({state})
        const optionSelectorState = `li[role="option"]:contains("${state}")`; 
        await page.evaluate((state) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            console.log({options})
            const option = options.find(opt => opt.textContent.trim() === state);
            if (option) option.click();
        }, state);

        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.yourContactInformation.mailingAddress.state"]');
            return input.value;
        });

        await page.waitForSelector('input[name="applicant.yourContactInformation.isMailingEqualToPhysical"]');
        await page.click('input[name="applicant.yourContactInformation.isMailingEqualToPhysical"]');

        await nextClick(page);

    }catch(e){
        console.log(e);
    }
}

module.exports = startTPS;