const resultsDB = require('../../models/resultados');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const nextClick = async (page) => {
    await sleep(3000)
    const buttonNext = await page.locator('[data-testid="next-button"]').waitHandle();
    await buttonNext.click()
}

const tableNextButton = async (page) => {
    await sleep(3000)
    const buttonNext = await page.locator('[id="table-next-button"]').waitHandle();
    await buttonNext.click()
}

const clickInput = async (page, selector) =>{
    try {
        await sleep(1000)
        const inputHandle = await page.locator(selector).waitHandle();
        await page.waitForSelector(selector);
        await sleep(1000)
        await inputHandle.click();
    }catch(e){
        console.log(e)
    }
}


const fillInput = async (page, selector, value) => {
    try {
        await page.click(selector);
        await sleep(1000)
        await page.focus(selector);
        await sleep(1000)
        await page.evaluate((selector) => (document.querySelector(selector).value = ''), selector); 
        await sleep(1000)
        await page.type(selector, value);
    }catch(e){
        console.log(e)
    }
};

const selectDropdownOption = async (page, listboxSelector, optionText, inputSelector) => {
    try {

        await page.waitForSelector(listboxSelector);
    
        const normalizedText = optionText.charAt(0).toUpperCase() + optionText.slice(1).replace(/ /g, '');
    
        await page.evaluate((listboxSelector, normalizedText) => {
            const options = Array.from(document.querySelectorAll(`${listboxSelector} li[role="option"]`));
            const option = options.find(opt => opt.textContent.trim() === normalizedText);
            if (option) option.click();
        }, listboxSelector, normalizedText);
    
        if (inputSelector) {
            return await page.evaluate((inputSelector) => {
                const input = document.querySelector(inputSelector);
                return input ? input.value : undefined;
            }, inputSelector);
        }
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
    {Marron:'Brown'},
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
        
        await nextClick(page);
        await nextClick(page);

        await clickInput(page, 'input[name="gettingStarted.typeOfApplication.tps"]')
        await clickInput(page, 'input[name="gettingStarted.typeOfApplication.requestForEA"]')

        await clickInput(page, 'input[name="gettingStarted.typeOfApplication.nameOfTPSCountry"]')
        
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

        await clickInput(page, 'input[name="formikFactoryUIMeta.gettingStarted.preparerAndInterpreterInformation.hasHelper"][value="false"]')

        await nextClick(page);
        
        const firstName = inputs.find(input => input.Nombre === 'Primer Nombre').Valor;
        const secondName = inputs.find(input => input.Nombre === 'Segundo Nombre ').Valor;
        const lastNames = inputs.find(input => input.Nombre === 'Apellidos').Valor;
        
        await fillInput(page,'input[name="applicant.yourName.name.firstName"]', firstName);
        await fillInput(page,'input[name="applicant.yourName.name.middleName"]', secondName);
        await fillInput(page,'input[name="applicant.yourName.name.lastName"]', lastNames);

        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.yourName.additionalNames.hasAdditionalNames"][value="false"]')
        
        await nextClick(page);
        
        const phoneNumber = inputs.find(input => input.Nombre === 'Número de contacto').Valor;
        await fillInput(page,'input[name="applicant.yourContactInformation.contactInformation.daytimePhone"]', phoneNumber);

        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.yourContactInformation.contactInformation.sameAsDaytimePhone"]')
        
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
        
        await clickInput(page, 'input[name="applicant.yourContactInformation.mailingAddress.state"]')

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

        await clickInput(page, 'input[name="applicant.yourContactInformation.isMailingEqualToPhysical"]')

        await nextClick(page);
        
        const dateOfBirth = inputs.find(input => input.TituloPagina.includes('fecha de nacimiento')).Valor;
        const yearOfBirth = dateOfBirth.split('-')[0];
        const monthOfBirth = dateOfBirth.split('-')[1];
        const dayOfBirth = dateOfBirth.split('-')[2];
        
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.dob"]', `${monthOfBirth}/${dayOfBirth}/${yearOfBirth}`);
        
        const cityOfBirth = inputs.find(input => input.Nombre === 'En que ciudad naciste ?').Valor;
        
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.birthAddress.city"]', cityOfBirth);
        
        await clickInput(page, 'input[name="applicant.whenAndWhereYouWereBorn.birthAddress.country"]')

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
            await clickInput(page, 'input[name="applicant.describeYourself.gender"][value="3"][type="radio"]')
        }else{
            await clickInput(page, 'input[name="applicant.describeYourself.gender"][value="1"][type="radio"]')
        }
        
        await clickInput(page, 'input[name="applicant.describeYourself.ethnicity"][value="1"][type="radio"]')
        
        await clickInput(page, 'input[name="5"]')
        
        const height = inputs.find(input => input.Nombre === 'Estatura').Valor;
        const feet = height.length == 3 && height.includes(',') ? height.split(",")[0] : height.charAt(0);
        const inches = height.length == 3 && height.includes(',') ? height.split(",")[1] : 0

        await clickInput(page, 'input[name="applicant.describeYourself.height.feet"]')
        
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

        await clickInput(page, 'input[name="applicant.describeYourself.height.inches"]')

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
        
        await clickInput(page, 'input[name="applicant.describeYourself.eyeColor"]')

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

        await clickInput(page, 'input[name="applicant.describeYourself.hairColor"]')

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
            
            await clickInput(page, 'input[name="applicant.whereHaveYouLived.countryOfResidence.0"]')

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

        await clickInput(page, 'input[name="applicant.yourImmigrationInformation.yourImmigrationInformation1.countriesOfCitizenship.0"]')

            await page.waitForSelector('ul[role="listbox"]'); 
            
            await page.evaluate((countryOfBirth) => {
                const options = Array.from(document.querySelectorAll('li[role="option"]'));
                const option = options.find(opt => opt.textContent.trim() === countryOfBirth);
                if (option) option.click();
            }, countryOfBirth);
            
            await page.evaluate(() => {
                const input = document.querySelector('input[name="applicant.yourImmigrationInformation.yourImmigrationInformation1.countriesOfCitizenship.0"]');
                return input.value;
            });


        await nextClick(page);
        
        await nextClick(page);

        const immigrationStatusResponse = 'TPS - Temporary Protected Status';

        await clickInput(page, 'input[name="applicant.immigrationStatus.currentImmigrationStatus"]')

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

        await clickInput(page, 'input[name="applicant.immigrationStatus.inImmigrationProceeding"][value="false"][type="radio"]')
        
        await nextClick(page);
        
        let alienNumber = inputs.find(input => input.TituloPagina === '¿Cual es tu numero de alien?') ? inputs.find(input => input.TituloPagina === '¿Cual es tu numero de alien?').Valor : "";
        alienNumber = alienNumber.replace(/[\s\-Aa_]/g, '');
        
        if(alienNumber === ""){
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.alienNumber.none"]')
        }else{
            await fillInput(page,'input[name="applicant.otherImmigrationInfo.alienNumber.number"]', alienNumber);
        }

        let socialNumber = inputs.find(input => input.TituloPagina === '¿Cual es tu numero de seguro social?') ? inputs.find(input => input.TituloPagina === '¿Cual es tu numero de seguro social?').Valor : "";
        socialNumber = socialNumber.replace(/[\s\-_]/g, '');
        if(socialNumber === ""){
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.socialSecurityNumber.none"]')
        }else{
            await fillInput(page,'input[name="applicant.otherImmigrationInfo.socialSecurityNumber.number"]', socialNumber);
        }

        await page.waitForSelector('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.uscisNumber.none"]');
        await page.click('input[name="formikFactoryUIMeta.applicant.otherImmigrationInfo.uscisNumber.none"]');
        
        await nextClick(page);

        const maritalStatus = inputs.find(input => input.TituloPagina === '¿Cual es tu estatus marital?').Nombre;
        if(maritalStatus.includes('Casado')){
            await clickInput(page, 'input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="2"][type="radio"]')
        }
        if(maritalStatus.includes('Divorciado')){
            await clickInput(page, 'input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="3"][type="radio"]')
        }
        if(maritalStatus.includes('Soltero')){
            await clickInput(page, 'input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="1"][type="radio"]')
        }
        if(maritalStatus.includes('Viudo')){
            await clickInput(page, 'input[name="yourFamily.maritalStatus.maritalStatus.marriageStatus"][value="4"][type="radio"]')
        }
        
        await nextClick(page);
        await nextClick(page);

        await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.accompanyingAnotherIndividualInadmissible.question"][value="false"][type="radio"]')
        
        await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.haveACommunicableDisease.question"][value="false"][type="radio"]')
        
        await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility1.mentalDisorder.question"][value="false"][type="radio"]')
        
        await nextClick(page);
        
        await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.country"]')
            
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
            await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="true"][type="radio"]')

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
            
            await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility3.otherCountriesTraveledTo.0.offeredImmigrationStatusByAnotherCountry.offeredStatus"][value="false"][type="radio"]')
            
            await clickInput(page, '[id="table-submit-button"]')
            
        }else{
            await clickInput(page, 'input[name="eligibilityStandards.immigrationEligibility.immigrationEligibility2.enteredAnotherCountry"][value="false"][type="radio"]')
        }

        
        await nextClick(page);

        await clickInput(page,'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.unlawfullyVotedInUS.question"][value="false"]');
        
        const selectorsPage1 = [
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.everDeported.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.everDepartedUnderOrderOfRemoval.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.failedToAttendAnyImmigrationProceeding.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.immigrationJudgeDeterminedYouFiledFrivolousAsylumClaim.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.fraudulentlyTriedToObtainVisa.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations1.assistedIllegalEntryIntoUS.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage1) {
            await clickInput(page, selector);
        }

        await nextClick(page);
    
        const selectorsPage2 = [
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.stowawayIntoUS.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.usedFalseDocuments.question"][value="false"]',
            'input[name="eligibilityStandards.citizenshipClaimsAndImmigrationViolations.citizenshipClaimsAndImmigrationViolations2.subjectToFinalOrderForViolationSection274C.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage2) {
            await clickInput(page, selector);
        }
        
        await nextClick(page);
    
        const selectorsPage3 = [
            'input[name="eligibilityStandards.affiliations.affiliations1.memberCommunistOrTotalitarianParty.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.memberNaziParty.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.incitedAssistedPersecution.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.actsInvolvingTortureOrGenocide.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.killingAnyPerson.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.intentionallyInjuredPerson.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.engagedInTerroristActivity.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.forcedSexualContact.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations1.limitingReligiousBelief.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage3) {
            await clickInput(page, selector);
        }

        await nextClick(page);

        const selectorsPage4 = [
            'input[name="eligibilityStandards.affiliations.affiliations2.memberParamilitaryUnit.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.memberPrisonCamp.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.useWeapons.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.soldWeapons.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.receivedParamilitaryTraining.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.recruitedMinorToServeInMilitary.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.usedMinorInHostilities.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations2.violatedReligiousFreedom.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage4) {
            await clickInput(page, selector);
        }
        
        await nextClick(page);
    
        const selectorsPage5 = [
            'input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildTraffickedInControlledSubstance.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildWhoAssistedInTrafficking.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildOfHumanTrafficker.question"][value="false"]',
            'input[name="eligibilityStandards.affiliations.affiliations3.spouseOrChildOfColluderWithHumanTrafficker.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage5) {
            await clickInput(page, selector);
        }
    
        await nextClick(page);
    
        const selectorsPage6 = [
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.felonyConvictedInUS.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.misdemeanorInUS.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.seriousCrimeCommitted.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.crimeOtherThanPurelyPolitical.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.violationControlledSubstance.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.conspiracyControlledSubstance.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses1.twoOrMoreCriminalOffenses.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage6) {
            await clickInput(page, selector);
        }
    
        await nextClick(page);
    
        const selectorsPage7 = [
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.arrestedForBreakingLaw.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.citedForBreakingLaw.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.convictedOfBreakingLaw.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.receivedPardon.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.assertedImmunityInUS.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses2.nonPoliticalCrimes.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage7) {
            await clickInput(page, selector);
        }
    
        await nextClick(page);
    
        const selectorsPage8 = [
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.violateLawOfEspionageSabotage.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.evadeLawProhibitExportFromUSGoods.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.anyOtherUnlawfulActivityInUS.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.overthrowUSGovernmentByForce.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.seriousAdverseForeignPolicyForUS.question"][value="false"]',
            'input[name="eligibilityStandards.crimesAndOffenses.crimesAndOffenses3.dangerToUS.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage8) {
            await clickInput(page, selector);
        }
    
        await nextClick(page);
    
        const selectorsPage9 = [
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.traffickedInControlledSubstance.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.assistedAbettedConspiredInTrafficking.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.previousFiveYearFinancialBenefitFromUnlawfulActivity.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.engagedInProstitution.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.procuredProstitute.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.receivedProceedsFromProstitution.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.involvedInCommercialVice.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter1.drugAbuser.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage9) {
            await clickInput(page, selector);
        }
        
        await nextClick(page);
    
        const selectorsPage10 = [
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.practicePolygamy.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.withheldCustodyOfChildHavingLawfulClaimToUS.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.contributedToHumanTrafficking.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.colludedInHumanTrafficking.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.benefitedFromHumanTrafficking.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.moneyLaunderer.question"][value="false"]',
            'input[name="eligibilityStandards.moralCharacter.moralCharacter2.colludedInMoneyLaundering.question"][value="false"]',
        ];
        
        for (const selector of selectorsPage10) {
            await clickInput(page, selector);
        }
        
        await nextClick(page);
    
    }catch(e){
        console.log(e);
    }
}

module.exports = {
    startTPS,
    sleep,
    nextClick,
    clickInput,
    fillInput,
    tableNextButton
};