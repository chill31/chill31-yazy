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

        // resetting the roll
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
          if(!span.classList.contains('taken')) span.textContent = 0;
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

    /** IF THE USER SELECTED TO PLAY WITH A DUO */

  }

}

function rollDice({ amount = 5, el = null, selectedDices = [], selectedDicesValues = [] }) {
  let randomNumbers = Array.from({ length: amount }, () => Math.floor(Math.random() * 6) + 1);
  const dices = el.querySelectorAll('.dice');


  dices.forEach((dice, index) => {
    if (!selectedDices.includes(index)) {
      dice.setAttribute('data-value', randomNumbers[index]);
      dice.innerHTML = `<i class="rolled-dice bi bi-dice-${randomNumbers[index]}-fill"></i>`;
    }
  });

  selectedDicesValues.forEach((value, index) => {
    randomNumbers[selectedDices[index]] = value;
  });

  return randomNumbers;
}

function checkForPatterns(numbers, patternEl) {
  const patternScoreSpans = patternEl.querySelectorAll('.pattern-score');
  if (numbers.includes(1)) {
    const ones = numbers.filter((n) => n === 1);
    patternScoreSpans[0].textContent = ones.length;
  }
  if (numbers.includes(2)) {
    const twos = numbers.filter((n) => n === 2);
    patternScoreSpans[1].textContent = twos.length * 2;
  }
  if (numbers.includes(3)) {
    const threes = numbers.filter((n) => n === 3);
    patternScoreSpans[2].textContent = threes.length * 3;
  }
  if (numbers.includes(4)) {
    const fours = numbers.filter((n) => n === 4);
    patternScoreSpans[3].textContent = fours.length * 4;
  }
  if (numbers.includes(5)) {
    const fives = numbers.filter((n) => n === 5);
    patternScoreSpans[4].textContent = fives.length * 5;
  }
  if (numbers.includes(6)) {
    const sixes = numbers.filter((n) => n === 6);
    patternScoreSpans[5].textContent = sixes.length * 6;
  }

  checkForThrees(numbers, patternScoreSpans[6]);
  checkForFours(numbers, patternScoreSpans[7]);

  const allSame = numbers.every((num, index, arr) => num === arr[0]);
  if (allSame) {
    patternScoreSpans[8].textContent = 50;
  }

  const sorted = numbers.sort();
  const isSequence = sorted.every((num, index, arr) => num === arr[0] + index);
  if (isSequence) {
    patternScoreSpans[9].textContent = 40;
  }
}

function checkForThrees(array, patternEl) {
  let count = {};
  array.forEach(num => {
    count[num] = (count[num] || 0) + 1;
  });
  // return the count
  let hasThreeOfSame = Object.values(count).some(val => val === 3);
  if (hasThreeOfSame) {
    let sum = array.reduce((acc, num) => acc + num, 0);
    patternEl.textContent = sum;
    return patternEl.textContent = sum;
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
  }

  patternEl.textContent = 0;
  return
}

function resetRoll() { }
