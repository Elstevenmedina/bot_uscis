const phoneInputField = document.querySelector("#phone");
const info = document.querySelector(".alert-info");

 function getIp(callback) {
     fetch('https://ipinfo.io/json?token=adf9442d94de78', { headers: { 'Accept': 'application/json' }})
     .then((resp) => resp.json())
     .catch(() => {
         return {
             country: 'us',
         };
     })
     .then((resp) => callback(resp.country));
 }

 const phoneInput = window.intlTelInput(phoneInputField, {
     preferredCountries: ["us", "ve", "mx", "co", ],
     initialCountry: "auto",
     geoIpLookup: getIp,
     utilsScript:
     "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
 });
