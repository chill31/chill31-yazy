const singlePlayerScreen = document.querySelector('.single-player-screen');
const duoPlayerScreen = document.querySelector('.duo-screen');

function startGame(type) {

  if (type === 'single-player') {

    const highScoreSpan = document.querySelector('.high-score');

    const highScore = localStorage.getItem('high-score');
    if (!highScore) {
      localStorage.setItem('high-score', 0);
    }

    highScoreSpan.textContent = highScore ?? "0";

    let gameScore = 0;
    let rollAmt = 0;
    let selectedDices = [];
    let selectedDicesValues = [];

    const rollButton = singlePlayerScreen.querySelector('.roll-container');
    const rollCountSpans = singlePlayerScreen.querySelectorAll('.roll-count-div span.roll');
    rollButton.addEventListener('click', () => {

      if (rollAmt === 3) {
        return;
      }
      if (selectedDices.length === 5) {
        return;
      }
      rollAmt++
      rollCountSpans[rollAmt - 1].classList.add('done');

      const numbers = rollDice({
        amount: 5,
        el: singlePlayerScreen.querySelector('.dice-container'),
        selectedDices,
        selectedDicesValues
      });

      checkForPatterns(numbers, singlePlayerScreen.querySelector('.pattern-score-view'));

    });

    const dices = singlePlayerScreen.querySelectorAll('.dice');
    dices.forEach((dice, index) => {
      dice.addEventListener('click', () => {
        if (rollAmt === 0) {
          return;
        }
        if (selectedDices.includes(index)) {
          selectedDices = selectedDices.filter((i) => i !== index);
          dice.classList.remove('selected');
          selectedDicesValues = selectedDicesValues.filter((i) => i !== Number(dice.getAttribute('data-value')));
        } else {
          selectedDices.push(index);
          dice.classList.add('selected');
          selectedDicesValues.push(Number(dice.getAttribute('data-value')));
        }
      });
    });

    const patternScoreSpans = singlePlayerScreen.querySelectorAll('.pattern-score');
    const scoreSpan = singlePlayerScreen.querySelector('.score-span');
    const playAgainButton = singlePlayerScreen.querySelector('.play-again');
    patternScoreSpans.forEach((span) => {
      span.addEventListener("click", () => {
        if (rollAmt === 0) return;
        gameScore += Number(span.textContent);
        span.classList.add('taken');

        scoreSpan.textContent = gameScore;

        rollAmt = 0;
        rollCountSpans.forEach((span) => span.classList.remove('done'));
        selectedDices = [];
        selectedDicesValues = [];
        dices.forEach((dice) => {
          dice.removeAttribute('data-value');
          dice.classList.remove('selected');
          dice.innerHTML = '';
        });

        patternScoreSpans.forEach((span) => {
          if (!span.classList.contains('taken')) span.textContent = 0;
        })

        let gameOver = true;
        patternScoreSpans.forEach((span) => {
          if (!span.classList.contains('taken')) {
            gameOver = false;
          }
        });
        if (gameOver) {

          if (gameScore > highScore) {
            localStorage.setItem('high-score', gameScore);
            highScoreSpan.textContent = gameScore;
          }

          rollButton.classList.add('game-over');
          playAgainButton.classList.remove('hidden');

        }
      });
    });

    playAgainButton.addEventListener('click', () => {
      gameScore = 0;
      scoreSpan.textContent = 0;
      rollAmt = 0;
      patternScoreSpans.forEach((span) => {
        span.classList.remove('taken');
        span.textContent = 0;
      });

      dices.forEach((dice) => {
        dice.removeAttribute('data-value');
        dice.classList.remove('selected');
        dice.innerHTML = "";
        rollCountSpans.forEach((span) => span.classList.remove('done'));
      });
      playAgainButton.classList.add('hidden');
      rollButton.classList.remove('game-over');
    });

    const exitButton = singlePlayerScreen.querySelector('.exit-screen-button');
    exitButton.addEventListener('click', () => {
      singlePlayerScreen.classList.add('hidden');
      gameScore = 0;
      scoreSpan.textContent = 0;
      rollAmt = 0;
      patternScoreSpans.forEach((span) => {
        span.classList.remove('taken');
        span.textContent = 0;
      });

      dices.forEach((dice) => {
        dice.removeAttribute('data-value');
        dice.classList.remove('selected');
        dice.innerHTML = "";
        rollCountSpans.forEach((span) => span.classList.remove('done'));
      });
      playAgainButton.classList.add('hidden');
      rollButton.classList.remove('game-over');
    });

  }

  if (type === 'duo') {

    let rollAmt = 0;
    let firstPlayerChance = true;

    let gameScore = 0;
    let selectedDices = [];
    let selectedDicesValues = [];

    let gameScore2 = 0;
    let selectedDices2 = [];
    let selectedDicesValues2 = [];

    const firstPlayerPatternScoreSpans = duoPlayerScreen.querySelectorAll('.pattern-score-view.first-player .pattern-score');
    const secondPlayerPatternScoreSpans = duoPlayerScreen.querySelectorAll('.pattern-score-view.second-player .pattern-score');

    secondPlayerPatternScoreSpans.forEach((span) => span.classList.add('disable')); // not adding 'taken', but creating a new style that indicates that the first player is not able to modify the scores of the second player

    const rollButton = duoPlayerScreen.querySelector('.roll-container');
    const rollCountSpans = duoPlayerScreen.querySelectorAll('.roll-count-div span.roll');
    rollButton.addEventListener('click', () => {

      if (rollAmt === 3) {
        return;
      }
      if (selectedDices.length === 5 || selectedDices2.length === 5) {
        return;
      }
      rollAmt++
      rollCountSpans[rollAmt - 1].classList.add('done');

      if (firstPlayerChance) {
        const numbers = rollDice({
          amount: 5,
          el: duoPlayerScreen.querySelector('.dice-container'),
          selectedDices,
          selectedDicesValues
        });

        checkForPatterns(numbers, duoPlayerScreen.querySelector('.pattern-score-view.first-player'));
      } else {
        const numbers = rollDice({
          amount: 5,
          el: duoPlayerScreen.querySelector('.dice-container'),
          selectedDices: selectedDices2,
          selectedDicesValues: selectedDicesValues2
        });

        checkForPatterns(numbers, duoPlayerScreen.querySelector('.pattern-score-view.second-player'));
      }

    });

    const dices = duoPlayerScreen.querySelectorAll('.dice');
    dices.forEach((dice, index) => {
      dice.addEventListener('click', () => {
        if (rollAmt === 0) {
          return;
        }
        if (firstPlayerChance) {
          if (selectedDices.includes(index)) {
            selectedDices = selectedDices.filter((i) => i !== index);
            dice.classList.remove('selected');
            return selectedDicesValues = selectedDicesValues.filter((i) => i !== Number(dice.getAttribute('data-value')));
          } else {
            selectedDices.push(index);
            dice.classList.add('selected');
            return selectedDicesValues.push(Number(dice.getAttribute('data-value')));
          }
        } else {
          if (selectedDices2.includes(index)) {
            selectedDices2 = selectedDices2.filter((i) => i !== index);
            dice.classList.remove('selected');
            return selectedDicesValues2 = selectedDicesValues2.filter((i) => i !== Number(dice.getAttribute('data-value')));
          } else {
            selectedDices2.push(index);
            dice.classList.add('selected');
            return selectedDicesValues2.push(Number(dice.getAttribute('data-value')));
          }
        }
      });
    });

    const firstPlayerScoreSpan = duoPlayerScreen.querySelector('.blue-score-span');
    const secondPlayerScoreSpan = duoPlayerScreen.querySelector('.red-score-span');
    firstPlayerPatternScoreSpans.forEach((span) => {
      span.addEventListener("click", () => {
        if (rollAmt === 0) return;
        gameScore += Number(span.textContent);
        span.classList.add('taken');

        firstPlayerScoreSpan.textContent = gameScore;

        rollAmt = 0;
        rollCountSpans.forEach((span) => span.classList.remove('done'));
        selectedDices = [];
        selectedDicesValues = [];
        firstPlayerChance = false;
        firstPlayerPatternScoreSpans.forEach((span) => span.classList.add('disable'));
        secondPlayerPatternScoreSpans.forEach((span) => span.classList.remove('disable'));
        dices.forEach((dice) => {
          dice.removeAttribute('data-value');
          dice.classList.remove('selected');
          dice.innerHTML = '';
        });

        firstPlayerPatternScoreSpans.forEach((span) => {
          if (!span.classList.contains('taken')) span.textContent = 0;
        })
      });
    });

    secondPlayerPatternScoreSpans.forEach((span) => {
      span.addEventListener("click", () => {
        if (rollAmt === 0) return;
        gameScore2 += Number(span.textContent);
        span.classList.add('taken');

        secondPlayerScoreSpan.textContent = gameScore2;

        rollAmt = 0;
        rollCountSpans.forEach((span) => span.classList.remove('done'));
        selectedDices2 = [];
        selectedDicesValues2 = [];
        firstPlayerChance = true;
        secondPlayerPatternScoreSpans.forEach((span) => span.classList.add('disable'));
        firstPlayerPatternScoreSpans.forEach((span) => span.classList.remove('disable'));
        dices.forEach((dice) => {
          dice.removeAttribute('data-value');
          dice.classList.remove('selected');
          dice.innerHTML = '';
        });

        secondPlayerPatternScoreSpans.forEach((span) => {
          if (!span.classList.contains('taken')) span.textContent = 0;
        })

        // check if all patterns are taken
        let gameOver = true;
        secondPlayerPatternScoreSpans.forEach((span) => {
          if (!span.classList.contains('taken')) {
            gameOver = false;
          }

          if (gameOver) {
            const winner = gameScore > gameScore2 ? 'blue' : 'red';
            const gameOverOverlay = duoPlayerScreen.querySelector('.game-over-overlay');
            const bluePlayerOverlayScore = gameOverOverlay.querySelector('.overlay-blue-score');
            const redPlayerOverlayScore = gameOverOverlay.querySelector('.overlay-red-score');
            gameOverOverlay.classList.add('show');
            gameOverOverlay.classList.add(`winner-${winner}`);
            bluePlayerOverlayScore.textContent = gameScore;
            redPlayerOverlayScore.textContent = gameScore2;

            const playAgainButton = duoPlayerScreen.querySelector('.overlay-button');
            playAgainButton.addEventListener('click', () => {
              gameOverOverlay.classList.remove('show');
              gameScore = 0;
              gameScore2 = 0;
              firstPlayerScoreSpan.textContent = 0;
              secondPlayerScoreSpan.textContent = 0;
              rollAmt = 0;
              firstPlayerPatternScoreSpans.forEach((span) => {
                span.classList.remove('taken');
                span.textContent = 0;
              });
              secondPlayerPatternScoreSpans.forEach((span) => {
                span.classList.remove('taken');
                span.textContent = 0;
              });

              dices.forEach((dice) => {
                dice.removeAttribute('data-value');
                dice.classList.remove('selected');
                dice.innerHTML = "";
                rollCountSpans.forEach((span) => span.classList.remove('done'));
              });
              rollButton.classList.remove('game-over');
            });
          }
        });
      });
    });

    const exitButton = duoPlayerScreen.querySelector('.exit-screen-button');
    exitButton.addEventListener('click', () => {
      duoPlayerScreen.classList.add('hidden');
      gameScore = 0;
      gameScore2 = 0;
      firstPlayerScoreSpan.textContent = 0;
      secondPlayerScoreSpan.textContent = 0;
      rollAmt = 0;
      firstPlayerPatternScoreSpans.forEach((span) => {
        span.classList.remove('taken');
        span.textContent = 0;
      });
      secondPlayerPatternScoreSpans.forEach((span) => {
        span.classList.remove('taken');
        span.textContent = 0;
      });

      dices.forEach((dice) => {
        dice.removeAttribute('data-value');
        dice.classList.remove('selected');
        dice.innerHTML = "";
        rollCountSpans.forEach((span) => span.classList.remove('done'));
      });
      rollButton.classList.remove('game-over');
    });

  }

}

function rollDice({ amount = 5, el = null, selectedDices = [], selectedDicesValues = [] }) {
  let randomNumbers = Array.from({ length: amount }, () => Math.floor(Math.random() * 6) + 1);
  const dices = el.querySelectorAll('.dice');

  selectedDicesValues.forEach((value, index) => {
    randomNumbers[selectedDices[index]] = value;
  });

  dices.forEach((dice, index) => {
    dice.setAttribute('data-value', randomNumbers[index]);
    dice.innerHTML = `<i class="rolled-dice bi bi-dice-${randomNumbers[index]}-fill"></i>`;
  });

  return randomNumbers;
}

function checkForPatterns(numbers, patternEl) {
  const patternScoreSpans = patternEl.querySelectorAll('.pattern-score');
  if (numbers.includes(1) && !patternScoreSpans[0].classList.contains("taken")) {
    const ones = numbers.filter((n) => n === 1);
    patternScoreSpans[0].textContent = ones.length;
  } else {
    patternScoreSpans[0].textContent = 0;
  }
  if (numbers.includes(2) && !patternScoreSpans[1].classList.contains("taken")) {
    const twos = numbers.filter((n) => n === 2);
    patternScoreSpans[1].textContent = twos.length * 2;
  } else {
    patternScoreSpans[1].textContent = 0;
  }
  if (numbers.includes(3) && !patternScoreSpans[2].classList.contains("taken")) {
    const threes = numbers.filter((n) => n === 3);
    patternScoreSpans[2].textContent = threes.length * 3;
  } else {
    patternScoreSpans[2].textContent = 0;
  }
  if (numbers.includes(4) && !patternScoreSpans[3].classList.contains("taken")) {
    const fours = numbers.filter((n) => n === 4);
    patternScoreSpans[3].textContent = fours.length * 4;
  } else {
    patternScoreSpans[3].textContent = 0;
  }
  if (numbers.includes(5) && !patternScoreSpans[4].classList.contains("taken")) {
    const fives = numbers.filter((n) => n === 5);
    patternScoreSpans[4].textContent = fives.length * 5;
  } else {
    patternScoreSpans[4].textContent = 0;
  }
  if (numbers.includes(6) && !patternScoreSpans[5].classList.contains("taken")) {
    const sixes = numbers.filter((n) => n === 6);
    patternScoreSpans[5].textContent = sixes.length * 6;
  } else {
    patternScoreSpans[5].textContent = 0;
  }

  if (!patternScoreSpans[6].classList.contains("taken")) {
    checkForThrees(numbers, patternScoreSpans[6]);
  }

  if (!patternScoreSpans[7].classList.contains("taken")) {
    checkForFours(numbers, patternScoreSpans[7]);
  }

  if(patternScoreSpans[8].classList.contains("taken")) return;
  const allSame = numbers.every((num, index, arr) => num === arr[0]);
  if (allSame) {
    patternScoreSpans[8].textContent = 50;
  } else {
    patternScoreSpans[8].textContent = 0;
  }

  if (isSequence(numbers)) {
    patternScoreSpans[9].textContent = 40;
  } else {
    patternScoreSpans[9].textContent = 0;
  }
}

function checkForThrees(array, patternEl) {
  let count = {};
  array.forEach(num => {
    count[num] = (count[num] || 0) + 1;
  });
  let hasThreeOfSame = Object.values(count).some(val => val === 3);
  if (hasThreeOfSame) {
    let sum = array.reduce((acc, num) => acc + num, 0);
    patternEl.textContent = sum;
    return
  } else {
    patternEl.textContent = 0;
    return
  }
}

function checkForFours(array, patternEl) {
  let count = {};
  array.forEach(num => {
    count[num] = (count[num] || 0) + 1;
  });

  let hasFourOfSame = Object.values(count).some(val => val === 4);

  if (hasFourOfSame) {
    let sum = array.reduce((acc, num) => acc + num, 0);
    patternEl.textContent = sum;
    return;
  } else {
    patternEl.textContent = 0;
    return;
  }
}

function isSequence(numbers) {
  const sequence1 = [2, 3, 4, 5, 6];
  const sequence2 = [1, 2, 3, 4, 5];

  const sorted = numbers.slice().sort((a, b) => a - b);

  return JSON.stringify(sorted) === JSON.stringify(sequence1) || JSON.stringify(sorted) === JSON.stringify(sequence2);
}