document.addEventListener('DOMContentLoaded', () => {
    // Pobieranie elementów DOM
    const modeSelection = document.getElementById('modeSelection');
    const exerciseBox = document.getElementById('exerciseBox');
    const exerciseResultBox = document.getElementById('exerciseResultBox');
    
    const btnBlocksMode = document.getElementById('btnBlocksMode');
    const btnGapsMode = document.getElementById('btnGapsMode');
    
    const exerciseTitle = document.getElementById('exerciseTitle');
    const exerciseProgress = document.getElementById('exerciseProgress');
    const exerciseInstruction = document.getElementById('exerciseInstruction');
    const codeWorkspace = document.getElementById('codeWorkspace');
    const exerciseFeedback = document.getElementById('exerciseFeedback');
    
    const checkBtn = document.getElementById('checkBtn');
    const nextExerciseBtn = document.getElementById('nextExerciseBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const retryExerciseBtn = document.getElementById('retryExerciseBtn');

    // Elementy podsumowania końcowego
    const exerciseScoreValue = document.getElementById('exerciseScoreValue');
    const exerciseTotalValue = document.getElementById('exerciseTotalValue');
    const exercisePercentage = document.getElementById('exercisePercentage');
    const gradeBadge = document.getElementById('gradeBadge');
    const exerciseFeedbackMessage = document.getElementById('exerciseFeedbackMessage');

    // Stan aplikacji
    let currentMode = ''; 
    let currentExerciseIndex = 0;
    let points = 0;
    let alreadyChecked = false;

    // Baza Danych Ćwiczeń
    const blocksData = [
        {
            instruction: "Ułóż poprawną funkcję main, która wypisuje tekst 'Hello World':",
            correctOrder: ["fun main() {", "    println(\"Hello World\")", "}"]
        },
        {
            instruction: "Ułóż funkcję zwracającą kwadrat podanej liczby całkowitej:",
            correctOrder: ["fun square(x: Int): Int {", "    return x * x", "}"]
        }
    ];

    const gapsData = [
        {
            instruction: "Uzupełnij luki słowami kluczowymi tak, aby funkcja zwracała sumę dwóch liczb:",
            template: "[gap] add(a: Int, b: Int): Int {\n    [gap] a + b\n}",
            answers: ["fun", "return"]
        },
        {
            instruction: "Zadeklaruj zmienną modyfikowalną o nazwie 'counter' i przypisz jej wartość 10:",
            template: "[gap] counter = 10",
            answers: ["var"]
        }
    ];
     // Obsługa Wyboru Trybu
    btnBlocksMode.addEventListener('click', () => startExercises('blocks'));
    btnGapsMode.addEventListener('click', () => startExercises('gaps'));
    backToMenuBtn.addEventListener('click', showMenu);
    retryExerciseBtn.addEventListener('click', () => startExercises(currentMode));

    function showMenu() {
        exerciseBox.classList.add('hidden');
        exerciseResultBox.classList.add('hidden');
        modeSelection.classList.remove('hidden');
    }

    function startExercises(mode) {
        currentMode = mode;
        currentExerciseIndex = 0;
        points = 0;
        modeSelection.classList.add('hidden');
        exerciseResultBox.classList.add('hidden');
        exerciseBox.classList.remove('hidden');
        loadExercise();
    }

    // Ładowanie Zadania
    function loadExercise() {
        exerciseFeedback.textContent = '';
        checkBtn.classList.remove('hidden');
        nextExerciseBtn.classList.add('hidden');
        codeWorkspace.innerHTML = '';
        alreadyChecked = false;

        const data = currentMode === 'blocks' ? blocksData : gapsData;
        exerciseProgress.textContent = `Zadanie ${currentExerciseIndex + 1} z ${data.length}`;

        if (currentMode === 'blocks') {
            exerciseTitle.textContent = "Układanie Bloczków";
            const currentData = blocksData[currentExerciseIndex];
            exerciseInstruction.textContent = currentData.instruction;

            let shuffled = [...currentData.correctOrder].sort(() => Math.random() - 0.5);
            
            shuffled.forEach(lineText => {
                const block = document.createElement('div');
                block.textContent = lineText;
                block.style.background = '#34344a';
                block.style.padding = '10px';
                block.style.margin = '8px 0';
                block.style.borderRadius = '4px';
                block.style.cursor = 'pointer';
                block.style.border = '1px solid #555';
                block.style.whiteSpace = 'pre';
                
                block.addEventListener('click', () => {
                    if (!alreadyChecked) codeWorkspace.appendChild(block);
                });
                codeWorkspace.appendChild(block);
            });

        } else if (currentMode === 'gaps') {
            exerciseTitle.textContent = "Uzupełnianie Luk";
            const currentData = gapsData[currentExerciseIndex];
            exerciseInstruction.textContent = currentData.instruction;

            const parts = currentData.template.split('[gap]');
            const preElement = document.createElement('pre');
            preElement.style.margin = '0';

            parts.forEach((part, index) => {
                preElement.appendChild(document.createTextNode(part));
                if (index < parts.length - 1) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'gap-input';
                    preElement.appendChild(input);
                }
            });
            codeWorkspace.appendChild(preElement);
        }
    }
     // Sprawdzanie Wyniku
    checkBtn.addEventListener('click', () => {
        let isCorrect = true;

        if (currentMode === 'blocks') {
            const currentData = blocksData[currentExerciseIndex];
            const currentBlocks = codeWorkspace.querySelectorAll('div');
            
            if (currentBlocks.length !== currentData.correctOrder.length) {
                isCorrect = false;
            } else {
                currentBlocks.forEach((block, idx) => {
                    if (block.textContent !== currentData.correctOrder[idx]) {
                        isCorrect = false;
                    }
                });
            }

            if (isCorrect) {
                exerciseFeedback.textContent = "Doskonale! Kod jest ułożony poprawnie. 🎉";
                exerciseFeedback.style.color = '#28a745';
                if (!alreadyChecked) points++;
                checkBtn.classList.add('hidden');
                nextExerciseBtn.classList.remove('hidden');
            } else {
                exerciseFeedback.textContent = "Niestety, kolejność linii jest błędna. Spróbuj zmienić układ! ❌";
                exerciseFeedback.style.color = '#dc3545';
            }

        } else if (currentMode === 'gaps') {
            const currentData = gapsData[currentExerciseIndex];
            const inputs = codeWorkspace.querySelectorAll('.gap-input');
            
            inputs.forEach((input, idx) => {
                if (input.value.trim() !== currentData.answers[idx]) {
                    isCorrect = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '#28a745';
                }
            });

            if (isCorrect) {
                exerciseFeedback.textContent = "Świetnie! Wpisałeś poprawne słowa kluczowe. 🚀";
                exerciseFeedback.style.color = '#28a745';
                inputs.forEach(input => input.disabled = true);
                if (!alreadyChecked) points++;
                checkBtn.classList.add('hidden');
                nextExerciseBtn.classList.remove('hidden');
            } else {
                exerciseFeedback.textContent = "Niektóre słowa kluczowe są błędne. Popraw je! ❌";
                exerciseFeedback.style.color = '#dc3545';
            }
        }
        alreadyChecked = true;
    });

    // Nawigacja w zadaniach
    nextExerciseBtn.addEventListener('click', () => {
        currentExerciseIndex++;
        const data = currentMode === 'blocks' ? blocksData : gapsData;
        
        if (currentExerciseIndex < data.length) {
            loadExercise();
        } else {
            showSummary(data.length);
        }
    });

    // Ekran Podsumowania i Oceniania
    function showSummary(totalExercises) {
        exerciseBox.classList.add('hidden');
        exerciseResultBox.classList.remove('hidden');

        const percentage = Math.round((points / totalExercises) * 100);
        
        exerciseScoreValue.textContent = points;
        exerciseTotalValue.textContent = totalExercises;
        exercisePercentage.textContent = `${percentage}%`;

        let grade = 1;
        let message = '';
        let badgeColor = '#dc3545';

        if (percentage === 100) {
            grade = 6;
            message = "Genialnie! Jesteś prawdziwym ekspertem od składni Kotlina! 🏆";
            badgeColor = '#28a745';
        } else if (percentage >= 85) {
            grade = 5;
            message = "Bardzo dobrze! Doskonale rozumiesz strukturę funkcji. 🚀";
            badgeColor = '#218838';
        } else if (percentage >= 70) {
            grade = 4;
            message = "Dobry wynik! Większość pojęć masz już opanowaną. 👍";
            badgeColor = '#ffc107';
            gradeBadge.style.color = '#333';
        } else if (percentage >= 50) {
            grade = 3;
            message = "Zaliczone, ale sporo rzeczy wymaga powtórki. Przejrzyj teorię! 📚";
            badgeColor = '#17a2b8';
        } else if (percentage >= 30) {
            grade = 2;
            message = "Ledwo, ledwo. Musisz poświęcić więcej czasu na ćwiczenia. 💻";
            badgeColor = '#fd7e14';
        } else {
            grade = 1;
            message = "Niestety, ten wynik nie gwarantuje zrozumienia tematu. Spróbuj ponownie. ❌";
            badgeColor = '#dc3545';
        }

        gradeBadge.textContent = `Ocena: ${grade}`;
        gradeBadge.style.backgroundColor = badgeColor;
        if (grade !== 4) gradeBadge.style.color = '#fff';
        exerciseFeedbackMessage.textContent = message;
    }
});