// Google Apps Script pre Panak's Dotazník - Tombola
// 
// NÁVOD NA INŠTALÁCIU:
// 1. Otvor Google Sheet: https://docs.google.com/spreadsheets/d/1RxLmDBFtVDD5ppwMfrzlegVXdht1u8M-NlqAukPybw8/edit
// 2. Klikni na Rozšírenia > Apps Script
// 3. Vymaž všetko čo tam je a vlož tento kód
// 4. Klikni na "Nasadiť" > "Nové nasadenie"
// 5. Typ: "Webová aplikácia"
// 6. Spustiť ako: "Ja"
// 7. Kto má prístup: "Ktokoľvek"
// 8. Klikni "Nasadiť" a skopíruj URL
// 9. Vlož URL do script.js (SCRIPT_URL premenná)

function doPost(e) {
  try {
    // Získaj aktívny sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form_Responses');
    
    // Ak sheet neexistuje, použi prvý sheet
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    
    // Parsuj JSON dáta - môže prísť ako parameter alebo v postData
    var data;
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('Žiadne dáta neboli prijaté');
    }
    
    // Vytvor časovú pečiatku
    var timestamp = new Date().toLocaleString('sk-SK', {
      timeZone: 'Europe/Bratislava',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Mapovanie hodnôt na slovenské názvy
    var stylMap = {
      'nadcasova': 'Nadčasová elegancia',
      'minimalisticka': 'Minimalistický chic',
      'romanticka': 'Romantická jemnosť',
      'odvazna': 'Odvážna a výrazná',
      'mysteriozna': 'Mysteriózna a sofistikovaná',
      'moderna': 'Moderná, jemne glamour'
    };
    
    var energiaMap = {
      'jasna': 'Jasná a žiarivá',
      'hlbava': 'Hĺbavá a pokojná',
      'jemna': 'Jemná a harmonická',
      'temna': 'Temná, no krásna',
      'zvodna': 'Zvodná a magická',
      'laskava': 'Láskavá a nežná'
    };
    
    var vonaMap = {
      'kvetinova': 'Kvetinová',
      'citrusova': 'Citrusovo svieža',
      'drevita': 'Drevito teplá',
      'orientalna': 'Orientálna / ambrová',
      'cista': 'Čistá „skin scent"'
    };
    
    var farbaMap = {
      'jarny': 'Jarný',
      'letny': 'Letný',
      'jesenny': 'Jesenný',
      'zimny': 'Zimný'
    };
    
    var sperkMap = {
      'jemne': 'Jemne zvýrazniť moju prirodzenú krásu',
      'prilakat': 'Prilákať pozornosť a zažiariť',
      'elegantne': 'Pôsobiť elegantne a vyrovnane',
      'tajomstvo': 'Pridať trochu tajomstva a hĺbky',
      'luxus': 'Vyvolať pocit luxusu a výnimočnosti'
    };
    
    var vysledokMap = {
      'diamant': 'Diamant',
      'topaz': 'London Blue Topaz',
      'biela-perla': 'Biela perla',
      'cierna-perla': 'Čierna perla',
      'tanzanit': 'Tanzanit',
      'morganit': 'Morganit'
    };
    
    // Priprav riadok dát
    var rowData = [
      timestamp,                                    // A: Časová pečiatka
      data.name || '',                              // B: Meno
      data.email || '',                             // C: Email
      stylMap[data.q1] || data.q1 || '',           // D: Tvoj štýl
      energiaMap[data.q2] || data.q2 || '',        // E: Tvoja energia
      vonaMap[data.q3] || data.q3 || '',           // F: Tvoja vôňa
      farbaMap[data.q4] || data.q4 || '',          // G: Tvoja Farba
      sperkMap[data.q5] || data.q5 || '',          // H: Tvoja energia v šperkoch
      vysledokMap[data.result] || data.result || '' // I: Vysledok
    ];
    
    // Pridaj riadok do sheetu
    sheet.appendRow(rowData);
    
    // Vráť úspešnú odpoveď
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Dáta boli úspešne uložené'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Vráť chybovú odpoveď
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Funkcia pre testovanie GET requestov
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'ok',
      'message': 'Panak\'s Dotazník API je aktívne'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Testovacia funkcia - môžeš spustiť priamo v Apps Script editore
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Používateľ',
        email: 'test@example.com',
        q1: 'nadcasova',
        q2: 'jasna',
        q3: 'kvetinova',
        q4: 'jarny',
        q5: 'elegantne',
        result: 'diamant'
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
