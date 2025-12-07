# Návod na nastavenie Google Apps Script

Keďže Google Forms blokuje priame POST requesty kvôli CORS, použijeme Google Apps Script ako backend.

## Kroky:

### 1. Otvor Google Sheets
https://docs.google.com/spreadsheets/d/1F8AbYAu--4GdDhmaC44z1BU96vjybEj0hOmEE7wenOg/edit

### 2. Vytvor Apps Script
- Klikni na **Extensions** → **Apps Script**
- Vymaž existujúci kód
- Vlož tento kód:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Pridaj riadok s dátami
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.result,
      data.q1,
      data.q2,
      data.q3,
      data.q4
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Deploy as Web App
- Klikni **Deploy** → **New deployment**
- Vyber **Web app**
- **Execute as:** Me
- **Who has access:** Anyone
- Klikni **Deploy**
- **Skopíruj Web App URL** (vyzerá ako: `https://script.google.com/macros/s/...`)

### 4. Uprav script.js
Nahraď URL v `script.js` svojou Web App URL z kroku 3.
