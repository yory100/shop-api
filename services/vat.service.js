const fetchUrl = require('fetch').fetchUrl;

module.exports = function vatService(code) {
  return new Promise((resolve, reject) => {
    if (!code) reject('Vat service needs country code.');

    fetchUrl('https://euvatrates.com/rates.json', (error, meta, body) => {
      if(error) reject(error);

      const rates = JSON.parse(body).rates;
      let standardRate;

      if (rates) {
        rates[code] 
          && rates[code]['standard_rate'] 
            && (standardRate = parseInt(rates[code]['standard_rate']));
      }

      standardRate 
        ? resolve(1 + (standardRate / 100))
        : resolve();
    });
  })
}