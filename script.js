// Reading Adventures OER Tutorial - Interactive JavaScript

// Global variables
let currentQuestionIndex = 0;
let quizScore = 0;
let totalQuestions = 0;
let quizQuestions = [];

// Alphabet data
const alphabet = [
    { letter: 'A', sound: 'ay', phonetic: '/eɪ/', example: 'Apple', color: '#E74C3C' },
    { letter: 'B', sound: 'buh', phonetic: '/b/', example: 'Ball', color: '#3498DB' },
    { letter: 'C', sound: 'kuh', phonetic: '/k/', example: 'Cat', color: '#F39C12' },
    { letter: 'D', sound: 'duh', phonetic: '/d/', example: 'Dog', color: '#27AE60' },
    { letter: 'E', sound: 'eh', phonetic: '/ɛ/', example: 'Elephant', color: '#9B59B6' },
    { letter: 'F', sound: 'fuh', phonetic: '/f/', example: 'Fish', color: '#E67E22' },
    { letter: 'G', sound: 'guh', phonetic: '/g/', example: 'Goat', color: '#1ABC9C' },
    { letter: 'H', sound: 'huh', phonetic: '/h/', example: 'Hat', color: '#E91E63' },
    { letter: 'I', sound: 'ih', phonetic: '/ɪ/', example: 'Ice', color: '#2196F3' },
    { letter: 'J', sound: 'juh', phonetic: '/dʒ/', example: 'Jump', color: '#FF5722' },
    { letter: 'K', sound: 'kuh', phonetic: '/k/', example: 'Kite', color: '#795548' },
    { letter: 'L', sound: 'luh', phonetic: '/l/', example: 'Lion', color: '#607D8B' },
    { letter: 'M', sound: 'muh', phonetic: '/m/', example: 'Mouse', color: '#FF9800' },
    { letter: 'N', sound: 'nuh', phonetic: '/n/', example: 'Nose', color: '#4CAF50' },
    { letter: 'O', sound: 'oh', phonetic: '/oʊ/', example: 'Orange', color: '#FF6B35' },
    { letter: 'P', sound: 'puh', phonetic: '/p/', example: 'Pig', color: '#8E24AA' },
    { letter: 'Q', sound: 'kwuh', phonetic: '/kw/', example: 'Queen', color: '#D32F2F' },
    { letter: 'R', sound: 'ruh', phonetic: '/r/', example: 'Rabbit', color: '#1976D2' },
    { letter: 'S', sound: 'sss', phonetic: '/s/', example: 'Sun', color: '#F57C00' },
    { letter: 'T', sound: 'tuh', phonetic: '/t/', example: 'Tiger', color: '#388E3C' },
    { letter: 'U', sound: 'uh', phonetic: '/ʌ/', example: 'Umbrella', color: '#7B1FA2' },
    { letter: 'V', sound: 'vuh', phonetic: '/v/', example: 'Van', color: '#C2185B' },
    { letter: 'W', sound: 'wuh', phonetic: '/w/', example: 'Water', color: '#0097A7' },
    { letter: 'X', sound: 'ks', phonetic: '/ks/', example: 'X-ray', color: '#5D4037' },
    { letter: 'Y', sound: 'yuh', phonetic: '/j/', example: 'Yellow', color: '#FBC02D' },
    { letter: 'Z', sound: 'zuh', phonetic: '/z/', example: 'Zebra', color: '#455A64' }
];

// CVC words for blending practice
const cvcWords = [
    { word: 'CAT', sounds: ['C', 'A', 'T'], meaning: '🐱' },
    { word: 'DOG', sounds: ['D', 'O', 'G'], meaning: '🐶' },
    { word: 'SUN', sounds: ['S', 'U', 'N'], meaning: '☀️' },
    { word: 'BAT', sounds: ['B', 'A', 'T'], meaning: '🦇' },
    { word: 'HAT', sounds: ['H', 'A', 'T'], meaning: '👒' },
    { word: 'PIG', sounds: ['P', 'I', 'G'], meaning: '🐷' },
    { word: 'BUG', sounds: ['B', 'U', 'G'], meaning: '🐛' },
    { word: 'CUP', sounds: ['C', 'U', 'P'], meaning: '☕' }
];

// Initialize the tutorial when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTutorial();
    generateLetterGrid();
    generateSoundsGrid();
    generateBlendingWords();
    generateGames();
    setupQuiz();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add focus management
    setupFocusManagement();
});

// Initialize tutorial
function initializeTutorial() {
    console.log('Reading Adventures Tutorial Initialized');
    
    // Set up audio context for better browser compatibility
    if (typeof(Audio) !== "undefined") {
        // Audio is supported
        console.log('Audio support detected');
    } else {
        console.log('Audio not supported - using visual feedback only');
    }
    
    // Initialize progress tracking
    updateProgress(0);
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Set active button
    const activeButton = event ? event.target : document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-pressed', 'true');
    }
    
    // Announce section change for screen readers
    announceToScreenReader(`Now viewing: ${sectionId.replace('-', ' ')} section`);
}

// Generate letter grid
function generateLetterGrid() {
    const letterGrid = document.querySelector('#letters-az .letter-grid');
    if (!letterGrid) return;
    
    letterGrid.innerHTML = '';
    
    alphabet.forEach((item, index) => {
        const letterCard = document.createElement('div');
        letterCard.className = 'letter-card';
        letterCard.setAttribute('role', 'button');
        letterCard.setAttribute('tabindex', '0');
        letterCard.setAttribute('aria-label', `Letter ${item.letter}, example: ${item.example}`);
        letterCard.style.borderColor = item.color;
        
        letterCard.innerHTML = `
            <div class="letter" style="color: ${item.color}">${item.letter}</div>
            <div class="sound">"${item.letter}"</div>
            <div class="example">${item.example}</div>
            <button class="audio-btn" onclick="playLetterSound('${item.letter}')" aria-label="Play sound for letter ${item.letter}">
                🔊
            </button>
        `;
        
        letterCard.addEventListener('click', () => {
            highlightLetter(letterCard, item);
            playLetterSound(item.letter);
        });
        
        letterCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                highlightLetter(letterCard, item);
                playLetterSound(item.letter);
            }
        });
        
        letterGrid.appendChild(letterCard);
    });
}

// Generate sounds grid
function generateSoundsGrid() {
    const soundsGrid = document.getElementById('sounds-grid');
    if (!soundsGrid) return;
    
    soundsGrid.innerHTML = '';
    
    alphabet.forEach((item, index) => {
        const soundCard = document.createElement('div');
        soundCard.className = 'letter-card';
        soundCard.setAttribute('role', 'button');
        soundCard.setAttribute('tabindex', '0');
        soundCard.setAttribute('aria-label', `Letter ${item.letter} makes the ${item.sound} sound`);
        soundCard.style.borderColor = item.color;
        
        soundCard.innerHTML = `
            <div class="letter" style="color: ${item.color}">${item.letter}</div>
            <div class="sound">/${item.sound}/</div>
            <div class="example">as in ${item.example}</div>
            <button class="audio-btn" onclick="playPhoneticSound('${item.sound}')" aria-label="Play ${item.sound} sound">
                🔊
            </button>
        `;
        
        soundCard.addEventListener('click', () => {
            highlightLetter(soundCard, item);
            playPhoneticSound(item.sound);
        });
        
        soundCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                highlightLetter(soundCard, item);
                playPhoneticSound(item.sound);
            }
        });
        
        soundsGrid.appendChild(soundCard);
    });
}

// Generate blending words
function generateBlendingWords() {
    const blendingContainer = document.querySelector('.blending-words');
    if (!blendingContainer) return;
    
    blendingContainer.innerHTML = '';
    
    cvcWords.forEach((wordObj, index) => {
        const wordCard = document.createElement('div');
        wordCard.className = 'letter-card';
        wordCard.style.padding = '25px';
        wordCard.setAttribute('role', 'button');
        wordCard.setAttribute('tabindex', '0');
        wordCard.setAttribute('aria-label', `Practice blending the word ${wordObj.word}`);
        
        wordCard.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">${wordObj.meaning}</div>
            <div class="letter" style="color: #E74C3C; font-size: 2.5em;">${wordObj.word}</div>
            <div class="sound">${wordObj.sounds.join(' + ')}</div>
            <button class="audio-btn" onclick="playWordBlending('${wordObj.word}')" aria-label="Play blending for ${wordObj.word}">
                🔊
            </button>
        `;
        
        wordCard.addEventListener('click', () => {
            highlightWord(wordCard);
            playWordBlending(wordObj.word);
        });
        
        wordCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                highlightWord(wordCard);
                playWordBlending(wordObj.word);
            }
        });
        
        blendingContainer.appendChild(wordCard);
    });
}

// Generate practice games
function generateGames() {
    generateLetterMatchGame();
    generateSoundDetectiveGame();
    generateRhymeGame();
}

// Letter matching game
function generateLetterMatchGame() {
    const gameContainer = document.getElementById('letter-match-game');
    if (!gameContainer) return;
    
    const selectedLetters = alphabet.slice(0, 6); // First 6 letters for simplicity
    
    gameContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="text-align: center;">
                <h5>Uppercase</h5>
                <div id="uppercase-letters" style="display: flex; flex-direction: column; gap: 10px;">
                    ${selectedLetters.map(item => 
                        `<button class="answer-btn" onclick="selectLetter('${item.letter}', 'upper')" data-letter="${item.letter}">
                            ${item.letter}
                        </button>`
                    ).join('')}
                </div>
            </div>
            <div style="text-align: center;">
                <h5>Match!</h5>
                <div id="match-feedback" style="font-size: 2em; margin: 20px 0;">
                    👆 Pick a letter!
                </div>
            </div>
            <div style="text-align: center;">
                <h5>Lowercase</h5>
                <div id="lowercase-letters" style="display: flex; flex-direction: column; gap: 10px;">
                    ${selectedLetters.map(item => 
                        `<button class="answer-btn" onclick="selectLetter('${item.letter.toLowerCase()}', 'lower')" data-letter="${item.letter.toLowerCase()}">
                            ${item.letter.toLowerCase()}
                        </button>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

// Sound detective game
function generateSoundDetectiveGame() {
    const gameContainer = document.getElementById('sound-detective-game');
    if (!gameContainer) return;
    
    const selectedLetters = alphabet.slice(0, 4); // First 4 letters
    
    gameContainer.innerHTML = `
        <div style="text-align: center; margin: 20px 0;">
            <button class="nav-btn" onclick="playDetectiveSound()" style="font-size: 1.2em; margin-bottom: 20px;">
                🔊 Play Sound
            </button>
            <div id="detective-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 400px; margin: 0 auto;">
                ${selectedLetters.map(item => 
                    `<button class="answer-btn" onclick="checkDetectiveAnswer('${item.letter}')" data-letter="${item.letter}">
                        ${item.letter}
                    </button>`
                ).join('')}
            </div>
            <div id="detective-feedback" style="margin-top: 20px; font-size: 1.2em;"></div>
        </div>
    `;
}

// Rhyme game
function generateRhymeGame() {
    const gameContainer = document.getElementById('rhyme-game');
    if (!gameContainer) return;
    
    const rhymeWords = [
        { word: 'CAT', rhymes: ['BAT', 'HAT', 'RAT'], nonRhyme: 'DOG' },
        { word: 'SUN', rhymes: ['FUN', 'RUN', 'BUN'], nonRhyme: 'CAR' }
    ];
    
    gameContainer.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 1.5em; margin: 20px 0;">
                Find words that rhyme with: <strong id="rhyme-target">CAT</strong>
            </div>
            <div id="rhyme-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 400px; margin: 0 auto;">
                <button class="answer-btn" onclick="checkRhyme('BAT', true)">BAT</button>
                <button class="answer-btn" onclick="checkRhyme('DOG', false)">DOG</button>
                <button class="answer-btn" onclick="checkRhyme('HAT', true)">HAT</button>
                <button class="answer-btn" onclick="checkRhyme('CAR', false)">CAR</button>
            </div>
            <div id="rhyme-feedback" style="margin-top: 20px; font-size: 1.2em;"></div>
        </div>
    `;
}

// Audio functions (simulated with visual feedback and text-to-speech where available)
function playLetterSound(letter) {
    announceToScreenReader(`Letter ${letter}`);
    
    // Visual feedback
    showAudioFeedback(`Playing: Letter ${letter}`);
    
    // Try to use speech synthesis if available
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        speechSynthesis.speak(utterance);
    }
}

function playPhoneticSound(sound) {
    announceToScreenReader(`Sound: ${sound}`);
    
    // Visual feedback
    showAudioFeedback(`Playing: /${sound}/ sound`);
    
    // Try to use speech synthesis if available
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.rate = 0.5;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    }
}

function playWordBlending(word) {
    announceToScreenReader(`Blending word: ${word}`);
    
    // Visual feedback
    showAudioFeedback(`Blending: ${word}`);
    
    // Try to use speech synthesis if available
    if ('speechSynthesis' in window) {
        // First say individual sounds
        const wordObj = cvcWords.find(w => w.word === word);
        if (wordObj) {
            wordObj.sounds.forEach((sound, index) => {
                setTimeout(() => {
                    const utterance = new SpeechSynthesisUtterance(sound);
                    utterance.rate = 0.6;
                    speechSynthesis.speak(utterance);
                }, index * 800);
            });
            
            // Then say the whole word
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
            }, wordObj.sounds.length * 800 + 500);
        }
    }
}

// Visual feedback functions
function highlightLetter(element, item) {
    // Remove previous highlights
    document.querySelectorAll('.letter-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
    
    // Highlight selected element
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = `0 8px 24px ${item.color}40`;
    
    // Reset after animation
    setTimeout(() => {
        element.style.transform = '';
        element.style.boxShadow = '';
    }, 1000);
}

function highlightWord(element) {
    // Highlight selected element
    element.style.transform = 'scale(1.05)';
    element.style.boxShadow = '0 8px 24px rgba(231, 76, 60, 0.3)';
    
    // Reset after animation
    setTimeout(() => {
        element.style.transform = '';
        element.style.boxShadow = '';
    }, 1500);
}

function showAudioFeedback(message) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27AE60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 1.1em;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Game functions
let selectedUppercase = null;
let selectedLowercase = null;

function selectLetter(letter, type) {
    if (type === 'upper') {
        selectedUppercase = letter;
        // Highlight selected button
        document.querySelectorAll('#uppercase-letters .answer-btn').forEach(btn => {
            btn.classList.remove('correct');
        });
        event.target.classList.add('correct');
    } else {
        selectedLowercase = letter;
        // Highlight selected button
        document.querySelectorAll('#lowercase-letters .answer-btn').forEach(btn => {
            btn.classList.remove('correct');
        });
        event.target.classList.add('correct');
    }
    
    // Check for match
    if (selectedUppercase && selectedLowercase) {
        const feedback = document.getElementById('match-feedback');
        if (selectedUppercase.toLowerCase() === selectedLowercase) {
            feedback.innerHTML = '🎉 Perfect Match!';
            feedback.style.color = '#27AE60';
            playLetterSound(selectedUppercase);
        } else {
            feedback.innerHTML = '❌ Try Again!';
            feedback.style.color = '#E74C3C';
        }
        
        // Reset after 2 seconds
        setTimeout(() => {
            selectedUppercase = null;
            selectedLowercase = null;
            feedback.innerHTML = '👆 Pick a letter!';
            feedback.style.color = '#2C3E50';
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.classList.remove('correct');
            });
        }, 2000);
    }
}

let currentDetectiveLetter = 'A';

function playDetectiveSound() {
    const letters = ['A', 'B', 'C', 'D'];
    currentDetectiveLetter = letters[Math.floor(Math.random() * letters.length)];
    playLetterSound(currentDetectiveLetter);
    
    // Clear previous feedback
    document.getElementById('detective-feedback').innerHTML = '';
    document.querySelectorAll('#detective-options .answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
}

function checkDetectiveAnswer(selectedLetter) {
    const feedback = document.getElementById('detective-feedback');
    const button = event.target;
    
    if (selectedLetter === currentDetectiveLetter) {
        button.classList.add('correct');
        feedback.innerHTML = '🎉 Correct! Great listening!';
        feedback.style.color = '#27AE60';
    } else {
        button.classList.add('incorrect');
        feedback.innerHTML = `❌ That was ${currentDetectiveLetter}. Try again!`;
        feedback.style.color = '#E74C3C';
    }
}

function checkRhyme(word, isRhyme) {
    const feedback = document.getElementById('rhyme-feedback');
    const button = event.target;
    
    if (isRhyme) {
        button.classList.add('correct');
        feedback.innerHTML = `🎉 Yes! ${word} rhymes with CAT!`;
        feedback.style.color = '#27AE60';
    } else {
        button.classList.add('incorrect');
        feedback.innerHTML = `❌ ${word} doesn't rhyme with CAT.`;
        feedback.style.color = '#E74C3C';
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
        button.classList.remove('correct', 'incorrect');
        feedback.innerHTML = '';
    }, 3000);
}

// Quiz functions
function setupQuiz() {
    quizQuestions = [
        {
            question: "What letter comes after A?",
            options: ["B", "C", "D", "E"],
            correct: 0,
            type: "multiple-choice"
        },
        {
            question: "Which letter makes the 'mmm' sound?",
            options: ["N", "M", "L", "P"],
            correct: 1,
            type: "multiple-choice"
        },
        {
            question: "What word do these sounds make: C + A + T?",
            options: ["DOG", "CAT", "SUN", "HAT"],
            correct: 1,
            type: "multiple-choice"
        },
        {
            question: "Which word rhymes with 'SUN'?",
            options: ["CAR", "FUN", "DOG", "BOOK"],
            correct: 1,
            type: "multiple-choice"
        },
        {
            question: "How many letters are in the alphabet?",
            options: ["24", "25", "26", "27"],
            correct: 2,
            type: "multiple-choice"
        }
    ];
    
    totalQuestions = quizQuestions.length;
}

function startQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    
    document.getElementById('start-quiz-btn').style.display = 'none';
    document.getElementById('results-container').style.display = 'none';
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('quiz-container');
    
    container.innerHTML = `
        <div class="question">
            <h5>Question ${currentQuestionIndex + 1} of ${totalQuestions}</h5>
            <p style="font-size: 1.2em; margin: 15px 0;">${question.question}</p>
            <div class="answer-options">
                ${question.options.map((option, index) => 
                    `<button class="answer-btn" onclick="selectAnswer(${index})" data-index="${index}">
                        ${option}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
    
    updateProgress(((currentQuestionIndex) / totalQuestions) * 100);
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn[data-index]');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show correct/incorrect
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedIndex === question.correct) {
        quizScore++;
        announceToScreenReader('Correct answer!');
    } else {
        announceToScreenReader('Incorrect answer. The correct answer is highlighted in green.');
    }
    
    // Show next button
    document.getElementById('next-question-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    document.getElementById('next-question-btn').style.display = 'none';
    showQuestion();
}

function showResults() {
    const percentage = Math.round((quizScore / totalQuestions) * 100);
    
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('results-container').style.display = 'block';
    document.getElementById('final-score').innerHTML = 
        `You got ${quizScore} out of ${totalQuestions} questions correct! (${percentage}%)`;
    
    updateProgress(100);
    
    // Celebrate if they did well
    if (percentage >= 80) {
        announceToScreenReader('Excellent work! You\'re becoming a great reader!');
    } else if (percentage >= 60) {
        announceToScreenReader('Good job! Keep practicing and you\'ll improve even more!');
    } else {
        announceToScreenReader('Keep practicing! You\'re learning and that\'s what matters!');
    }
}

function restartQuiz() {
    document.getElementById('start-quiz-btn').style.display = 'inline-block';
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('next-question-btn').style.display = 'none';
    updateProgress(0);
}

// Progress tracking
function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = Math.round(percentage) + '%';
    }
    
    if (progressText) {
        if (percentage === 0) {
            progressText.textContent = 'Ready to start!';
        } else if (percentage === 100) {
            progressText.textContent = 'Assessment complete!';
        } else {
            progressText.textContent = `Progress: ${Math.round(percentage)}%`;
        }
    }
}

// Accessibility functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function handleKeyboardNavigation(event) {
    // Handle escape key to return to main navigation
    if (event.key === 'Escape') {
        const firstNavBtn = document.querySelector('.nav-btn');
        if (firstNavBtn) {
            firstNavBtn.focus();
        }
    }
    
    // Handle arrow keys for grid navigation
    if (event.key.startsWith('Arrow')) {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('letter-card')) {
            navigateGrid(event, focusedElement);
        }
    }
}

function navigateGrid(event, currentElement) {
    const grid = currentElement.parentElement;
    const cards = Array.from(grid.children);
    const currentIndex = cards.indexOf(currentElement);
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
        case 'ArrowRight':
            newIndex = Math.min(currentIndex + 1, cards.length - 1);
            break;
        case 'ArrowLeft':
            newIndex = Math.max(currentIndex - 1, 0);
            break;
        case 'ArrowDown':
            newIndex = Math.min(currentIndex + columns, cards.length - 1);
            break;
        case 'ArrowUp':
            newIndex = Math.max(currentIndex - columns, 0);
            break;
    }
    
    if (newIndex !== currentIndex) {
        event.preventDefault();
        cards[newIndex].focus();
    }
}

function setupFocusManagement() {
    // Ensure proper focus management for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Set up focus for new interactive elements
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const interactiveElements = node.querySelectorAll('button, [tabindex]');
                        interactiveElements.forEach(setupElementFocus);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function setupElementFocus(element) {
    // Ensure all interactive elements have proper focus styles
    element.addEventListener('focus', function() {
        this.style.outline = '3px solid #F39C12';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('Tutorial Error:', event.error);
    announceToScreenReader('An error occurred. Please refresh the page if needed.');
});

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Tutorial fully loaded');
    announceToScreenReader('Reading Adventures tutorial is ready!');
});