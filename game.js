// Character definitions
const CHARACTERS = {
    king: {
        name: 'Rei',
        icon: '👑',
        primaryColor: '#9b59b6',
        secondaryColor: '#f39c12'
    },
    wolf: {
        name: 'Lobo',
        icon: '🐺',
        primaryColor: '#95a5a6',
        secondaryColor: '#34495e'
    },
    witch: {
        name: 'Bruxa',
        icon: '🧙‍♀️',
        primaryColor: '#8e44ad',
        secondaryColor: '#27ae60'
    },
    princess: {
        name: 'Princesa',
        icon: '👸',
        primaryColor: '#e91e63',
        secondaryColor: '#ffc0cb'
    },
    peasant: {
        name: 'Camponês',
        icon: '🧑‍🌾',
        primaryColor: '#8b4513',
        secondaryColor: '#d2b48c'
    }
};

// Game state
let gameState = {
    mode: null,
    currentRound: null,
    correctAnswer: null,
    cooldownActive: false,
    timerInterval: null,
    timeRemaining: 60
};

// Initialize game
function initGame() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const backButton = document.getElementById('backBtn');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            startGame(mode);
        });
    });

    backButton.addEventListener('click', returnToMenu);
}

// Start game with selected mode
function startGame(mode) {
    gameState.mode = mode;
    gameState.timeRemaining = 60;

    // Show/hide appropriate UI elements
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');

    // Show/hide player 2 score for 1v1 and multiplayer
    const p2Score = document.getElementById('score-p2');
    if (mode === 'single') {
        p2Score.style.display = 'none';
    } else {
        p2Score.style.display = 'flex';
    }

    // Start timer for single player
    if (mode === 'single') {
        startTimer();
    } else {
        document.getElementById('timer').textContent = '∞';
    }

    // Reset scores
    resetScores();

    // Generate first round
    generateRound();
}

// Generate a new round
function generateRound() {
    if (gameState.cooldownActive) return;

    const charKeys = Object.keys(CHARACTERS);

    // Decide: complete character (50%) or missing character (50%)
    const showComplete = Math.random() < 0.5;

    if (showComplete) {
        // One display shows complete character, other shows mix
        generateCompleteRound(charKeys);
    } else {
        // Both displays show mixes using 4 characters total
        generateMissingRound(charKeys);
    }
}

// Generate round with one complete character
function generateCompleteRound(charKeys) {
    // Pick random character to be complete
    const completeChar = charKeys[Math.floor(Math.random() * charKeys.length)];
    gameState.correctAnswer = completeChar;

    // Pick which display (0 or 1) shows the complete character
    const completeDisplay = Math.floor(Math.random() * 2);
    const mixDisplay = completeDisplay === 0 ? 1 : 0;

    // Display complete character
    displayCharacter(completeDisplay, completeChar, completeChar);

    // Display mixed character (MUST use different icon and color to avoid second complete)
    const availableChars = charKeys.filter(c => c !== completeChar);
    const mixIcon = availableChars[Math.floor(Math.random() * availableChars.length)];
    // Ensure color is different from icon
    const availableColors = availableChars.filter(c => c !== mixIcon);
    const mixColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    displayCharacter(mixDisplay, mixIcon, mixColor);
}

// Generate round with missing character
function generateMissingRound(charKeys) {
    // Pick 4 characters to use
    const shuffled = [...charKeys].sort(() => Math.random() - 0.5);
    const usedChars = shuffled.slice(0, 4);
    const missingChar = shuffled[4];

    gameState.correctAnswer = missingChar;

    // Distribute 4 characters across 2 displays (2 each)
    // Display 1: use 2 different characters
    const display1Icon = usedChars[0];
    const display1Color = usedChars[1];
    displayCharacter(0, display1Icon, display1Color);

    // Display 2: use the other 2 characters
    const display2Icon = usedChars[2];
    const display2Color = usedChars[3];
    displayCharacter(1, display2Icon, display2Color);
}

// Display a character in a specific display
function displayCharacter(displayIndex, iconChar, colorChar) {
    const display = document.getElementById(`display-${displayIndex + 1}`);
    const iconEl = display.querySelector('.char-icon');
    const outfitEl = display.querySelector('.char-outfit');

    // Clear previous classes
    iconEl.className = 'char-icon';
    outfitEl.className = 'char-outfit';

    // Add character-specific classes
    iconEl.classList.add(iconChar);
    outfitEl.classList.add(colorChar);

    // Add animation
    display.style.animation = 'none';
    setTimeout(() => {
        display.style.animation = 'fadeIn 0.6s ease-out';
    }, 10);
}

// Timer for single player
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        document.getElementById('timer').textContent = gameState.timeRemaining;

        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    clearInterval(gameState.timerInterval);
    const finalScore = parseInt(document.querySelector('#score-p1 .score-value').textContent);

    showFeedback(`Fim de Jogo! Pontuação: ${finalScore}`, 'correct', 3000);

    setTimeout(() => {
        returnToMenu();
    }, 3000);
}

// Return to menu
function returnToMenu() {
    clearInterval(gameState.timerInterval);
    document.getElementById('game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    clearFeedback();
}

// Show feedback message
function showFeedback(message, type, duration = 2000) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;

    setTimeout(() => {
        clearFeedback();
    }, duration);
}

// Clear feedback
function clearFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// Handle answer selection
function selectAnswer(character, playerId) {
    if (gameState.cooldownActive) return;

    const isCorrect = character === gameState.correctAnswer;

    if (isCorrect) {
        handleCorrectAnswer(playerId);
    } else {
        handleIncorrectAnswer(playerId);
    }
}

// Handle correct answer
function handleCorrectAnswer(playerId) {
    addScore(playerId, 10);
    showFeedback('✓ Correto! +10 pontos', 'correct');

    // Generate next round after brief delay
    setTimeout(() => {
        generateRound();
    }, 800);
}

// Handle incorrect answer
function handleIncorrectAnswer(playerId) {
    subtractScore(playerId, 5);
    showFeedback('✗ Errado! -5 pontos (Cooldown: 2s)', 'incorrect');

    // Activate cooldown
    gameState.cooldownActive = true;
    disableButtons();

    setTimeout(() => {
        gameState.cooldownActive = false;
        enableButtons();
        showFeedback('Pronto para tentar novamente!', 'cooldown', 1000);
    }, 2000);
}

// Disable all character buttons
function disableButtons() {
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.disabled = true;
    });
}

// Enable all character buttons
function enableButtons() {
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.disabled = false;
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Export for other modules
window.gameState = gameState;
window.selectAnswer = selectAnswer;
window.CHARACTERS = CHARACTERS;
