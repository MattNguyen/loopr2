export const languages = require('./languages.json');
let languagesArray = new Array();
for(var p in languages){
  languagesArray.push({language: p, value:languages[p]})
}
export {languagesArray}

export const timezones = require('./timezone.json');
let timezoneArray = new Array();
for(var p in timezones){
  timezoneArray.push({timezone: p, principal:timezones[p]})
}
export {timezoneArray}

export const configs = require('./config.json');
export const tokens = require('./tokens.json');

export const wallets = require('./dpath.json');
export const projects = require('./projects.json');

