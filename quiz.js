document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            question: "Które słowo kluczowe służy do deklaracji zmiennej tylko do odczytu (stałej) w Kotlinie?",
            answers: ["var", "val", "const var", "let"],
            correct: 1
        },
        {
            question: "Jak Kotlin radzi sobie domyślnie z problemem NullPointerException?",
            answers: [
                "Wymaga bloku try-catch dla każdej zmiennej",
                "Typy są domyślnie nie-nullowalne (non-nullable)",
                "Ignoruje błędy i zwraca 0",
                "Nie pozwala na używanie wartości null w ogóle"
            ],
            correct: 1
        },
        {
            question: "Jak poprawnie stworzyć funkcję w języku Kotlin?",
            answers: [
                "void myFunction() {}",
                "function myFunction() {}",
                "fun myFunction() {}",
                "def myFunction() {}"
            ],
            correct: 2
        },
        {
            question: "Do czego służy operator '?.' (Safe Call Operator) w Kotlinie?",
            answers: [
                "Do rzutowania obiektów na inny typ",
                "Do bezpiecznego wywołania metody na obiekcie, który może być nullem",
                "Do sprawdzenia, czy dwie zmienne są równe",
                "Do wymuszenia zgłoszenia wyjątku NullPointerException"
            ],
            correct: 1
        },
        {
            question: "Które słowo kluczowe w Kotlinie zastępuje tradycyjną instrukcję 'switch' znaną z Javy czy C++?",
            answers: ["choose", "match", "select", "when"],
            correct: 3
        },
        {
            question: "Co automatycznie generuje słowo kluczowe 'data' przed deklaracją klasy (data class)?",
            answers: [
                "Interfejs użytkownika dla tej klasy",
                "Metody toString(), equals(), hashCode() oraz copy()",
                "Połączenie z bazą danych SQL",
                "Metody asynchroniczne dla wątków"
            ],
            correct: 1
        },
        {
            question: "Jak działa funkcja 'Smart Cast' (inteligentne rzutowanie) w Kotlinie?",
            answers: [
                "Użytkownik musi ręcznie rzutować każdy obiekt za pomocą operatora 'as'",
                "Kompilator automatycznie rzutuje zmienną po sprawdzeniu jej typu operatorem 'is'",
                "Automatycznie zmienia typy tekstowe na liczbowe",
                "Losowo wybiera najlepszy typ dla zmiennej podczas uruchomienia"
            ],
            correct: 1
        },
        {
            question: "Która z poniższych kolekcji w Kotlinie jest domyślnie niemodyfikowalna (read-only)?",
            answers: [
                "ArrayList",
                "MutableList",
                "Wynik funkcji listOf()",
                "Wynik funkcji mutableListOf()"
            ],
            correct: 2
        },
        {
            question: "Jak poprawnie połączyć dwa ciągi znaków (String) za pomocą String Templates?",
            answers: [
                "val s = \"Witaj \" + name",
                "val s = \"Witaj $name\"",
                "val s = \"Witaj %name\"",
                "val s = \"Witaj {name}\""
            ],
            correct: 1
        },
        {
            question: "Do czego służy operator '?:' (tzw. Elvis Operator)?",
            answers: [
                "Służy do tworzenia pętli nieskończonej",
                "Zwraca wartość po prawej stronie, jeśli wartość po lewej jest nullem",
                "Służy do porównywania referencji obiektów",
                "Pozwala na deklarację funkcji anonimowej"
            ],
            correct: 1
        },
        {
            question: "Jaki jest domyślny typ zwracany przez funkcję, która nie zwraca żadnej użytecznej wartości?",
            answers: ["Void", "Null", "Nothing", "Unit"],
            correct: 3
        },
        {
            question: "Które słowo kluczowe pozwala na rozszerzenie istniejącej klasy o nową funkcjonalność bez dziedziczenia po niej?",
            answers: [
                "Nie ma takiego słowa, tworzy się tzw. Extension Functions (funkcje rozszerzające)",
                "extend",
                "inherits",
                "plus"
            ],
            correct: 0
        },
        {
            question: "Które słowo kluczowe służy do deklaracji zmiennej, której inicjalizacja zostanie odłożona na później?",
            answers: ["lazy", "later", "lateinit", "postpone"],
            correct: 2
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    // Pobieranie elementów DOM
    const quizBox = document.getElementById('quizBox');
    const resultBox = document.getElementById('resultBox');
    const questionElement = document.getElementById('questionElement');
    const answersContainer = document.getElementById('answersContainer');
    const progressText = document.getElementById('progressText');
    const nextBtn = document.getElementById('nextBtn');
    const scoreValue = document.getElementById('scoreValue');
    const totalValue = document.getElementById('totalValue');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const restartBtn = document.getElementById('restartBtn');

    // Dynamiczne generowanie elementów oceniania
    let percentageSpan = document.getElementById('quizPercentage');
    let gradeBadge = document.getElementById('quizGradeBadge');

    if (!percentageSpan && scoreValue) {
        percentageSpan = document.createElement('span');
        percentageSpan.id = 'quizPercentage';
        scoreValue.parentElement.appendChild(document.createTextNode(' ('));
        scoreValue.parentElement.appendChild(percentageSpan);
        scoreValue.parentElement.appendChild(document.createTextNode(')'));
    }

    if (!gradeBadge && feedbackMessage) {
        gradeBadge = document.createElement('div');
        gradeBadge.id = 'quizGradeBadge';
        gradeBadge.style.display = 'inline-block';
        gradeBadge.style.padding = '10px 25px';
        gradeBadge.style.color = '#fff';
        gradeBadge.style.fontSize = '24px';
        gradeBadge.style.fontWeight = 'bold';
        gradeBadge.style.borderRadius = '50px';
        gradeBadge.style.marginBottom = '20px';
        feedbackMessage.parentNode.insertBefore(gradeBadge, feedbackMessage);
    }
     // Inicjalizacja quizu
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        if (resultBox) resultBox.classList.add('hidden');
        if (quizBox) quizBox.classList.remove('hidden');
        showQuestion();
    }

    // Wyświetlanie pytania
    function showQuestion() {
        resetState();
        const currentQuestion = quizData[currentQuestionIndex];
        
        if (questionElement) questionElement.textContent = currentQuestion.question;
        if (progressText) progressText.textContent = `Pytanie ${currentQuestionIndex + 1} z ${quizData.length}`;

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(index, button));
            if (answersContainer) answersContainer.appendChild(button);
        });
    }

    // Resetowanie stanu przed nowym pytaniem
    function resetState() {
        if (nextBtn) nextBtn.disabled = true;
        if (answersContainer) {
            while (answersContainer.firstChild) {
                answersContainer.removeChild(answersContainer.firstChild);
            }
        }
    }

    // Obsługa wyboru odpowiedzi
    function selectAnswer(selectedIndex, selectedButton) {
        const currentQuestion = quizData[currentQuestionIndex];
        if (!answersContainer) return;
        const allButtons = answersContainer.querySelectorAll('.answer-btn');

        if (selectedIndex === currentQuestion.correct) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('wrong');
            if (allButtons[currentQuestion.correct]) {
                allButtons[currentQuestion.correct].classList.add('correct');
            }
        }

        allButtons.forEach(button => button.disabled = true);
        if (nextBtn) nextBtn.disabled = false;
    }

    // Obsługa przejścia dalej
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                showQuestion();
            } else {
                showResults();
            }
        });
    }

    // Wyświetlenie podsumowania z oceną szkolną
    function showResults() {
        if (quizBox) quizBox.classList.add('hidden');
        if (resultBox) resultBox.classList.remove('hidden');
        
        if (scoreValue) scoreValue.textContent = score;
        if (totalValue) totalValue.textContent = quizData.length;

        const percentage = Math.round((score / quizData.length) * 100);
        if (percentageSpan) percentageSpan.textContent = `${percentage}%`;

        let grade = 1;
        let message = '';
        let badgeColor = '#dc3545';

        if (percentage === 100) {
            grade = 6;
            message = "Doskonale! Jesteś absolutnym mistrzem języka Kotlin! 🚀";
            badgeColor = '#28a745';
        } else if (percentage >= 85) {
            grade = 5;
            message = "Wspaniały wynik! Masz bardzo głęboką wiedzę o języku. 👍";
            badgeColor = '#218838';
        } else if (percentage >= 70) {
            grade = 4;
            message = "Dobra robota! Solidny poziom, znasz najważniejsze mechanizmy. 💻";
            badgeColor = '#ffc107';
            if (gradeBadge) gradeBadge.style.color = '#333'; 
        } else if (percentage >= 50) {
            grade = 3;
            message = "Zaliczone! Masz podstawy, ale warto powtórzyć trudniejsze tematy. 📚";
            badgeColor = '#17a2b8';
        } else if (percentage >= 30) {
            grade = 2;
            message = "Słaby wynik. Musisz jeszcze sporo poczytać o bezpiecznych wywołaniach i typach danych. 🔍";
            badgeColor = '#fd7e14';
        } else {
            grade = 1;
            message = "Niestety, musisz jeszcze raz uważnie przestudiować teorię. Spróbuj ponownie! ❌";
            badgeColor = '#dc3545';
        }

        if (gradeBadge) {
            gradeBadge.textContent = `Ocena: ${grade}`;
            gradeBadge.style.backgroundColor = badgeColor;
            if (grade !== 4) gradeBadge.style.color = '#fff';
        }
        
        if (feedbackMessage) feedbackMessage.textContent = message;
    }

    if (restartBtn) restartBtn.addEventListener('click', startQuiz);
    if (quizBox) startQuiz();
});
