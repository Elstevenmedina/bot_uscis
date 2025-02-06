const {clickInput, fillInput, nextClick, sleep, tableNextButton} = require('../tps/tps');
const resultsDB = require('../../models/resultados');


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const startAsylum = async (page, resultId) => {
    try {
        await page.goto('https://my.uscis.gov/forms/application-for-asylum-withholding-removal/start/overview')
        const result = await resultsDB.findById(resultId);
        let inputs = result.Inputs.filter(input => input !== null);
    
        await nextClick(page);
        await nextClick(page);
        
        await clickInput(page, 'input[name="preparer.legalAssistance.providedWithListOfCounsel"][value="false"]')
        
        await nextClick(page);
        
        await clickInput(page, 'input[name="preparer.familyMemberAsPreparer.familyMemberAsPreparer"][value="false"]')
        
        await nextClick(page);
        
        await clickInput(page, 'input[name="preparer.nonFamilyMemberAsPreparer.nonFamilyMemberAsPreparer"][value="false"]')
        
        await nextClick(page);
        
        const firstName = inputs.find(input => input.Nombre === 'Primer Nombre' && input.TituloPagina == "Primero lo primero, ¿cual es tu nombre?" && input.Pagina == 1).Valor;
        const lastNames = inputs.find(input => input.Nombre === 'Apellidos ' && input.TituloPagina == "Primero lo primero, ¿cual es tu nombre?" && input.Pagina == 1 ).Valor;
        
        await fillInput(page,'input[name="applicant.yourName.name.firstName"]', firstName);
        await fillInput(page,'input[name="applicant.yourName.name.lastName"]', lastNames);
        
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.yourName.additionalNames.hasAdditionalNames"][value="false"]')
        
        await nextClick(page);
    
        const zipCode = inputs.find(input => input.TituloPagina === '¿Cual es tu dirección en los Estados Unidos? ' && input.Nombre === 'Zip Code').Valor;
        let state = inputs.find(input => input.TituloPagina === '¿Cual es tu dirección en los Estados Unidos? ' && input.Nombre === 'Estado').Valor;
        const city = inputs.find(input => input.TituloPagina === '¿Cual es tu dirección en los Estados Unidos? ' && input.Nombre === 'Ciudad').Valor;
        const address = inputs.find(input => input.TituloPagina === '¿Cual es tu dirección en los Estados Unidos? ' && input.Nombre === 'Direccion').Valor;
        
        sleep(1000)
    
        await fillInput(page,'input[name="applicant.background.physicalAddress.usAddress.addressLineOne"]', address);
        await fillInput(page,'input[name="applicant.background.physicalAddress.usAddress.city"]', city);
        await fillInput(page,'input[name="applicant.background.physicalAddress.usAddress.zipCode"]', zipCode);
        
        state = state.charAt(0).toUpperCase() + state.slice(1);
        state = state.replace(/ /g, '');//remove spaces
        
        await clickInput(page, 'input[name="applicant.background.physicalAddress.usAddress.state"]');
    
        await page.type('input[name="applicant.background.physicalAddress.usAddress.state"]', state);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        const phoneNumber = inputs.find(input => input.TituloPagina === '¿Como nos podemos comunicar contigo?' && input.Nombre === 'Numero de telefono').Valor;
        
        await fillInput(page,'input[name="applicant.background.physicalAddress.phoneNumber"]', phoneNumber);
        
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.background.mailingAddress.mailingAddressSameAsPhysicalAddress"]')
        
        await fillInput(page,'input[name="applicant.background.mailingAddress.inCareOfName"]', `${firstName} ${lastNames}`);
        
        await fillInput(page,'input[name="applicant.background.mailingAddress.phoneNumber"]', phoneNumber);
        
        await nextClick(page);
    
        const dateOfBirth = inputs.find(input => input.TituloPagina.includes('¿Cual es tu fecha de Nacimiento?')).Valor;
        const yearOfBirth = dateOfBirth.split('-')[0];
        const monthOfBirth = dateOfBirth.split('-')[1];
        const dayOfBirth = dateOfBirth.split('-')[2];
    
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.dateOfBirth"]', `${monthOfBirth}/${dayOfBirth}/${yearOfBirth}`);
        
        const cityOfBirth = inputs.find(input => input.TituloPagina === 'Datos demográficos' && input.Nombre === 'Ciudad donde naciste').Valor;
        
        await fillInput(page,'input[name="applicant.whenAndWhereYouWereBorn.cityOfBirth"]', cityOfBirth);
    
        let countryOfBirth  = inputs.find(input => input.TituloPagina === 'Datos demográficos' && input.Nombre === 'País de Nacimiento').Valor;
    
        countryOfBirth = countryOfBirth.charAt(0).toUpperCase() + countryOfBirth.slice(1);
        countryOfBirth = countryOfBirth.replace(/ /g, '');//remove spaces
    
        await clickInput(page, 'input[name="applicant.whenAndWhereYouWereBorn.countryOfBirth"]');
    
        await page.type('input[name="applicant.whenAndWhereYouWereBorn.countryOfBirth"]', countryOfBirth);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await clickInput(page, 'input[name="applicant.whenAndWhereYouWereBorn.birthNationality"]');
    
        await page.type('input[name="applicant.whenAndWhereYouWereBorn.birthNationality"]', countryOfBirth);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await nextClick(page);
    
        const gender = inputs.find(input => input.Nombre === 'Masculino' && input.Valor === "true") ? 'male' : 'female';
    
        await clickInput(page, `input[name="applicant.background2.gender"][value="${gender}"]`)
        
        await fillInput(page,'input[name="applicant.background2.race"]', `American indian`);
        
        const religion = inputs.find(input => input.TituloPagina === '¿Cual es tu Religion?' && input.Nombre === 'Religion').Valor;
    
        await fillInput(page,'input[name="applicant.background2.religion"]', religion);
    
        await clickInput(page, 'input[name="applicant.background2.nativeLanguage"]');
    
        await page.type('input[name="applicant.background2.nativeLanguage"]', 'Spanish');
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await clickInput(page, `input[name="applicant.background2.fluentEnglish"][value="false"]`)
        
        await nextClick(page);
    
        const livedAnotherCountry = inputs.find(input => input.TituloPagina === 'Vivías en un tercer país antes de entrar a los Estados Unidos?').Nombre;
    
        if(livedAnotherCountry != 'NO'){
            await sleep(3000)
            const buttonAdd = await page.locator('[id="add_button"]').waitHandle();
            await buttonAdd.click()
    
            const cityAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Ciudad').Valor;
            let countryAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Country').Valor;
            const stateAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Estado').Valor;
            const addressAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Direccion').Valor;
            const zipCodeAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Codigo Postal').Valor;
            const aptAnotherCountry = inputs.find(input => input.TituloPagina === '¿Cuál fue tu dirección en ese país?' && input.Nombre === 'Numero de Apartamento/ Suite / Unidad').Valor;
            
            countryAnotherCountry = countryAnotherCountry.charAt(0).toUpperCase() + countryAnotherCountry.slice(1);
            countryAnotherCountry = countryAnotherCountry.replace(/ /g, '');
            await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory3.0.address.country"]');
    
            await page.type('input[name="applicant.residenceHistory.residenceHistory3.0.address.country"]', countryAnotherCountry);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory3.0.address.addressLineOne"]', `${addressAnotherCountry} ${aptAnotherCountry}`);
            await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory3.0.address.city"]', cityAnotherCountry);
            await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory3.0.address.province"]', stateAnotherCountry);
            await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory3.0.address.postalCode"]', zipCodeAnotherCountry);
            
            const dateFrom = inputs.find(input => input.TituloPagina === 'Cuánto tiempo viviste en esa dirección?' && input.Nombre === 'Desde' && input.Pagina == 10).Valor;
            const dateTo = inputs.find(input => input.TituloPagina === 'Cuánto tiempo viviste en esa dirección?' && input.Nombre === 'Hasta' && input.Pagina == 10).Valor;
            
            const yearFrom = dateFrom.split('-')[0];
            const monthFrom = dateFrom.split('-')[1];
            const yearTo = dateTo.split('-')[0];
            const monthTo = dateTo.split('-')[1];
            
            const textualMonthFrom = months[parseInt(monthFrom) - 1];
            const textualMonthTo = months[parseInt(monthTo) - 1];
    
            await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory3.0.dates.fromDate.month"]');
    
            await page.type('input[name="applicant.residenceHistory.residenceHistory3.0.dates.fromDate.month"]', textualMonthFrom);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory3.0.dates.fromDate.year"]');
    
            await page.type('input[name="applicant.residenceHistory.residenceHistory3.0.dates.fromDate.year"]', yearFrom);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory3.0.dates.toDate.month"]');
    
            await page.type('input[name="applicant.residenceHistory.residenceHistory3.0.dates.toDate.month"]', textualMonthTo);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory3.0.dates.toDate.year"]');
    
            await page.type('input[name="applicant.residenceHistory.residenceHistory3.0.dates.toDate.year"]', yearTo);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await sleep(3000)
            const buttonSubmit = await page.locator('[id="table-submit-button"]').waitHandle();
            await buttonSubmit.click()
    
        }
    
        await nextClick(page);
    
        const cityLastLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Ciudad' && input.Pagina === 11).Valor;
        const addressLasLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Direccion' && input.Pagina === 11).Valor;
        let countryLastLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Country' && input.Pagina === 11).Valor;
        const zipCodeLastLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Codigo Postal' && input.Pagina === 11).Valor;
        const aptLastLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Numero de Apartamento/ Suite / Unidad' && input.Pagina === 11).Valor;
        const stateLastLived = inputs.find(input => input.TituloPagina === '¿Cuál fue tu ultima dirección en tu país de origen?' && input.Nombre === 'Estado' && input.Pagina === 11).Valor;
    
        countryLastLived = countryLastLived.charAt(0).toUpperCase() + countryLastLived.slice(1);
        countryLastLived = countryLastLived.replace(/ /g, '');
    
        await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.country"]');
    
        await page.type('input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.country"]', countryLastLived);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.addressLineOne"]', `${addressLasLived} ${aptLastLived}`);
        await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.city"]', cityLastLived);
        await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.province"]', stateLastLived);
        await fillInput(page,'input[name="applicant.residenceHistory.residenceHistory1.lastAddressOutsideUs.postalCode"]', zipCodeLastLived);
    
        const dateFromLastLived = inputs.find(input => input.TituloPagina === '¿Cuánto tiempo viviste en esa dirección?' && input.Nombre === 'Desde' && input.Pagina == 12).Valor;
        const dateToLastLived = inputs.find(input => input.TituloPagina === '¿Cuánto tiempo viviste en esa dirección?' && input.Nombre === 'Hasta' && input.Pagina == 12).Valor;
    
        const yearFromLastLived = dateFromLastLived.split('-')[0];
        const monthFromLastLived = dateFromLastLived.split('-')[1];
        const yearToLastLived = dateToLastLived.split('-')[0];
        const monthToLastLived = dateToLastLived.split('-')[1];
    
        const textualMonthFromLastLived = months[parseInt(monthFromLastLived) - 1];
        const textualMonthToLastLived = months[parseInt(monthToLastLived) - 1];
    
        await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory1.dates.fromDate.month"]');
    
        await page.type('input[name="applicant.residenceHistory.residenceHistory1.dates.fromDate.month"]', textualMonthFromLastLived);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory1.dates.fromDate.year"]');
    
        await page.type('input[name="applicant.residenceHistory.residenceHistory1.dates.fromDate.year"]', yearFromLastLived);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory1.dates.toDate.month"]');
    
        await page.type('input[name="applicant.residenceHistory.residenceHistory1.dates.toDate.month"]', textualMonthToLastLived);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        await clickInput(page, 'input[name="applicant.residenceHistory.residenceHistory1.dates.toDate.year"]');
    
        await page.type('input[name="applicant.residenceHistory.residenceHistory1.dates.toDate.year"]', yearToLastLived);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.residenceHistory.residenceHistory1.isFromCountryWhereFearedPersecution"][value="true"]')
    
        await nextClick(page);
    
        await sleep(3000)
        const buttonAdd = await page.locator('[id="add_button"]').waitHandle();
        await buttonAdd.click()
    
        const stateAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Estado o provincia donde se encuentra la academia' && input.Pagina == 61).Valor;
        const cityAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Ciudad donde se encuentra la academia' && input.Pagina == 61).Valor;
        let countryAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'País donde se encuentra la academia' && input.Pagina == 61).Valor;
        const nameAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Nombre de la institución académica' && input.Pagina == 61).Valor;
        const addressAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Dirección completa de la academia' && input.Pagina == 61).Valor;
        const zipCodeAcademy = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Código postal de la ubicación de la academia' && input.Pagina == 61).Valor;
        const academyType = inputs.find(input => input.TituloPagina === '¿Dónde estudiaste?' && input.Nombre === 'Tipo de Institución academica' && input.Pagina == 61).Valor;
        
        if(nameAcademy != ""){
            await fillInput(page,'input[name="applicant.schoolHistory.0.name"]', nameAcademy);
            await fillInput(page,'input[name="applicant.schoolHistory.0.type"]', academyType);
    
            countryAcademy = countryAcademy.charAt(0).toUpperCase() + countryAcademy.slice(1);
            countryAcademy = countryAcademy.replace(/ /g, '');
            
            await clickInput(page, 'input[name="applicant.schoolHistory.0.address.country"]');
    
            await page.type('input[name="applicant.schoolHistory.0.address.country"]', countryAcademy);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await fillInput(page,'input[name="applicant.schoolHistory.0.address.addressLineOne"]', addressAcademy);
            await fillInput(page,'input[name="applicant.schoolHistory.0.address.city"]', cityAcademy);
            await fillInput(page,'input[name="applicant.schoolHistory.0.address.province"]', stateAcademy);
            await fillInput(page,'input[name="applicant.schoolHistory.0.address.postalCode"]', zipCodeAcademy);
    
            const dateFromAcademy = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas donde estudiaste en esta institución?' && input.Nombre === 'Comenzaste el' && input.Pagina == 62).Valor;
            const dateToAcademy = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas donde estudiaste en esta institución?' && input.Nombre === 'Terminaste el' && input.Pagina == 62).Valor;
        
            const yearFromAcademy = dateFromAcademy.split('-')[0];
            const monthFromAcademy = dateFromAcademy.split('-')[1];
            const yearToAcademy = dateToAcademy.split('-')[0];
            const monthToAcademy = dateToAcademy.split('-')[1];
        
            const textualMonthFromAcademy = months[parseInt(monthFromAcademy) - 1];
            const textualMonthToAcademy = months[parseInt(monthToAcademy) - 1];
    
            await clickInput(page, 'input[name="applicant.schoolHistory.0.dates.fromDate.month"]');
    
            await page.type('input[name="applicant.schoolHistory.0.dates.fromDate.month"]', textualMonthFromAcademy);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await clickInput(page, 'input[name="applicant.schoolHistory.0.dates.fromDate.year"]');
    
            await page.type('input[name="applicant.schoolHistory.0.dates.fromDate.year"]', yearFromAcademy);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await clickInput(page, 'input[name="applicant.schoolHistory.0.dates.toDate.month"]');
    
            await page.type('input[name="applicant.schoolHistory.0.dates.toDate.month"]', textualMonthToAcademy);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await clickInput(page, 'input[name="applicant.schoolHistory.0.dates.toDate.year"]');
    
            await page.type('input[name="applicant.schoolHistory.0.dates.toDate.year"]', yearToAcademy);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await sleep(3000)
            const buttonAddAcademy = await page.locator('[id="table-submit-button"]').waitHandle();
            await buttonAddAcademy.click()
    
            const anotherAcademy = inputs.find(input => input.TituloPagina === '¿Necesitas agregar otra institución académica?' && input.Nombre === 'SI' && input.Pagina == 63).Valor;
            if(anotherAcademy === "true" ){
                await sleep(3000)
                const buttonAddAnotherAcademy = await page.locator('[id="add_button"]').waitHandle();
                await buttonAddAnotherAcademy.click()
    
                const stateAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Estado o provincia donde se encuentra la academia' && input.Pagina == 64).Valor;
                const cityAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Ciudad donde se encuentra la academia' && input.Pagina == 64).Valor;
                let countryAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'País donde se encuentra la academia' && input.Pagina == 64).Valor;
                const nameAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Nombre de la institución académica' && input.Pagina == 64).Valor;
                const addressAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Dirección completa de la academia' && input.Pagina == 64).Valor;
                const zipCodeAcademy2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Código postal de la ubicación de la academia' && input.Pagina == 64).Valor;
                const academyType2 = inputs.find(input => input.TituloPagina === 'Institucion academica' && input.Nombre === 'Tipo de Institución academica' && input.Pagina == 64).Valor;
    
                await fillInput(page,'input[name="applicant.schoolHistory.1.name"]', nameAcademy2);
                await fillInput(page,'input[name="applicant.schoolHistory.1.type"]', academyType2);
                countryAcademy2 = countryAcademy2.charAt(0).toUpperCase() + countryAcademy2.slice(1);
                countryAcademy2 = countryAcademy2.replace(/ /g, '');
    
                await clickInput(page, 'input[name="applicant.schoolHistory.1.address.country"]');
    
                await page.type('input[name="applicant.schoolHistory.1.address.country"]', countryAcademy2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
    
                await fillInput(page,'input[name="applicant.schoolHistory.1.address.addressLineOne"]', addressAcademy2);
                await fillInput(page,'input[name="applicant.schoolHistory.1.address.city"]', cityAcademy2);
                await fillInput(page,'input[name="applicant.schoolHistory.1.address.province"]', stateAcademy2);
                await fillInput(page,'input[name="applicant.schoolHistory.1.address.postalCode"]', zipCodeAcademy2);
    
                const dateFromAcademy2 = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas donde estudiaste en esta institución?' && input.Nombre === 'Comenzaste el' && input.Pagina == 65).Valor;
                const dateToAcademy2 = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas donde estudiaste en esta institución?' && input.Nombre === 'Terminaste el' && input.Pagina == 65).Valor;
            
                const yearFromAcademy2 = dateFromAcademy2.split('-')[0];
                const monthFromAcademy2 = dateFromAcademy2.split('-')[1];
                const yearToAcademy2 = dateToAcademy2.split('-')[0];
                const monthToAcademy2 = dateToAcademy2.split('-')[1];
            
                const textualMonthFromAcademy2 = months[parseInt(monthFromAcademy2) - 1];
                const textualMonthToAcademy2 = months[parseInt(monthToAcademy2) - 1];
    
                await clickInput(page, 'input[name="applicant.schoolHistory.1.dates.fromDate.month"]');
    
                await page.type('input[name="applicant.schoolHistory.1.dates.fromDate.month"]', textualMonthFromAcademy2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                
                await clickInput(page, 'input[name="applicant.schoolHistory.1.dates.fromDate.year"]');
    
                await page.type('input[name="applicant.schoolHistory.1.dates.fromDate.year"]', yearFromAcademy2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                
                await clickInput(page, 'input[name="applicant.schoolHistory.1.dates.toDate.month"]');
    
                await page.type('input[name="applicant.schoolHistory.1.dates.toDate.month"]', textualMonthToAcademy2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                
                await clickInput(page, 'input[name="applicant.schoolHistory.1.dates.toDate.year"]');
    
                await page.type('input[name="applicant.schoolHistory.1.dates.toDate.year"]', yearToAcademy2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                await sleep(3000)
                const buttonAddAcademy2 = await page.locator('[id="table-submit-button"]').waitHandle();
                await buttonAddAcademy2.click()
            }
        }
    
        await nextClick(page);
    
        await sleep(3000)
        const buttonAddJob = await page.locator('[id="add_button"]').waitHandle();
        await buttonAddJob.click()
    
        const stateJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Estado o provincia donde se encuentra la compañía o negocio' && input.Pagina == 72).Valor;
        const cityJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Ciudad donde se encuentra la compañía o negocio' && input.Pagina == 72).Valor;
        let countryJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'País donde se encuentra la compañía o negocio' && input.Pagina == 72).Valor;
        const nameJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Nombre de la compañía o negocio' && input.Pagina == 72).Valor;
        const addressJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Dirección completa de la compañía o negocio' && input.Pagina == 72).Valor;
        const zipCodeJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Código postal de la ubicación de la compañía o negocio' && input.Pagina == 72).Valor;
        const occupationJob = inputs.find(input => input.TituloPagina === 'Información laboral o empresarial' && input.Nombre === 'Ocupacion' && input.Pagina == 72).Valor;
        if(nameJob != ""){
            await fillInput(page,'input[name="applicant.employmentHistory.0.name"]', nameJob);
    
            countryJob = countryJob.charAt(0).toUpperCase() + countryJob.slice(1);
            countryJob = countryJob.replace(/ /g, '');
    
            await clickInput(page, 'input[name="applicant.employmentHistory.0.address.country"]');
    
            await page.type('input[name="applicant.employmentHistory.0.address.country"]', countryJob);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await fillInput(page,'input[name="applicant.employmentHistory.0.address.addressLineOne"]', addressJob);
            await fillInput(page,'input[name="applicant.employmentHistory.0.address.city"]', cityJob);
            await fillInput(page,'input[name="applicant.employmentHistory.0.address.province"]', stateJob);
            await fillInput(page,'input[name="applicant.employmentHistory.0.address.postalCode"]', zipCodeJob);
            await fillInput(page,'input[name="applicant.employmentHistory.0.occupation"]', occupationJob);
    
            const dateFromJob = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas en que trabajaste en ese lugar ?' && input.Nombre === 'Comenzaste el' && input.Pagina == 73).Valor;
            const dateToJob = inputs.find(input => input.TituloPagina === '¿Cuales fueron las fechas en que trabajaste en ese lugar ?' && input.Nombre === 'Terminaste el' && input.Pagina == 73).Valor;
        
            const yearFromJob = dateFromJob.split('-')[0];
            const monthFromJob = dateFromJob.split('-')[1];
            const yearToJob = dateToJob.split('-')[0];
            const monthToJob = dateToJob.split('-')[1];
        
            const textualMonthFromJob = months[parseInt(monthFromJob) - 1];
            const textualMonthToJob = months[parseInt(monthToJob) - 1];
    
            await clickInput(page, 'input[name="applicant.employmentHistory.0.dates.fromDate.month"]');
    
            await page.type('input[name="applicant.employmentHistory.0.dates.fromDate.month"]', textualMonthFromJob);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await clickInput(page, 'input[name="applicant.employmentHistory.0.dates.fromDate.year"]');
    
            await page.type('input[name="applicant.employmentHistory.0.dates.fromDate.year"]', yearFromJob);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.employmentHistory.0.dates.toDate.month"]');
    
            await page.type('input[name="applicant.employmentHistory.0.dates.toDate.month"]', textualMonthToJob);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.employmentHistory.0.dates.toDate.year"]');
    
            await page.type('input[name="applicant.employmentHistory.0.dates.toDate.year"]', yearToJob);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await sleep(3000)
            const sendJob = await page.locator('[id="table-submit-button"]').waitHandle();
            await sendJob.click()
        }
    
        await nextClick(page);
    
        await clickInput(page, 'input[name="applicant.immigrationInformation.immigrationInformation1.presentNationality"]');
    
        await page.type('input[name="applicant.immigrationInformation.immigrationInformation1.presentNationality"]', countryOfBirth);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    
        const passport = inputs.find(input => input.TituloPagina === 'Número de pasaporte (dejar en blanco de no tener)' && input.Pagina == 4 && input.Nombre == "Pasaporte").Valor;
    
        if(passport != ""){
            const dueDatePassport = inputs.find(input => input.TituloPagina === 'Fecha de vencimiento del pasaporte' && input.Pagina == 4 && input.Nombre == "Fecha de vencimiento") ? 
            inputs.find(input => input.TituloPagina === 'Fecha de vencimiento del pasaporte' && input.Pagina == 4 && input.Nombre == "Fecha de vencimiento").Valor 
            : ""
    
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation1.hasPassportOrTravelDocument"]')
            await fillInput(page,'input[name="applicant.immigrationInformation.immigrationInformation1.passportOrTravelDocNumber"]', passport);
    
            await clickInput(page, 'input[name="applicant.immigrationInformation.immigrationInformation1.passportOrTravelDocCountryOfIssuance"]');
    
            await page.type('input[name="applicant.immigrationInformation.immigrationInformation1.passportOrTravelDocCountryOfIssuance"]', countryOfBirth);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            if(dueDatePassport !== ""){
                const year = dueDatePassport.split('-')[0];
                const month = dueDatePassport.split('-')[1];
                const day = dueDatePassport.split('-')[2];
        
                await fillInput(page,'input[name="applicant.immigrationInformation.immigrationInformation1.passportOrTravelDocExpirationDate"]', `${month}/${day}/${year}`);
                await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation1.otherEntries"][value="false"]')            
            }
    
            
        }else{
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation1.hasPassportOrTravelDocument"][value="false"]')
        }
        
        await nextClick(page);
        
        await clickInput(page, 'input[name="applicant.immigrationInformation.immigrationInformation2.immigrationCourtProceedings"][value="never"]')
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation2.socialSecurityNumber.none"]')
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation2.alienNumber.none"]')
        await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.immigrationInformation.immigrationInformation2.uscisNumber.none"]')
        
        await nextClick(page);
        
        const maritalStatus = inputs.find(input => input.TituloPagina === '¿Cual es tu estado Civil?' && input.Pagina == 24).Nombre;
        
        if(maritalStatus.includes("Divorciado(a)")){
            await clickInput(page, 'input[name="applicant.maritalStatus.maritalStatus"][value="divorced"]')
        }
        if(maritalStatus.includes("Casado(a)")){
            await clickInput(page, 'input[name="applicant.maritalStatus.maritalStatus"][value="married"]')
    
            const dateMarriage = inputs.find(input => input.TituloPagina === '¿En que fecha contrajeron matrimonio?' && input.Pagina == 29).Valor;
    
            const yearMarriage = dateMarriage.split('-')[0];
            const monthMarriage = dateMarriage.split('-')[1];
            const dayMarriage = dateMarriage.split('-')[2];
    
            await fillInput(page,'input[name="applicant.maritalStatus.marriageDate"]', `${monthMarriage}/${dayMarriage}/${yearMarriage}`);
    
            const cityMarriage = inputs.find(input => input.TituloPagina === '¿En qué ciudad se casaron?' && input.Nombre == "Ciudad" && input.Pagina == 30).Valor;
            
            //await fillInput(page,'input[name="applicant.maritalStatus.cityOfMarriage"]', cityMarriage);
    
            await nextClick(page);
            
            const firstNameSpouse = inputs.find(input => input.TituloPagina === '¿Cual es el nombre completo de tu esposa(o)?' && input.Nombre === 'Primer Nombre ' && input.Pagina == 25).Valor;
            const middleNameSpouse = inputs.find(input => input.TituloPagina === '¿Cual es el nombre completo de tu esposa(o)?' && input.Nombre === 'Segundo Nombre ' && input.Pagina == 25).Valor;
            const lastNameSpouse = inputs.find(input => input.TituloPagina === '¿Cual es el nombre completo de tu esposa(o)?' && input.Nombre === 'Apellidos ' && input.Pagina == 25).Valor;
            
            
            await fillInput(page,'input[name="applicant.spouse.spouse1.name.firstName"]', firstNameSpouse);
            await fillInput(page,'input[name="applicant.spouse.spouse1.name.middleName"]', middleNameSpouse);
            await fillInput(page,'input[name="applicant.spouse.spouse1.name.lastName"]', lastNameSpouse);
            
            await nextClick(page);
    
            const birthDateSpouse = inputs.find(input => input.TituloPagina === '¿Cual es la fecha de nacimiento de tu esposa(o)?' && input.Pagina == 26).Valor;
            
            const yearSpouse = birthDateSpouse.split('-')[0];
            const monthSpouse = birthDateSpouse.split('-')[1];
            const daySpouse = birthDateSpouse.split('-')[2];
    
            await fillInput(page,'input[name="applicant.spouse.spouse2.dateOfBirth"]', `${monthSpouse}/${daySpouse}/${yearSpouse}`);
    
            const countryOfBirthSpouse = inputs.find(input => input.TituloPagina === '¿En que ciudad y país nacío tu esposa(o)' && input.Nombre == "País" && input.Pagina == 27).Valor;
    
            await clickInput(page, 'input[name="applicant.spouse.spouse2.countryOfBirth"]');
            await page.type('input[name="applicant.spouse.spouse2.countryOfBirth"]', countryOfBirthSpouse);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.spouse.spouse2.presentNationality"]');
            await page.type('input[name="applicant.spouse.spouse2.presentNationality"]', countryOfBirthSpouse);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.spouse.spouse2.alienNumber.none"]')
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.spouse.spouse2.passportNumber.none"]')
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.spouse.spouse2.socialSecurityNumber.none"]')
            
            await nextClick(page);
            
            const isInUSA = inputs.find(input => input.TituloPagina === '¿Tu esposa(o) se encuentra en los Estados Unidos?' && input.Pagina == 32).Nombre;
            
            if(isInUSA === "SI"){
                
                await clickInput(page, 'input[name="applicant.spouse.spouse3.isYourSpouseInUs"][value="true"]')
    
                const inIncluded = inputs.find(input => input.TituloPagina === '¿Estara tu esposa(o) incluido(a) en esta aplicación?' && input.Pagina == 31).Nombre;
    
                if(inIncluded === "SI"){
                    await clickInput(page, 'input[name="applicant.spouse.spouse3.includedOnApplication"][value="true"]')
                }
    
            }else{
                await clickInput(page, 'input[name="applicant.spouse.spouse3.isYourSpouseInUs"][value="false"]')
            }
        }   
        if(maritalStatus.includes("Soltero(a)")){
            await clickInput(page, 'input[name="applicant.maritalStatus.maritalStatus"][value="single"]')
        }
        if(maritalStatus.includes("Viudo(a)")){
            await clickInput(page, 'input[name="applicant.maritalStatus.maritalStatus"][value="widowed"]')
        }
        
        await nextClick(page);
        
        const haveKids = inputs.find(input => input.TituloPagina === '¿Tienes hijo(a)s?' && input.Pagina == 35).Nombre;
        if(haveKids === "SI"){
            await clickInput(page, 'input[name="applicant.children.doYouHaveChildren"][value="true"]')
            await nextClick(page);
            const arrayKids = inputs.filter(input => input.TituloPagina.includes('¿Necesitas agregar otro hijo(a)?') && input.Nombre.includes("SI"))
            const quantityKids = arrayKids.length + 1;
            
    
            await clickInput(page, 'input[name="applicant.childrenDetails.numberOfChildren"]');
    
            await page.type('input[name="applicant.childrenDetails.numberOfChildren"]', quantityKids.toString());
    
            await sleep(3000)
            const buttonAddChild = await page.locator('[id="add_button"]').waitHandle();
            await buttonAddChild.click()
            await sleep(2000)
            
            const firstNameChild1 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Primer Nombre ' && input.Pagina == 36).Valor;
            const secondNameChild1 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Segundo Nombre ' && input.Pagina == 36).Valor;
            const lastNameChild1 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Apellidos ' && input.Pagina == 36).Valor;
            
            await sleep(2000)
            
            await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation1.name.firstName"]', firstNameChild1);
            await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation1.name.middleName"]', secondNameChild1);
            await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation1.name.lastName"]', lastNameChild1);
            
            await tableNextButton(page);
            
            await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.race"]', "American Indian");
    
            const dateOfBirthChild1 = inputs.find(input => input.TituloPagina === '¿Cual es la fecha de nacimiento de tu hijo(a)?' && input.Nombre === 'Fecha' && input.Pagina == 37).Valor;
    
            const yearChild1 = dateOfBirthChild1.split('-')[0];
            const monthChild1 = dateOfBirthChild1.split('-')[1];
            const dayChild1 = dateOfBirthChild1.split('-')[2];
    
            await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.dateOfBirth"]', `${monthChild1}/${dayChild1}/${yearChild1}`);
    
            let countryOfBirthChild1 = inputs.find(input => input.TituloPagina === '¿En que ciudad y país nacío tu hijo(a)?' && input.Nombre == "País" && input.Pagina == 38).Valor;
            const cityOfBirthChild1 = inputs.find(input => input.TituloPagina === '¿En que ciudad y país nacío tu hijo(a)?' && input.Nombre == "Ciudad" && input.Pagina == 38).Valor;
            countryOfBirthChild1 = countryOfBirthChild1.charAt(0).toUpperCase() + countryOfBirthChild1.slice(1);
            countryOfBirthChild1 = countryOfBirthChild1.replace(/ /g, '');
    
    
            await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.countryOfBirth"]');
    
            await page.type('input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.countryOfBirth"]', countryOfBirthChild1);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
            await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.countryOfCitizenship"]');
    
            await page.type('input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.countryOfCitizenship"]', countryOfBirthChild1);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
    
    
            await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation2.maritalStatus"][value="single"]')
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.0.childrenInformation2.alienNumber.none"]')
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.0.childrenInformation2.passportNumber.none"]')
            await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.0.childrenInformation2.socialSecurityNumber.none"]')
            
            await tableNextButton(page);
            
            const child1InUSA = inputs.find(input => input.TituloPagina === '¿Tu hijo(a) se encuentra en los Estados Unidos?' && input.Pagina == 41).Nombre;
            
            if(child1InUSA === "SI"){
                await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation3.isYourChildInUs"][value="true"]')
                await sleep(1500)
                const childIncludedApplication = inputs.find(input => input.TituloPagina === '¿Estara tu hijo(a) incluido(a) en esta aplicación?' && input.Pagina == 40).Nombre;
                if(childIncludedApplication === "SI"){
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation3.includedOnApplication"][value="true"]')
                }else{
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation3.includedOnApplication"][value="false"]')
                }
            }else{
                await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.0.childrenInformation3.isYourChildInUs"][value="false"]')
            }
    
            await sleep(3000)
            const buttonSendChild = await page.locator('[id="table-submit-button"]').waitHandle();
            await buttonSendChild.click()
    
            const anotherChild = inputs.find(input => input.TituloPagina === '¿Necesitas agregar otro hijo(a)?' && input.Pagina == 43).Nombre;
    
            if(anotherChild === "SI"){
                await sleep(3000)
                const buttonAddChild2 = await page.locator('[id="add_button"]').waitHandle();
                await buttonAddChild2.click()
                await sleep(1000)
    
                const firstNameChild2 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Primer Nombre' && input.Pagina == 44).Valor;
                const secondNameChild2 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Segundo Nombre ' && input.Pagina == 44).Valor;
                const lastNameChild2 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Apellidos' && input.Pagina == 44).Valor;
                
                await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation1.name.firstName"]', firstNameChild2);
                await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation1.name.middleName"]', secondNameChild2);
                await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation1.name.lastName"]', lastNameChild2);
                
                await tableNextButton(page);
                
                await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.race"]', "American Indian");
    
                const dateOfBirthChild2 = inputs.find(input => input.TituloPagina === '¿Cual es la fecha de nacimiento de tu hijo(a?)' && input.Nombre === 'Fecha' && input.Pagina == 45).Valor;
    
                const yearChild2 = dateOfBirthChild2.split('-')[0];
                const monthChild2 = dateOfBirthChild2.split('-')[1];
                const dayChild2 = dateOfBirthChild2.split('-')[2];
    
                await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.dateOfBirth"]', `${monthChild2}/${dayChild2}/${yearChild2}`);
    
                let countryOfBirthChild2 = inputs.find(input => input.TituloPagina === '¿En que ciudad y país de nacio tu hijo(a)?' && input.Nombre == "País" && input.Pagina == 46).Valor;
                const cityOfBirthChild2 = inputs.find(input => input.TituloPagina === '¿En que ciudad y país de nacio tu hijo(a)?' && input.Nombre == "Ciudad" && input.Pagina == 46).Valor;
                countryOfBirthChild2 = countryOfBirthChild2.charAt(0).toUpperCase() + countryOfBirthChild2.slice(1);
                countryOfBirthChild2 = countryOfBirthChild2.replace(/ /g, '');
    
                await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.countryOfBirth"]');
    
                await page.type('input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.countryOfBirth"]', countryOfBirthChild2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
    
                await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.countryOfCitizenship"]');
    
                await page.type('input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.countryOfCitizenship"]', countryOfBirthChild2);
    
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
    
                await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation2.maritalStatus"][value="single"]')
                await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.1.childrenInformation2.alienNumber.none"]')
                await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.1.childrenInformation2.passportNumber.none"]')
                await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.1.childrenInformation2.socialSecurityNumber.none"]')
                
                await tableNextButton(page);
                
                const child1InUSA = inputs.find(input => input.TituloPagina === '¿Tu hijo(a) se encuentra en los Estados Unidos?' && input.Pagina == 49).Nombre;
                
                if(child1InUSA === "SI"){
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation3.isYourChildInUs"][value="true"]')
                    await sleep(1500)
                    const childIncludedApplication = inputs.find(input => input.TituloPagina === '¿Estara tu hijo(a) incluido(a) en esta aplicación?' && input.Pagina == 48).Nombre;
                    if(childIncludedApplication === "SI"){
                        await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation3.includedOnApplication"][value="true"]')
                    }else{
                        await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation3.includedOnApplication"][value="false"]')
                    }
                }else{
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.1.childrenInformation3.isYourChildInUs"][value="false"]')
                }
    
                await sleep(3000)
                const buttonSendChild = await page.locator('[id="table-submit-button"]').waitHandle();
                await buttonSendChild.click()
                await sleep(1000)
    
                const anotherChild2 = inputs.find(input => input.TituloPagina === '¿Necesitas agregar a otro hijo(a)?' && input.Pagina == 52).Nombre;
    
                if(anotherChild2 === "SI"){
                    await sleep(3000)
                    const buttonAddChild3 = await page.locator('[id="add_button"]').waitHandle();
                    await buttonAddChild3.click()
                    await sleep(1000)
    
                    const firstNameChild3 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Primer Nombre' && input.Pagina == 53).Valor;
                    const secondNameChild3 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Segundo Nombre' && input.Pagina == 53).Valor;
                    const lastNameChild3 = inputs.find(input => input.TituloPagina === '¿Cual es el nombre de tu hijo(a)?' && input.Nombre === 'Apellidos ' && input.Pagina == 53).Valor;
                    
                    await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation1.name.firstName"]', firstNameChild3);
                    await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation1.name.middleName"]', secondNameChild3);
                    await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation1.name.lastName"]', lastNameChild3);
                    
                    await tableNextButton(page);
                    
                    await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.race"]', "American Indian");
    
                    const dateOfBirthChild3 = inputs.find(input => input.TituloPagina === '¿Cual es la fecha de nacimiento de tu hijo(a)?' && input.Nombre === 'Fecha' && input.Pagina == 54).Valor;
    
                    const yearChild3 = dateOfBirthChild3.split('-')[0];
                    const monthChild3 = dateOfBirthChild3.split('-')[1];
                    const dayChild3 = dateOfBirthChild3.split('-')[2];
    
                    await fillInput(page,'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.dateOfBirth"]', `${monthChild3}/${dayChild3}/${yearChild3}`);
    
                    let countryOfBirthChild3 = inputs.find(input => input.TituloPagina === '¿En que ciudad y país nacío tu hijo(a)?' && input.Nombre == "País" && input.Pagina == 55).Valor;
                    countryOfBirthChild3 = countryOfBirthChild3.charAt(0).toUpperCase() + countryOfBirthChild3.slice(1);
                    countryOfBirthChild3 = countryOfBirthChild3.replace(/ /g, '');
    
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.countryOfBirth"]');
    
                    await page.type('input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.countryOfBirth"]', countryOfBirthChild3);
        
                    await page.keyboard.press('ArrowDown');
                    await page.keyboard.press('Enter');
        
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.countryOfCitizenship"]');
        
                    await page.type('input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.countryOfCitizenship"]', countryOfBirthChild3);
        
                    await page.keyboard.press('ArrowDown');
                    await page.keyboard.press('Enter');
    
                    await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation2.maritalStatus"][value="single"]')
                    await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.2.childrenInformation2.alienNumber.none"]')
                    await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.2.childrenInformation2.passportNumber.none"]')
                    await clickInput(page, 'input[name="formikFactoryUIMeta.applicant.childrenDetails.childrenInformation.2.childrenInformation2.socialSecurityNumber.none"]')
                    
                    await tableNextButton(page);
                    
                    const child3InUSA = inputs.find(input => input.TituloPagina === '¿Tu hijo(a) se encuentra en los Estados Unidos?' && input.Pagina == 58).Nombre;
                    
                    if(child3InUSA === "SI"){
                        await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation3.isYourChildInUs"][value="true"]')
                        const childIncludedApplication = inputs.find(input => input.TituloPagina === '¿Estara tu hijo(a) incluido(a) en esta aplicación?' && input.Pagina == 57).Nombre;
                        if(childIncludedApplication === "SI"){
                            await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation3.includedOnApplication"][value="true"]')
                        }else{
                            await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation3.includedOnApplication"][value="false"]')
                        }
                    }else{
                        await clickInput(page, 'input[name="applicant.childrenDetails.childrenInformation.2.childrenInformation3.isYourChildInUs"][value="false"]')
                    }
    
                    await sleep(3000)
                    const buttonSendChild = await page.locator('[id="table-submit-button"]').waitHandle();
                    await buttonSendChild.click()
                    await sleep(1000)
                }
            }
    
        }else{
            await clickInput(page, 'input[name="applicant.children.doYouHaveChildren"][value="false"]')
        }
        
        await nextClick(page);
        
        const motherFirstName =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "Primer nombre" && input.Pagina == 78).Valor;
        const motherSecondName =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "Segundo nombre" && input.Pagina == 78).Valor;
        const motherLastNames =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "Apellidos" && input.Pagina == 78).Valor;
        let motherCountryBorn =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "País de nacimiento" && input.Pagina == 78).Valor;
        const motherCityBorn =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "Ciudad de nacimiento" && input.Pagina == 78).Valor;
        const motherCurrentCity =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "Ciudad de residencia actual (Si ha fallecido colocar en la casilla correspondiente)" && input.Pagina == 78).Valor;
        const motherCurrentCountry =  inputs.find(input => input.TituloPagina === 'Información de tu madre' && input.Nombre == "País de residencia actual (Si ha fallecido colocar en la casilla correspondiente)" && input.Pagina == 78).Valor;
        
        await fillInput(page,'input[name="applicant.mother.name.firstName"]', motherFirstName);
        await fillInput(page,'input[name="applicant.mother.name.middleName"]', motherSecondName);
        await fillInput(page,'input[name="applicant.mother.name.lastName"]', motherLastNames);
        await fillInput(page,'input[name="applicant.mother.placeOfBirth"]', motherCityBorn);
        
        motherCountryBorn = motherCountryBorn.charAt(0).toUpperCase() + motherCountryBorn.slice(1);
        motherCountryBorn = motherCountryBorn.replace(/ /g, '');
    
        await clickInput(page, 'input[name="applicant.mother.countryOfBirth"]');
        
        await page.type('input[name="applicant.mother.countryOfBirth"]', motherCountryBorn);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        if (motherCurrentCity.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i) || motherCurrentCountry.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i)) {
            await clickInput(page, 'input[name="applicant.mother.noCurrentLocation"]')
        }else{
            await fillInput(page,'input[name="applicant.mother.currentLocation"]', `${motherCurrentCity}, ${motherCurrentCountry}`);
        }
    
        await nextClick(page);
    
        const fatherFirstName =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "Primer nombre" && input.Pagina == 77).Valor;
        const fatherSecondName =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "Segundo nombre" && input.Pagina == 77).Valor;
        const fatherLastNames =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "Apellidos" && input.Pagina == 77).Valor;
        let fatherCountryBorn =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "País de nacimiento" && input.Pagina == 77).Valor;
        const fatherCityBorn =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "Ciudad de nacimiento" && input.Pagina == 77).Valor;
        const fatherCurrentCity =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "Ciudad de residencia actual (Si ha fallecido colocar en la casilla correspondiente)" && input.Pagina == 77).Valor;
        const fatherCurrentCountry =  inputs.find(input => input.TituloPagina === 'Información de tu padre' && input.Nombre == "País de residencia actual (Si ha fallecido colocar en la casilla correspondiente)" && input.Pagina == 77).Valor;
        
        await fillInput(page,'input[name="applicant.father.name.firstName"]', fatherFirstName);
        await fillInput(page,'input[name="applicant.father.name.middleName"]', fatherSecondName);
        await fillInput(page,'input[name="applicant.father.name.lastName"]', fatherLastNames);
        await fillInput(page,'input[name="applicant.father.placeOfBirth"]', fatherCityBorn);
        
        fatherCountryBorn = fatherCountryBorn.charAt(0).toUpperCase() + fatherCountryBorn.slice(1);
        fatherCountryBorn = fatherCountryBorn.replace(/ /g, '');
    
        await clickInput(page, 'input[name="applicant.father.countryOfBirth"]');
        
        await page.type('input[name="applicant.father.countryOfBirth"]', fatherCountryBorn);
    
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        if (fatherCurrentCity.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i) || fatherCurrentCountry.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i)) {
            await clickInput(page, 'input[name="applicant.father.noCurrentLocation"]')
        }else{
            await fillInput(page,'input[name="applicant.father.currentLocation"]', `${fatherCurrentCity}, ${fatherCurrentCountry}`);
        }
    
        await nextClick(page);
    
        const haveSiblings = inputs.find(input => input.TituloPagina === '¿Tienes hermano(a)s?' && input.Pagina == 79).Nombre;
        console.log(haveSiblings)
        if(haveSiblings == "SI"){
            await sleep(3000)
            const buttonAddSibling = await page.locator('[id="add_button"]').waitHandle();
            await buttonAddSibling.click()
            await sleep(1000)
    
            const siblingFirstName =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Primer Nombre " && input.Pagina == 80).Valor;
            const siblingSecondName =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Segundo Nombre" && input.Pagina == 80).Valor;
            const siblingLastNames =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Apellidos " && input.Pagina == 80).Valor;
            let siblingCountryBorn =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Ciudad donde nacio" && input.Pagina == 80).Valor;
            const siblingCityBorn =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Pais donde nacio" && input.Pagina == 80).Valor;
            const siblingCurrentCity =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Ciudad donde vide actualmente" && input.Pagina == 80).Valor;
            const siblingCurrentCountry =  inputs.find(input => input.TituloPagina === 'Por favor coloca la información de tus hermano(a)' && input.Nombre == "Pais donde vive actualmente" && input.Pagina == 80).Valor;
    
            await fillInput(page,'input[name="applicant.siblings.0.name.firstName"]', siblingFirstName);
            await fillInput(page,'input[name="applicant.siblings.0.name.middleName"]', siblingSecondName);
            await fillInput(page,'input[name="applicant.siblings.0.name.lastName"]', siblingLastNames);
            await fillInput(page,'input[name="applicant.siblings.0.placeOfBirth"]', siblingCityBorn);
    
            siblingCountryBorn = siblingCountryBorn.charAt(0).toUpperCase() + siblingCountryBorn.slice(1);
            siblingCountryBorn = siblingCountryBorn.replace(/ /g, '');
    
            await clickInput(page, 'input[name="applicant.siblings.0.countryOfBirth"]');
        
            await page.type('input[name="applicant.siblings.0.countryOfBirth"]', siblingCountryBorn);
    
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            if (siblingCurrentCity.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i) || siblingCurrentCountry.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i)) {
                await clickInput(page, 'input[name="applicant.siblings.0.noCurrentLocation"]')
            }
    
            await sleep(3000);

            let buttonSendSibling;
            try {
                buttonSendSibling = await page.locator('#table-submit-button').waitHandle({ timeout: 3000 });
            } catch (e) {
                console.log('No se encontró el botón por id, intentando por texto...');
                try {
                    buttonSendSibling = await page.locator('button:has-text("Save sibling")').waitHandle({ timeout: 3000 });
                } catch (e) {
                    console.log('No se encontró el botón por texto, continuando...');
                }
            }

            if (buttonSendSibling) {
                await buttonSendSibling.click();
            }

            await sleep(1000);

            const anotherSibling = inputs.find(input => input.TituloPagina === '¿Tienes otro hermano(a)?' && input.Pagina == 81).Nombre;
            console.log({ anotherSibling });
            await nextClick(page);
            //if(anotherSibling === "SI"){
            //
            //    await sleep(2000)
            //    const buttonAddSibling = await page.locator('[id="add_button"]').waitHandle();
            //    await buttonAddSibling.click()
            //    await sleep(1000)
            //
            //    const siblingFirstName2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Primer Nombre" && input.Pagina == 82).Valor;
            //    const siblingSecondName2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Segundo Nombre" && input.Pagina == 82).Valor;
            //    const siblingLastNames2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Apellidos" && input.Pagina == 82).Valor;
            //    let siblingCountryBorn2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Ciudad donde nacio" && input.Pagina == 82).Valor;
            //    const siblingCityBorn2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Pais donde nacio" && input.Pagina == 82).Valor;
            //    const siblingCurrentCity2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Ciudad donde vide actualmente " && input.Pagina == 82).Valor;
            //    const siblingCurrentCountry2 =  inputs.find(input => input.TituloPagina === 'Por favor coloca la informacion de tus hermano(a)s' && input.Nombre == "Pais donde vive actualmente" && input.Pagina == 82).Valor;
            //
            //    await fillInput(page,'input[name="applicant.siblings.1.name.firstName"]', siblingFirstName2);
            //    await fillInput(page,'input[name="applicant.siblings.1.name.middleName"]', siblingSecondName2);
            //    await fillInput(page,'input[name="applicant.siblings.1.name.lastName"]', siblingLastNames2);
            //    await fillInput(page,'input[name="applicant.siblings.1.placeOfBirth"]', siblingCityBorn2);
            //
            //    siblingCountryBorn2 = siblingCountryBorn2.charAt(0).toUpperCase() + siblingCountryBorn2.slice(1);
            //    siblingCountryBorn2 = siblingCountryBorn2.replace(/ /g, '');
            //    
            //    await clickInput(page, 'input[name="applicant.siblings.1.countryOfBirth"]');
            //
            //    await page.type('input[name="applicant.siblings.1.countryOfBirth"]', siblingCountryBorn2);
            //
            //    await page.keyboard.press('ArrowDown');
            //    await page.keyboard.press('Enter');
            //
            //    if (siblingCurrentCity2.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i) || siblingCurrentCountry2.trim().match(/Fallecid[oa]|Falleci[óo]|Muert[oa]/i)) {
            //        await clickInput(page, 'input[name="applicant.siblings.1.noCurrentLocation"][value="false"]')
            //    }
            //
            //    await sleep(3000)
            //    const buttonSendSibling = await page.locator('[id="table-submit-button"]').waitHandle();
            //    await buttonSendSibling.click()
            //    await sleep(1000)
            //}
        }else{
            await nextClick(page);
        }

    
        await clickInput(page, 'input[name="eligibility.reasonForAsylum.conventionAgainstTorture"][value="true"]')
        
        const typeOfAsylum = inputs.find(input => input.TituloPagina === '¿A que tipo de asilo estas aplicando?' && input.Pagina == 102).Nombre;
        console.log(typeOfAsylum)
        if(typeOfAsylum === "RACIAL"){
            await clickInput(page, 'input[name="race"]')
        }
        if(typeOfAsylum === "OPINIÓN POLITICA"){
            await clickInput(page, 'input[name="politicalOpinion"]')
        }
        if(typeOfAsylum === "RELIGIÓN"){
            await clickInput(page, 'input[name="religion"]')
        }
        if(typeOfAsylum === "MIEMBRO DE UN GRUPO SOCIAL EN PARTICULAR"){
            await clickInput(page, 'input[name="membershipSocialGroup"]')
        }
        if(typeOfAsylum === "NACIONALIDAD"){
            await clickInput(page, 'input[name="nationality"]')
        }
        if(typeOfAsylum === "CONVENCIÓN SOBRE LA TORTURA"){
            await clickInput(page, 'input[name="tortureConvention"]')
        }
    
        const familyExperiencedPersecution = inputs.find(input => input.TituloPagina === 'Tus familiares o tu alguna vez han  recibido algun tipo de persecusion en tu pais de origen ' && input.Pagina == 93).Nombre;
    
        if(familyExperiencedPersecution === "Si "){
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.experiencedMistreatment.question"][value="true"]')
            await sleep(2000)
    
            const familyExperiencedPersecutionReason = inputs.find(input => input.TituloPagina === 'Explica la razón' && input.Pagina == 94).Valor;
    
            await fillInput(page,'input[name="eligibility.reasonForAsylum.experiencedMistreatment.additionalExplanation"]', familyExperiencedPersecutionReason);
        }else{
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.experiencedMistreatment.question"][value="false"]')
        }
        
        const fearOfTorture = inputs.find(input => input.TituloPagina === 'Tienes miedo a que te torturen en tu pais de origen ? ' && input.Pagina == 95).Nombre;
        
        if(fearOfTorture === "Si "){
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.fearMistreatment.question"][value="true"]')
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.afraidOfTorture.question"][value="true"]')
            
            const fearOfTortureReason = inputs.find(input => input.TituloPagina === 'Explica la razón' && input.Pagina == 96).Valor;
            await sleep(2000)
            
            await fillInput(page,'input[name="eligibility.reasonForAsylum.fearMistreatment.additionalExplanation"]', fearOfTortureReason);
            await fillInput(page,'input[name="eligibility.reasonForAsylum.afraidOfTorture.additionalExplanation"]', fearOfTortureReason);
            
        }else{
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.fearMistreatment.question"][value="false"]')
            await clickInput(page, 'input[name="eligibility.reasonForAsylum.afraidOfTorture.question"][value="false"]')
        }
        
        await nextClick(page);
        
        const partOfPoliticalGroup = inputs.find(input => input.TituloPagina === 'Alguna vez has pertenecido a algun partido politico, organización sindical, periodistas, las fuerzas militares?' && input.Pagina == 87).Nombre;
        if(partOfPoliticalGroup === "SI"){
            await clickInput(page, 'input[name="eligibility.associationGroups.haveYouOrFamilyMemberAssociatedToGroups.question"][value="true"]')
    
            const partOfPoliticalGroupReason = inputs.find(input => input.TituloPagina === 'Por favor explique' && input.Pagina == 88).Valor;
            await sleep(2000)
            fillInput(page,'input[name="eligibility.associationGroups.haveYouOrFamilyMemberAssociatedToGroups.additionalExplanation"]', partOfPoliticalGroupReason)
            inputReason.fill(partOfPoliticalGroupReason)
        }else{
            await clickInput(page, 'input[name="eligibility.associationGroups.haveYouOrFamilyMemberAssociatedToGroups.question"][value="false"]')
        }
        
        await nextClick(page);
        await clickInput(page, 'input[name="eligibility.additionalInformationForEligibility.yourOrFamilyCriminalHistory.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.additionalInformationForEligibility.yourOrFamilyCriminalHistoryInUs.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.additionalInformationForEligibility.yourOrFamilyCauseSufferOrHarm.question"][value="false"]')
        
        await nextClick(page);
        
        await clickInput(page, 'input[name="eligibility.applicationHistory.previousAsylumApplication.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.applicationHistory.filingOneYearAfterLastArrival.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.applicationHistory.travelThroughOtherCountries.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.applicationHistory.lawfulStatusInOtherCountry.question"][value="false"]')
        await clickInput(page, 'input[name="eligibility.applicationHistory.returnToHomeCountry.question"][value="false"]')
    
        await nextClick(page);
    

    }catch(error){
        console.log(error)
    }
} 


module.exports = startAsylum;