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

//complete the colors 

const colorEyesAll = [
    {Negros:'Black'},
    {Azules:'Blue'},
    {Marrones:'Brown'},
    {Grises:'Gray'},
    {Verdes:'Green'},
]

const colorHairAll = [
    {Calvo:'Bald (no hair)'},
    {Negro:'Black'},
    {Rubio:'Blonde'},
    {Marron:'Brow'},
    {Gris:'Gray'},
    {Rojo:'Red'},
    {Arenoso:'Sandy'},
    {Blanco:'White'},
]

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
        
        const dateOfBirth = inputs.find(input => input.TituloPagina.includes('fecha de nacimiento')).Valor;
        const yearOfBirth = dateOfBirth.split('-')[0];
        const monthOfBirth = dateOfBirth.split('-')[1];
        const dayOfBirth = dateOfBirth.split('-')[2];
        
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.dob"]', `${monthOfBirth}/${dayOfBirth}/${yearOfBirth}`);
        
        const cityOfBirth = inputs.find(input => input.Nombre === 'En que ciudad naciste ?').Valor;
        
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.birthAddress.city"]', cityOfBirth);
        
        await page.waitForSelector('input[name="applicant.whenAndWhereYouWereBorn.birthAddress.country"]');
        await page.click('input[name="applicant.whenAndWhereYouWereBorn.birthAddress.country"]');
        
        await page.waitForSelector('ul[role="listbox"]'); 
        
        let countryOfBirth = inputs.find(input => input.Nombre === '¿En que pais naciste').Valor;
        countryOfBirth = countryOfBirth.charAt(0).toUpperCase() + optionText.slice(1);
        countryOfBirth = countryOfBirth.replace(/ /g, '');//remove spaces
        await page.evaluate((countryOfBirth) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            console.log({options})
            const option = options.find(opt => opt.textContent.trim() === countryOfBirth);
            if (option) option.click();
        }, countryOfBirth);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.whenAndWhereYouWereBorn.birthAddress.country"]');
            return input.value;
        });
        
        await nextClick(page);
        
        const gender = inputs.find(input => input.Nombre === 'Sexo').Valor;
        if(gender.toLowerCase().includes('masculino')){
            await page.waitForSelector('input[name="applicant.describeYourself.gender"][value="3"][type="radio"]');
            await page.click('input[name="applicant.describeYourself.gender"][value="3"][type="radio"]');
        }else{
            await page.waitForSelector('input[name="applicant.describeYourself.gender"][value="1"][type="radio"]');
            await page.click('input[name="applicant.describeYourself.gender"][value="1"][type="radio"]');
        }
        
        await page.waitForSelector('input[name="applicant.describeYourself.ethnicity"][value="1"][type="radio"]');
        await page.click('input[name="applicant.describeYourself.ethnicity"][value="1"][type="radio"]');
        
        await page.waitForSelector('input[name="5"]');
        await page.click('input[name="5"]');
        
        const height = inputs.find(input => input.Nombre === 'Estatura').Valor;
        const feet = height.length == 3 && height.includes(',') ? height.split(",")[0] : height.charAt(0);
        const inches = height.length == 3 && height.includes(',') ? height.split(",")[1] : 0
        
        await page.waitForSelector('input[name="applicant.describeYourself.height.feet"]');
        await page.click('input[name="applicant.describeYourself.height.feet"]');
        
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((feet) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === feet);
            if (option) option.click();
        }, feet);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.describeYourself.height.feet"]');
            return input.value;
        });
        
        await page.waitForSelector('input[name="applicant.describeYourself.height.inches"]');
        await page.click('input[name="applicant.describeYourself.height.inches"]');
        
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((inches) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === inches);
            if (option) option.click();
        }, inches);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.describeYourself.height.inches"]');
            return input.value;
        });
        
        let pounds = inputs.find(input => input.Nombre === 'Peso').Valor;
        pounds = pounds.match(/\d+/g);
        
        await fillInput(page,'input[name="applicant.describeYourself.weight"]', pounds);
        let colorEyes = inputs.find(input => input.TituloPagina === '¿Cual es el color de tus ojos?').Nombre;
        colorEyes = colorEyes.trim()
        finalColorEyes = colorEyesAll.find(color => color[colorEyes]) ? colorEyesAll.find(color => color[colorEyes])[colorEyes] : 'Unknown/Other';
        
        await page.waitForSelector('input[name="applicant.describeYourself.eyeColor"]');
        await page.click('input[name="applicant.describeYourself.eyeColor"]');
        
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((finalColorEyes) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === finalColorEyes);
            if (option) option.click();
        }, finalColorEyes);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.describeYourself.eyeColor"]');
            return input.value;
        });

        let colorHair = inputs.find(input => input.TituloPagina === '¿Cual es el color de tus ojos?').Nombre;
        colorHair = colorHair.trim()
        finalColorHair = colorHairAll.find(color => color[colorHair]) ? colorHairAll.find(color => color[colorHair])[colorHair] : 'Unknown/Other';

        await page.waitForSelector('input[name="applicant.describeYourself.hairColor"]');
        await page.click('input[name="applicant.describeYourself.hairColor"]');
        
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((finalColorEyes) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === finalColorEyes);
            if (option) option.click();
        }, finalColorEyes);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.describeYourself.hairColor"]');
            return input.value;
        });

        await nextClick(page);

        const livedAnotherCountry = inputs.find(input => input.TituloPagina === 'Viviste en un tercer país antes de entrar a los Estados Unidos? ').Nombre;
        if(livedAnotherCountry.includes('SI')){
            const otherCountry = inputs.find(input => input.TituloPagina === '¿Que Pais?').Valor.trim();
            
            await page.waitForSelector('input[name="applicant.whereHaveYouLived.countryOfResidence.0"]');
            await page.click('input[name="applicant.whereHaveYouLived.countryOfResidence.0"]');
            
            await page.waitForSelector('ul[role="listbox"]'); 
            
            await page.evaluate((otherCountry) => {
                const options = Array.from(document.querySelectorAll('li[role="option"]'));
                const option = options.find(opt => opt.textContent.trim() === otherCountry);
                if (option) option.click();
            }, otherCountry);
            
            await page.evaluate(() => {
                const input = document.querySelector('input[name="applicant.whereHaveYouLived.countryOfResidence.0"]');
                return input.value;
            });
        }

        await nextClick(page);
        

    }catch(e){
        console.log(e);
    }
}

module.exports = startTPS;