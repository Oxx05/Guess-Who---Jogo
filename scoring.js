// Scoring system
let scores = {
    player1: 0,
    player2: 0
};

let streaks = {
    player1: 0,
    player2: 0
};

// Reset all scores
function resetScores() {
    scores.player1 = 0;
    scores.player2 = 0;
    streaks.player1 = 0;
    streaks.player2 = 0;

    updateScoreDisplay(1);
    updateScoreDisplay(2);
}

// Add score to player
function addScore(playerId, points) {
    const playerKey = `player${playerId}`;

    // Increment streak
    streaks[playerKey]++;

    // Calculate bonus for streaks
    let bonus = 0;
    if (streaks[playerKey] >= 5) {
        bonus = 5;
    } else if (streaks[playerKey] >= 10) {
        bonus = 10;
    }

    scores[playerKey] += points + bonus;
    updateScoreDisplay(playerId);

    // Show streak bonus if applicable
    if (bonus > 0) {
        showStreakBonus(playerId, streaks[playerKey], bonus);
    }
}

// Subtract score from player
function subtractScore(playerId, points) {
    const playerKey = `player${playerId}`;

    // Reset streak on wrong answer
    streaks[playerKey] = 0;

    scores[playerKey] = Math.max(0, scores[playerKey] - points);
    updateScoreDisplay(playerId);
}

// Update score display in UI
function updateScoreDisplay(playerId) {
    const playerKey = `player${playerId}`;
    const scoreElement = document.querySelector(`#score-p${playerId} .score-value`);
    const streakElement = document.getElementById(`streak-p${playerId}`);

    if (scoreElement) {
        scoreElement.textContent = scores[playerKey];

        // Add pulse animation on score change
        scoreElement.style.animation = 'none';
        setTimeout(() => {
            scoreElement.style.animation = 'pulse 0.3s ease';
        }, 10);
    }

    if (streakElement) {
        if (streaks[playerKey] > 0) {
            streakElement.textContent = `🔥 ${streaks[playerKey]} em sequência`;
        } else {
            streakElement.textContent = '';
        }
    }
}

// Show streak bonus notification
function showStreakBonus(playerId, streak, bonus) {
    const streakElement = document.getElementById(`streak-p${playerId}`);

    if (streakElement) {
        const originalText = streakElement.textContent;
        streakElement.textContent = `🎉 +${bonus} bônus!`;
        streakElement.style.animation = 'pulse 0.5s ease 2';

        setTimeout(() => {
            streakElement.textContent = originalText;
        }, 1500);
    }
}

// Get current score for player
function getScore(playerId) {
    return scores[`player${playerId}`];
}

// Get current streak for player
function getStreak(playerId) {
    return streaks[`player${playerId}`];
}

// Export functions
window.resetScores = resetScores;
window.addScore = addScore;
window.subtractScore = subtractScore;
window.getScore = getScore;
window.getStreak = getStreak;
