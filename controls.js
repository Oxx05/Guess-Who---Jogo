// Keyboard controls - Direct key to character mapping
// Player 1: W=Rei, A=Lobo, S=Bruxa, D=Princesa, Space=Camponês
// Player 2: ↑=Rei, ←=Lobo, ↓=Bruxa, →=Princesa, Enter=Camponês

const PLAYER1_KEY_MAP = {
    'w': 'king',        // W = Rei
    'a': 'wolf',        // A = Lobo
    's': 'witch',       // S = Bruxa
    'd': 'princess',    // D = Princesa
    ' ': 'peasant'      // Space = Camponês
};

const PLAYER2_KEY_MAP = {
    'arrowup': 'king',      // ↑ = Rei
    'arrowleft': 'wolf',    // ← = Lobo
    'arrowdown': 'witch',   // ↓ = Bruxa
    'arrowright': 'princess', // → = Princesa
    'enter': 'peasant'      // Enter = Camponês
};

// Initialize controls
function initControls() {
    const buttons = document.querySelectorAll('.char-btn');

    // Click handlers for buttons
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const character = btn.dataset.char;
            selectAnswer(character, 1);
        });
    });

    // Keyboard event listener
    document.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard input
function handleKeyPress(e) {
    // Only handle keys when game is active
    if (document.getElementById('game').classList.contains('hidden')) {
        return;
    }

    const key = e.key.toLowerCase();

    // Player 1 controls: W/A/S/D + Space
    if (PLAYER1_KEY_MAP[key]) {
        const character = PLAYER1_KEY_MAP[key];
        flashButton(character, 1);
        selectAnswer(character, 1);
        e.preventDefault();
    }

    // Player 2 controls: Arrow keys + Enter
    if (PLAYER2_KEY_MAP[key]) {
        // Only allow player 2 input in multiplayer modes
        if (window.gameState.mode !== 'single') {
            const character = PLAYER2_KEY_MAP[key];
            flashButton(character, 2);
            selectAnswer(character, 2);
            e.preventDefault();
        }
    }
}

// Flash button to show which one was pressed
function flashButton(character, playerId) {
    const button = document.querySelector(`.char-btn[data-char="${character}"]`);

    if (button) {
        // Add flash effect
        button.classList.add('selected');
        button.dataset.player = playerId.toString();

        // Remove after short delay
        setTimeout(() => {
            button.classList.remove('selected');
            button.dataset.player = '0';
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initControls);
