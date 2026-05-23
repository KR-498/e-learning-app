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

    // Stan aplikacji
    let currentMode = ''; // 'blocks' lub 'gaps'
    let currentExerciseIndex = 0;

    // --- Baza Danych Ćwiczeń ---
    const blocksData = [
        {
            instruction: "Ułóż poprawną funkcję main, która wypisuje tekst 'Hello World':",
            correctOrder: [
                "fun main() {",
                "    println(\"Hello World\")",
                "}"
            ]
        },
        {
            instruction: "Ułóż funkcję zwracającą kwadrat podanej liczby całkowitej:",
            correctOrder: [
                "fun square(x: Int): Int {",
                "    return x * x",
                "}"
            ]
        }
    ];

    const gapsData = [
        {
            instruction: "Uzupełnij luki słowami kluczowymi tak, aby funkcja zwracała sumę dwóch liczb:",
            // [gap] oznacza miejsce na pole tekstowe input
            template: "[gap] add(a: Int, b: Int): Int {\n    [gap] a + b\n}",
            answers: ["fun", "return"]
        },
        {
            instruction: "Zadeklaruj zmienną modyfikowalną o nazwie 'counter' i przypisz jej wartość 10:",
            template: "[gap] counter = 10",
            answers: ["var"]
        }
    ];

    // --- Obsługa Wyboru Trybu ---
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
        modeSelection.classList.add('hidden');
        exerciseResultBox.classList.add('hidden');
        exerciseBox.classList.remove('hidden');
        loadExercise();
    }

    // --- Ładowanie Zadania ---
    function loadExercise() {
        exerciseFeedback.textContent = '';
        checkBtn.classList.remove('hidden');
        nextExerciseBtn.classList.add('hidden');
        codeWorkspace.innerHTML = '';

        const data = currentMode === 'blocks' ? blocksData : gapsData;
        exerciseProgress.textContent = `Zadanie ${currentExerciseIndex + 1} z ${data.length}`;

        if (currentMode === 'blocks') {
            exerciseTitle.textContent = "Układanie Bloczków";
            const currentData = blocksData[currentExerciseIndex];
            exerciseInstruction.textContent = currentData.instruction;

            // Kopiowanie i mieszanie linii kodu
            let shuffled = [...currentData.correctOrder].sort(() => Math.random() - 0.5);
            
            // Renderowanie interaktywnej listy do przeciągania/przemieszczania kliknięciem
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
                
                // Prosty mechanizm przenoszenia elementu na koniec/początek kliknięciem
                block.addEventListener('click', () => {
                    codeWorkspace.appendChild(block);
                });
                codeWorkspace.appendChild(block);
            });

        } else if (currentMode === 'gaps') {
            exerciseTitle.textContent = "Uzupełnianie Luk";
            const currentData = gapsData[currentExerciseIndex];
            exerciseInstruction.textContent = currentData.instruction;

            // Przekształcanie szablonu z [gap] na pola input HTML
            const parts = currentData.template.split('[gap]');
            const preElement = document.createElement('pre');
            preElement.style.margin = '0';

            parts.forEach((part, index) => {
                preElement.appendChild(document.createTextNode(part));
                if (index < parts.length - 1) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'gap-input';
                    input.style.background = '#1a1a2e';
                    input.style.border = '1px solid #7F52FF';
                    input.style.color = '#fff';
                    input.style.padding = '2px 8px';
                    input.style.fontFamily = 'monospace';
                    input.style.fontSize = '16px';
                    input.style.borderRadius = '4px';
                    input.style.width = '80px';
                    input.style.textAlign = 'center';
                    preElement.appendChild(input);
                }
            });
            codeWorkspace.appendChild(preElement);
        }
    }

    // --- Weryfikacja Odpowiedzi ---
    checkBtn.addEventListener('click', () => {
        if (currentMode === 'blocks') {
            const currentData = blocksData[currentExerciseIndex];
            const currentBlocks = codeWorkspace.querySelectorAll('div');
            
            let isCorrect = true;
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
                checkBtn.classList.add('hidden');
                nextExerciseBtn.classList.remove('hidden');
            } else {
                exerciseFeedback.textContent = "Niestety, kolejność linii jest błędna. Spróbuj zmienić układ! ❌";
                exerciseFeedback.style.color = '#dc3545';
            }

        } else if (currentMode === 'gaps') {
            const currentData = gapsData[currentExerciseIndex];
            const inputs = codeWorkspace.querySelectorAll('.gap-input');
            
            let isCorrect = true;
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
                checkBtn.classList.add('hidden');
                nextExerciseBtn.classList.remove('hidden');
            } else {
                exerciseFeedback.textContent = "Niektóre słowa kluczowe są błędne. Popraw je! ❌";
                exerciseFeedback.style.color = '#dc3545';
            }
        }
    });

    // --- Przejście Dalej ---
    nextExerciseBtn.addEventListener('click', () => {
        currentExerciseIndex++;
        const data = currentMode === 'blocks' ? blocksData : gapsData;
        
        if (currentExerciseIndex < data.length) {
            loadExercise();
        } else {
            exerciseBox.classList.add('hidden');
            exerciseResultBox.classList.remove('hidden');
        }
    });
});