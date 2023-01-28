const axios = require('axios');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdin: input, stdout: output} = require('process');

const rl = readline.createInterface({input, output});

// Задать вопросик
function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();

            return answer;
        });
    });
}

// если профиль скрыт, нужно выводить информацию о том что скрыт
async function getDotabuffPlayerInfo(link) {
    console.log(link);
    const {data} = await axios.get(link);
    // console.log(data)

    // const test = HTMLParser.valid(data)
    const test = HTMLParser.parse(data)
    const section = test.querySelectorAll('tr')

    const testSection = HTMLParser
        .parse(section)
        .structuredText
        .split(',')
        .map(el => el.match(/\d{4}-\d{2}-\d{2}/g))
        .filter(el => el !== null)
        .map(el => el[0])
    console.dir(testSection)


    // получить steamId
    const steamIdIndex = data.indexOf('STEAM_');
    const rawSteamId = data.slice(steamIdIndex, steamIdIndex + 30);
    const steamId = rawSteamId.replace(/<.*/, '');
     // получить винрейт
     const winRateIndex = data.indexOf('<dt>Доля побед</dt>', 0);
     const rawWinRate = data.slice(winRateIndex - 15, winRateIndex);
     const winRate = data.includes('Этот профиль скрыт') ? 'Профиль скрыт' : rawWinRate.replace(/.{0,6}>/, '').replace(/%<.*/, '');
 
     return {steamId, winRate}
 }
 
 getDotabuffPlayerInfo('https://www.dotabuff.com/players/72312627/matches');