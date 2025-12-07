// Uloženie odpovedí a výsledku
const answers = {
    q1: null,
    q2: null,
    q3: null,
    q4: null
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
    const allAnswered = Object.values(answers).every(answer => answer !== null);
    submitBtn.disabled = !allAnswered;
}

// Výpočet výsledku
function calculateResult() {
    const scores = {
        diamant: 0,
        topaz: 0,
        'biela-perla': 0,
        'cierna-perla': 0,
        tanzanit: 0,
        morganit: 0
    };

    // LOGIKA PRE DIAMANT
    if (answers.q1 === 'nadcasova') scores.diamant += 2;
    if (answers.q2 === 'jasna') scores.diamant += 2;
    if (answers.q3 === 'kvetinova' || answers.q3 === 'cista') scores.diamant += 1;
    if (answers.q4 === 'diamant') scores.diamant += 3;

    // LOGIKA PRE LONDON BLUE TOPAZ
    if (answers.q1 === 'minimalisticka') scores.topaz += 2;
    if (answers.q2 === 'hlbava') scores.topaz += 2;
    if (answers.q3 === 'citrusova' || answers.q3 === 'drevita') scores.topaz += 1;
    if (answers.q4 === 'topaz') scores.topaz += 3;

    // LOGIKA PRE BIELA PERLA
    if (answers.q1 === 'romanticka') scores['biela-perla'] += 2;
    if (answers.q2 === 'jemna') scores['biela-perla'] += 2;
    if (answers.q3 === 'kvetinova') scores['biela-perla'] += 1;
    if (answers.q4 === 'biela-perla') scores['biela-perla'] += 3;

    // LOGIKA PRE ČIERNA PERLA
    if (answers.q1 === 'mysteriozna') scores['cierna-perla'] += 2;
    if (answers.q2 === 'temna') scores['cierna-perla'] += 2;
    if (answers.q3 === 'orientalna') scores['cierna-perla'] += 1;
    if (answers.q4 === 'cierna-perla') scores['cierna-perla'] += 3;

    // LOGIKA PRE TANZANIT
    if (answers.q1 === 'odvazna') scores.tanzanit += 2;
    if (answers.q2 === 'zvodna') scores.tanzanit += 2;
    if (answers.q3 === 'orientalna' || answers.q3 === 'drevita') scores.tanzanit += 1;
    if (answers.q4 === 'tanzanit') scores.tanzanit += 3;

    // LOGIKA PRE MORGANIT
    if (answers.q1 === 'moderna') scores.morganit += 2;
    if (answers.q2 === 'laskava') scores.morganit += 2;
    if (answers.q3 === 'kvetinova' || answers.q3 === 'cista') scores.morganit += 1;
    if (answers.q4 === 'morganit') scores.morganit += 3;

    // Nájdi kameň s najvyšším skóre
    let maxScore = 0;
    let resultStone = '';

    for (const [stone, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            resultStone = stone;
        }
    }

    // Ak žiadny kameň nebol vybraný (všetky skóre sú 0), použij intuitívny výber
    if (maxScore === 0) {
        resultStone = answers.q4;
    }

    // Ulož výsledok
    calculatedStone = resultStone;
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
        q4: answers.q4
    };

    try {
        // Google Apps Script Web App URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybVxpayPfPpNyT20pVj3eNtwCJEegRhAPwe3HaPS67PUmEfVT6uRxLLKUx3hM9cusv/exec';
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('Dáta úspešne odoslané!');
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
