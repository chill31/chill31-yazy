function startGame(type) {

  if(type === 'single-player') {

    const highScoreSpan = document.querySelector('.high-score');

    const highScore = localStorage.getItem('high-score');
    if(!highScore) {
      localStorage.setItem('high-score', 0);
    }

    highScoreSpan.textContent = highScore ?? "0";

  }

  if(type === 'duo') {

    /** IF THE USER SELECTED TO PLAY WITH A DUO */

  }

}