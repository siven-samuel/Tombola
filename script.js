// Uloženie odpovedí a výsledku
const answers = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
};

let calculatedStone = '';

// Pripojenie event listenerov na všetky tlačidlá
document.addEventListener('DOMContentLoaded', function() {
    const optionButtons = document.querySelectorAll('.option-btn, .image-option-btn');
    const form = document.getElementById('quizForm');
    const submitBtn = document.getElementById('submitBtn');
    const contactForm = document.getElementById('contactForm');

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            const value = this.getAttribute('data-value');

            // Odstráň selected z ostatných tlačidiel v tej istej otázke
            const sameQuestionBtns = document.querySelectorAll(`[data-question="${question}"]`);
            sameQuestionBtns.forEach(btn => btn.classList.remove('selected'));

            // Pridaj selected na kliknuté tlačidlo
            this.classList.add('selected');

            // Ulož odpoveď
            answers[question] = value;

            // Skontroluj, či sú všetky otázky zodpovedané
            checkAllAnswered();
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateResult();
        showUserDataForm();
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitToDatabase();
    });
});

// Kontrola, či sú všetky otázky zodpovedané
function checkAllAnswered() {
    const submitBtn = document.getElementById('submitBtn');
    // Kontrola všetkých 5 otázok
    const allAnswered = answers.q1 && answers.q2 && answers.q3 && answers.q4 && answers.q5;
    submitBtn.disabled = !allAnswered;
}

// Výpočet výsledku pomocou bodového systému
function calculateResult() {
    // Bodový systém pre každý kameň
    const scores = {
        'diamant': 0,
        'topaz': 0,
        'biela-perla': 0,
        'cierna-perla': 0,
        'tanzanit': 0,
        'morganit': 0
    };

    // Q1 - Štýl (q1)
    switch(answers.q1) {
        case 'nadcasova':
            scores['diamant'] += 3;
            scores['biela-perla'] += 2;
            scores['topaz'] += 1;
            break;
        case 'minimalisticka':
            scores['topaz'] += 3;
            scores['diamant'] += 2;
            scores['biela-perla'] += 1;
            break;
        case 'romanticka':
            scores['biela-perla'] += 3;
            scores['morganit'] += 3;
            break;
        case 'odvazna':
            scores['tanzanit'] += 3;
            scores['cierna-perla'] += 2;
            break;
        case 'mysteriozna':
            scores['cierna-perla'] += 3;
            scores['tanzanit'] += 2;
            scores['topaz'] += 1;
            break;
        case 'moderna':
            scores['morganit'] += 2;
            scores['diamant'] += 2;
            scores['tanzanit'] += 1;
            break;
    }

    // Q2 - Energia (q2)
    switch(answers.q2) {
        case 'jasna':
            scores['diamant'] += 3;
            scores['morganit'] += 1;
            break;
        case 'hlbava':
            scores['topaz'] += 3;
            scores['cierna-perla'] += 1;
            break;
        case 'jemna':
            scores['biela-perla'] += 3;
            scores['morganit'] += 2;
            break;
        case 'temna':
            scores['cierna-perla'] += 3;
            scores['tanzanit'] += 1;
            break;
        case 'zvodna':
            scores['tanzanit'] += 3;
            scores['cierna-perla'] += 2;
            break;
        case 'laskava':
            scores['morganit'] += 3;
            scores['biela-perla'] += 2;
            break;
    }

    // Q3 - Vôňa (q3)
    switch(answers.q3) {
        case 'kvetinova':
            scores['biela-perla'] += 2;
            scores['morganit'] += 2;
            scores['diamant'] += 1;
            break;
        case 'citrusova':
            scores['topaz'] += 2;
            scores['diamant'] += 1;
            break;
        case 'drevita':
            scores['topaz'] += 2;
            scores['tanzanit'] += 1;
            break;
        case 'orientalna':
            scores['cierna-perla'] += 3;
            scores['tanzanit'] += 2;
            break;
        case 'cista':
            scores['diamant'] += 2;
            scores['biela-perla'] += 1;
            scores['morganit'] += 1;
            break;
    }

    // Q5 - Čo chceš dosiahnuť (q5)
    switch(answers.q5) {
        case 'jemne':
            scores['biela-perla'] += 2;
            scores['morganit'] += 2;
            break;
        case 'prilakat':
            scores['tanzanit'] += 2;
            scores['diamant'] += 2;
            break;
        case 'elegantne':
            scores['diamant'] += 2;
            scores['topaz'] += 2;
            scores['biela-perla'] += 1;
            break;
        case 'tajomstvo':
            scores['cierna-perla'] += 3;
            scores['tanzanit'] += 1;
            break;
        case 'luxus':
            scores['diamant'] += 2;
            scores['tanzanit'] += 2;
            scores['cierna-perla'] += 1;
            break;
    }

    // Nájdi kameň s najvyšším skóre
    let maxScore = 0;
    let bestStone = 'diamant';
    
    for (const [stone, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestStone = stone;
        }
    }

    calculatedStone = bestStone;
    console.log('Skóre:', scores, 'Výsledok:', calculatedStone);
}

// Zobrazenie formulára pre kontaktné údaje
function showUserDataForm() {
    // Skry dotazník
    document.getElementById('quizForm').style.display = 'none';
    
    // Zobraz formulár na údaje
    const userDataForm = document.getElementById('userDataForm');
    userDataForm.style.display = 'block';
    
    // Scroll na formulár
    userDataForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Odoslanie údajov do databázy
async function submitToDatabase() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const gdprConsent = document.getElementById('gdprConsent').checked;

    if (!gdprConsent) {
        alert('Musíš súhlasiť so spracovaním osobných údajov.');
        return;
    }

    // Priprav dáta
    const data = {
        name: userName,
        email: userEmail,
        result: calculatedStone,
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5
    };

    try {
        // Google Apps Script Web App URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPb4RWxWgn0NG8EzxJ0JzfsoPvVDOrrk-3aVF4XU99fhg0qJISGuYZzIkwntPsX5vf/exec';
        
        // Použitie no-cors režimu pre Google Apps Script (obíde CORS problém)
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'data=' + encodeURIComponent(JSON.stringify(data))
        }).then(() => {
            console.log('Dáta odoslané!');
        }).catch(error => {
            console.log('Fetch dokončený (no-cors)', error);
        });

        // Zobraz výsledok ihneď (nemusíme čakať na odpoveď)
        showResult(calculatedStone, userName, userEmail);
        
    } catch (error) {
        console.error('Chyba:', error);
        // Aj pri chybe zobraz výsledok
        showResult(calculatedStone, userName, userEmail);
    }
}

// Zobrazenie výsledku
function showResult(stone, userName, userEmail) {
    // Skry formulár na údaje
    document.getElementById('userDataForm').style.display = 'none';

    // Zobraz sekciu výsledkov
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';

    // Zobraz správny result card
    const resultCard = document.querySelector(`[data-result="${stone}"]`);
    if (resultCard) {
        resultCard.classList.add('active');
    }

    // Zobraz uložené údaje
    document.getElementById('displayName').textContent = `Meno: ${userName}`;
    document.getElementById('displayEmail').textContent = `Email: ${userEmail}`;

    // Scroll na výsledok
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
