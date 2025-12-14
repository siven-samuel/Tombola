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

// Výpočet výsledku
function calculateResult() {
    // Kontrola presných kombinácií podľa tabuliek
    
    // DIAMANT - Kombinačné pravidlá
    if (
        (answers.q1 === 'nadcasova' && answers.q2 === 'jasna' && answers.q3 === 'kvetinova' && answers.q5 === 'prilakat') ||
        (answers.q1 === 'nadcasova' && answers.q2 === 'jasna' && answers.q3 === 'cista' && answers.q5 === 'elegantne') ||
        (answers.q1 === 'moderna' && answers.q2 === 'jasna' && answers.q3 === 'kvetinova' && answers.q5 === 'luxus') ||
        (answers.q1 === 'minimalisticka' && answers.q2 === 'jasna' && answers.q3 === 'cista' && answers.q5 === 'elegantne')
    ) {
        calculatedStone = 'diamant';
        return;
    }

    // LONDON BLUE TOPAZ - Kombinačné pravidlá
    if (
        (answers.q1 === 'minimalisticka' && answers.q2 === 'hlbava' && answers.q3 === 'citrusova' && answers.q5 === 'elegantne') ||
        (answers.q1 === 'minimalisticka' && answers.q2 === 'hlbava' && answers.q3 === 'drevita' && answers.q5 === 'jemne') ||
        (answers.q1 === 'nadcasova' && answers.q2 === 'hlbava' && answers.q3 === 'drevita' && answers.q5 === 'elegantne') ||
        (answers.q1 === 'mysteriozna' && answers.q2 === 'hlbava' && answers.q3 === 'citrusova' && answers.q5 === 'elegantne')
    ) {
        calculatedStone = 'topaz';
        return;
    }

    // BIELA PERLA - Kombinačné pravidlá
    if (
        (answers.q1 === 'romanticka' && answers.q2 === 'jemna' && answers.q3 === 'kvetinova') ||
        (answers.q1 === 'romanticka' && answers.q2 === 'laskava' && answers.q3 === 'kvetinova' && answers.q5 === 'jemne') ||
        (answers.q1 === 'nadcasova' && answers.q2 === 'jemna' && answers.q3 === 'kvetinova' && answers.q5 === 'elegantne') ||
        (answers.q1 === 'minimalisticka' && answers.q2 === 'jemna' && answers.q3 === 'kvetinova' && answers.q5 === 'jemne')
    ) {
        calculatedStone = 'biela-perla';
        return;
    }

    // ČIERNA PERLA - Kombinačné pravidlá
    if (
        (answers.q1 === 'mysteriozna' && answers.q2 === 'temna' && answers.q3 === 'orientalna' && answers.q5 === 'tajomstvo') ||
        (answers.q1 === 'mysteriozna' && answers.q2 === 'zvodna' && answers.q3 === 'orientalna' && answers.q5 === 'luxus') ||
        (answers.q1 === 'odvazna' && answers.q2 === 'temna' && answers.q3 === 'orientalna' && answers.q5 === 'tajomstvo') ||
        (answers.q1 === 'minimalisticka' && answers.q2 === 'temna' && answers.q3 === 'orientalna' && answers.q5 === 'tajomstvo')
    ) {
        calculatedStone = 'cierna-perla';
        return;
    }

    // TANZANIT - Kombinačné pravidlá
    if (
        (answers.q1 === 'odvazna' && answers.q2 === 'zvodna' && answers.q3 === 'orientalna' && answers.q5 === 'prilakat') ||
        (answers.q1 === 'odvazna' && answers.q2 === 'zvodna' && answers.q3 === 'drevita' && answers.q5 === 'luxus') ||
        (answers.q1 === 'mysteriozna' && answers.q2 === 'zvodna' && answers.q3 === 'orientalna' && answers.q5 === 'luxus') ||
        (answers.q1 === 'moderna' && answers.q2 === 'zvodna' && answers.q3 === 'orientalna' && answers.q5 === 'prilakat')
    ) {
        calculatedStone = 'tanzanit';
        return;
    }

    // MORGANIT - Kombinačné pravidlá
    if (
        (answers.q1 === 'moderna' && answers.q2 === 'laskava' && answers.q3 === 'kvetinova') ||
        (answers.q1 === 'romanticka' && answers.q2 === 'laskava' && answers.q3 === 'kvetinova' && answers.q5 === 'jemne') ||
        (answers.q1 === 'romanticka' && answers.q2 === 'jemna' && answers.q3 === 'cista') ||
        (answers.q1 === 'minimalisticka' && answers.q2 === 'laskava' && answers.q3 === 'kvetinova' && answers.q5 === 'elegantne')
    ) {
        calculatedStone = 'morganit';
        return;
    }

    // Ak žiadna kombinácia nepasuje, použiť default
    calculatedStone = 'diamant';
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
        
        // Použitie FormData pre správne odoslanie do Google Apps Script
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        }).then(response => {
            console.log('Dáta odoslané!');
        }).catch(error => {
            console.log('Fetch dokončený');
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
