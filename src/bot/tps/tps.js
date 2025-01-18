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

const startTPS = async (page, resultId) => {
    try {
        await page.goto('https://my.uscis.gov/forms/application-for-temporary-protected-status/start/overview');
        
        const result = await resultsDB.findById(resultId);
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
        await page.evaluate((optionText) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
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
        await nextClick(page);

        const immigrationStatusResponse = 'TPS - Temporary Protected Status';

        await page.waitForSelector('input[name="applicant.immigrationStatus.currentImmigrationStatus"]');
        await page.click('input[name="applicant.immigrationStatus.currentImmigrationStatus"]');
            
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((immigrationStatusResponse) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === immigrationStatusResponse);
            if (option) option.click();
        }, immigrationStatusResponse);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="applicant.immigrationStatus.currentImmigrationStatus"]');
            return input.value;
        });


        await page.waitForSelector('input[name="applicant.immigrationStatus.inImmigrationProceeding"][value="false"][type="radio"]');
        await page.click('input[name="applicant.immigrationStatus.inImmigrationProceeding"][value="false"][type="radio"]');
        
        await nextClick(page);

        let alienNumber = inputs.find(input => input.TituloPagina === '¿Cual es tu numero de alien?').Valor;
        alienNumber = alienNumber.replace(/[\s\-Aa_]/g, '');

        if(alienNumber === ""){
            await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.alienNumber.none"]');
            await page.click('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.alienNumber.none"]');
        }else{
            await fillInput(page,'input[name="applicant.otherImmigrationInfo.alienNumber.number"]', alienNumber);
        }

        let socialNumber = inputs.find(input => input.TituloPagina === '¿Cual es tu numero de seguro social?').Valor;
        socialNumber = socialNumber.replace(/[\s\-_]/g, '');
        if(socialNumber === ""){
            await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.socialSecurityNumber.none"]');
            await page.click('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.socialSecurityNumber.none"]');
        }else{
            await fillInput(page,'input[name="applicant.otherImmigrationInfo.socialSecurityNumber.number"]', socialNumber);
        }

        await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.uscisNumber.none"]');
        await page.click('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.uscisNumber.none"]');
        
        await nextClick(page);

        const maritalStatus = inputs.find(input => input.TituloPagina === '¿Cual es tu estatus marital?').Nombre;
        if(maritalStatus.includes('Casado')){
            await page.waitForSelector('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="2"][type="radio"]');
            await page.click('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="2"][type="radio"]');
        }
        if(maritalStatus.includes('Divorciado')){
            await page.waitForSelector('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="3"][type="radio"]');
            await page.click('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="3"][type="radio"]');
        }
        if(maritalStatus.includes('Soltero')){
            await page.waitForSelector('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="1"][type="radio"]');
            await page.click('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="1"][type="radio"]');
        }
        if(maritalStatus.includes('Viudo')){
            await page.waitForSelector('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="4"][type="radio"]');
            await page.click('input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="4"][type="radio"]');
        }
        
        await nextClick(page);
        await nextClick(page);
        
        await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.accompanyingAnotherIndividualInadmissible.question"][value="false"][type="radio"]');
        await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.accompanyingAnotherIndividualInadmissible.question"][value="false"][type="radio"]');
        
        await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.haveACommunicableDisease.question"][value="false"][type="radio"]');
        await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.haveACommunicableDisease.question"][value="false"][type="radio"]');
        
        await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.mentalDisorder.question"][value="false"][type="radio"]');
        await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.mentalDisorder.question"][value="false"][type="radio"]');

        await nextClick(page);

        await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.country"]');
        await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.country"]');
            
        await page.waitForSelector('ul[role="listbox"]'); 
        
        await page.evaluate((countryOfBirth) => {
            const options = Array.from(document.querySelectorAll('li[role="option"]'));
            const option = options.find(opt => opt.textContent.trim() === countryOfBirth);
            if (option) option.click();
        }, countryOfBirth);
        
        await page.evaluate(() => {
            const input = document.querySelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.country"]');
            return input.value;
        });

        if(livedAnotherCountry.includes('SI')){
            await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="true"][type="radio"]');
            await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="true"][type="radio"]');
        
            await nextClick(page);

            let dateFrom = inputs.find(input => input.TituloPagina === '¿Cuánto tiempo viviste en ese país?' && input.Nombre === "Desde").Valor;
            let dateTo = inputs.find(input => input.TituloPagina === '¿Cuánto tiempo viviste en ese país?' && input.Nombre === "Hasta").Valor;
            dateFrom = dateFrom.split('-');
            dateFrom = `${dateFrom[1]}/${dateFrom[2]}/${dateFrom[0]}`;
            dateTo = dateTo.split('-');
            dateTo = `${dateTo[1]}/${dateTo[2]}/${dateTo[0]}`;

            await fillInput(page,'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.dateEnteredOtherCountry.fromDate"]', dateFrom);
            await fillInput(page,'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.dateEnteredOtherCountry.toDate"]', dateTo);

            const statusImmigrationCountryLived = inputs.find(input => input.TituloPagina === '¿Cual era tu estatus migratorio en ese país?').Valor;

            let responseStatusAnotherCountry = '';

            if(statusImmigrationCountryLived.includes('Sin status')){
                responseStatusAnotherCountry = 'No status';
            }
            if(statusImmigrationCountryLived.includes('Residente temporal')){
                responseStatusAnotherCountry = 'Temporary Resident';
            }
            if(statusImmigrationCountryLived.includes('Residencia Permanente')){
                responseStatusAnotherCountry = 'Legal Permanent Resident';
            }
            if(statusImmigrationCountryLived.includes('Estudiante')){
                responseStatusAnotherCountry = 'Student';
            }
            if(statusImmigrationCountryLived.includes('Asilado')){
                responseStatusAnotherCountry = 'Asylee';
            }
            if(statusImmigrationCountryLived.includes('Esperando un asilo')){
                responseStatusAnotherCountry = 'Waiting for Asylee';
            }
            if(statusImmigrationCountryLived.includes('TPS vigente')){
                responseStatusAnotherCountry = 'TPS';
            }
            if(statusImmigrationCountryLived.includes('Turista')){
                responseStatusAnotherCountry = 'Tourist';
            }
            if(statusImmigrationCountryLived.includes('Algún tipo de Visa')){
                responseStatusAnotherCountry = 'Visa';
            }
            if(statusImmigrationCountryLived.includes('DNI')){
                responseStatusAnotherCountry = 'DNI';
            }
            
            await fillInput(page,'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.immigrationStatusInOtherCountry"]', responseStatusAnotherCountry);
            
            await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.offeredImmigrationStatusByAnotherCountry.offeredStatus"][value="false"][type="radio"]');
            await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.offeredImmigrationStatusByAnotherCountry.offeredStatus"][value="false"][type="radio"]');

            await page.waitForSelector('[id="table-submit-button"]');
            await page.click('[id="table-submit-button"]');

        }else{
            await page.waitForSelector('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="false"][type="radio"]');
            await page.click('input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="false"][type="radio"]');
        }

        
        await nextClick(page);

        const question1 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.unlawfullyVotedInUS.question"][value="false"]').waitHandle();
        await question1.click();

        const question2 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.everDeported.question"][value="false"]').waitHandle();
        await question2.click();

        const question3 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.everDepartedUnderOrderOfRemoval.question"][value="false"]').waitHandle();
        await question3.click();

        const question4 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.failedToAttendAnyImmigrationProceeding.question"][value="false"]').waitHandle();
        await question4.click();

        const question5 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.immigrationJudgeDeterminedYouFiledFrivolousAsylumClaim.question"][value="false"]').waitHandle();
        await question5.click();

        const question6 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.fraudulentlyTriedToObtainVisa.question"][value="false"]').waitHandle();
        await question6.click();

        const question7 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.assistedIllegalEntryIntoUS.question"][value="false"]').waitHandle();
        await question7.click();

        await nextClick(page);
    
        const question8 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.stowawayIntoUS.question"][value="false"]').waitHandle();
        await question8.click();
        
        const question9 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.usedFalseDocuments.question"][value="false"]').waitHandle();
        await question9.click();
        
        const question10 = await page.locator('input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.subjectToFinalOrderForViolationSection274C.question"][value="false"]').waitHandle();
        await question10.click();
    
    
        await nextClick(page);
    
        const question11 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.memberCommunistOrTotalitarianParty.question"][value="false"]').waitHandle();
        await question11.click();
        
        const question12 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.memberNaziParty.question"][value="false"]').waitHandle();
        await question12.click();
        
        const question13 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.incitedAssistedPersecution.question"][value="false"]').waitHandle();
        await question13.click();
        
        const question14 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.actsInvolvingTortureOrGenocide.question"][value="false"]').waitHandle();
        await question14.click();
        
        const question15 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.killingAnyPerson.question"][value="false"]').waitHandle();
        await question15.click();
        
        const question16 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.intentionallyInjuredPerson.question"][value="false"]').waitHandle();
        await question16.click();
        
        const question17 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.engagedInTerroristActivity.question"][value="false"]').waitHandle();
        await question17.click();
        
        const question18 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.forcedSexualContact.question"][value="false"]').waitHandle();
        await question18.click();
        
        const question19 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations1.limitingReligiousBelief.question"][value="false"]').waitHandle();
        await question19.click();

        await nextClick(page);

        const question20 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.memberParamilitaryUnit.question"][value="false"]').waitHandle();
        await question20.click();

        const question21 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.memberPrisonCamp.question"][value="false"]').waitHandle();
        await question21.click();

        const question22 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.useWeapons.question"][value="false"]').waitHandle();
        await question22.click();

        const question23 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.soldWeapons.question"][value="false"]').waitHandle();
        await question23.click();

        const question24 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.receivedParamilitaryTraining.question"][value="false"]').waitHandle();
        await question24.click();

        const question25 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.recruitedMinorToServeInMilitary.question"][value="false"]').waitHandle();
        await question25.click();

        const question26 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.usedMinorInHostilities.question"][value="false"]').waitHandle();
        await question26.click();

        const question27 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations2.violatedReligiousFreedom.question"][value="false"]').waitHandle();
        await question27.click();

        await nextClick(page);
    
        const question28 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildTraffickedInControlledSubstance.question"][value="false"]').waitHandle();
        await question28.click();
        
        const question29 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildWhoAssistedInTrafficking.question"][value="false"]').waitHandle();
        await question29.click();
        
        const question30 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildOfHumanTrafficker.question"][value="false"]').waitHandle();
        await question30.click();
        
        const question31 = await page.locator('input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildOfColluderWithHumanTrafficker.question"][value="false"]').waitHandle();
        await question31.click();
    
        await nextClick(page);
    
        const question32 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.felonyConvictedInUS.question"][value="false"]').waitHandle();
        await question32.click();
        
        const question33 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.misdemeanorInUS.question"][value="false"]').waitHandle();
        await question33.click();
        
        const question34 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.seriousCrimeCommitted.question"][value="false"]').waitHandle();
        await question34.click();
        
        const question35 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.crimeOtherThanPurelyPolitical.question"][value="false"]').waitHandle();
        await question35.click();
        
        const question36 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.violationControlledSubstance.question"][value="false"]').waitHandle();
        await question36.click();
        
        const question37 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.conspiracyControlledSubstance.question"][value="false"]').waitHandle();
        await question37.click();
        
        const question38 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.twoOrMoreCriminalOffenses.question"][value="false"]').waitHandle();
        await question38.click();
    
        await nextClick(page);
    
        const question39 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.arrestedForBreakingLaw.question"][value="false"]').waitHandle();
        await question39.click();

        const question40 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.citedForBreakingLaw.question"][value="false"]').waitHandle();
        await question40.click();

        const question41 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.convictedOfBreakingLaw.question"][value="false"]').waitHandle();
        await question41.click();

        const question42 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.receivedPardon.question"][value="false"]').waitHandle();
        await question42.click();

        const question43 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.assertedImmunityInUS.question"][value="false"]').waitHandle();
        await question43.click();

        const question44 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.nonPoliticalCrimes.question"][value="false"]').waitHandle();
        await question44.click();

    
        await nextClick(page);
    
        const question45 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.violateLawOfEspionageSabotage.question"][value="false"]').waitHandle();
        await question45.click();
        
        const question46 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.evadeLawProhibitExportFromUSGoods.question"][value="false"]').waitHandle();
        await question46.click();
        
        const question47 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.anyOtherUnlawfulActivityInUS.question"][value="false"]').waitHandle();
        await question47.click();
        
        const question48 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.overthrowUSGovernmentByForce.question"][value="false"]').waitHandle();
        await question48.click();
        
        const question49 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.seriousAdverseForeignPolicyForUS.question"][value="false"]').waitHandle();
        await question49.click();
        
        const question50 = await page.locator('input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.dangerToUS.question"][value="false"]').waitHandle();
        await question50.click();
        
    
        await nextClick(page);
    
        const question51 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.traffickedInControlledSubstance.question"][value="false"]').waitHandle();
        await question51.click();

        const question52 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.assistedAbettedConspiredInTrafficking.question"][value="false"]').waitHandle();
        await question52.click();

        const question53 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.previousFiveYearFinancialBenefitFromUnlawfulActivity.question"][value="false"]').waitHandle();
        await question53.click();

        const question54 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.engagedInProstitution.question"][value="false"]').waitHandle();
        await question54.click();

        const question55 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.procuredProstitute.question"][value="false"]').waitHandle();
        await question55.click();

        const question56 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.receivedProceedsFromProstitution.question"][value="false"]').waitHandle();
        await question56.click();

        const question57 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.involvedInCommercialVice.question"][value="false"]').waitHandle();
        await question57.click();

        const question58 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter1.drugAbuser.question"][value="false"]').waitHandle();
        await question58.click();

    
        await nextClick(page);
    
        const question59 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.practicePolygamy.question"][value="false"]').waitHandle();
        await question59.click();

        const question60 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.withheldCustodyOfChildHavingLawfulClaimToUS.question"][value="false"]').waitHandle();
        await question60.click();

        const question61 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.contributedToHumanTrafficking.question"][value="false"]').waitHandle();
        await question61.click();

        const question62 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.colludedInHumanTrafficking.question"][value="false"]').waitHandle();
        await question62.click();

        const question63 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.benefitedFromHumanTrafficking.question"][value="false"]').waitHandle();
        await question63.click();

        const question64 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.moneyLaunderer.question"][value="false"]').waitHandle();
        await question64.click();

        const question65 = await page.locator('input[name="eligibilityStandards.moralCharacter.moralCharacter2.colludedInMoneyLaundering.question"][value="false"]').waitHandle();
        await question65.click();
    
        await nextClick(page);
    
    }catch(e){
        console.log(e);
    }
}

module.exports = startTPS;