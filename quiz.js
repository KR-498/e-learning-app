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

// Inicjalizacja quizu
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    showQuestion();
}

// Wyświetlanie pytania
function showQuestion() {
    resetState();
    const currentQuestion = quizData[currentQuestionIndex];
    
    // Aktualizacja tekstu pytania i postępu
    questionElement.textContent = currentQuestion.question;
    progressText.textContent = `Pytanie ${currentQuestionIndex + 1} z ${quizData.length}`;

    // Generowanie przycisków z odpowiedziami
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        answersContainer.appendChild(button);
    });
}

// Resetowanie stanu przed nowym pytaniem
function resetState() {
    nextBtn.disabled = true;
    while (answersContainer.firstChild) {
        answersContainer.removeChild(answersContainer.firstChild);
    }
}

// Obsługa wyboru odpowiedzi
function selectAnswer(selectedIndex, selectedButton) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = answersContainer.querySelectorAll('.answer-btn');

    // Sprawdzenie czy odpowiedź jest poprawna
    if (selectedIndex === currentQuestion.correct) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // Pokazanie użytkownikowi, która odpowiedź była prawidłowa
        allButtons[currentQuestion.correct].classList.add('correct');
    }

    // Zablokowanie ponownego klikania w tym pytaniu
    allButtons.forEach(button => button.disabled = true);
    nextBtn.disabled = false;
}

// Obsługa przejścia do następnego pytania lub wyniku
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
});

// Wyświetlenie podsumowania
function showResults() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    
    scoreValue.textContent = score;
    totalValue.textContent = quizData.length;

    // Prosty feedback zależny od wyniku
    const percentage = (score / quizData.length) * 100;
    if (percentage === 100) {
        feedbackMessage.textContent = "Doskonale! Jesteś mistrzem Kotlina! 🚀";
    } else if (percentage >= 50) {
        feedbackMessage.textContent = "Dobra robota! Masz solidne podstawy. 👍";
    } else {
        feedbackMessage.textContent = "Musisz jeszcze trochę poćwiczyć. Spróbuj ponownie! 📚";
    }
}

// Restart quizu
restartBtn.addEventListener('click', startQuiz);

// Uruchomienie na starcie
startQuiz();