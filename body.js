/* ONLY THE DEFAULT CODE WHICH WORKS FOR BOTH SCREENS IS PRESENT HERE. NO ACTUAL FUNCTIONS OF THE GAME ARE PRESENT HERE  */

const singlePlayerButton = document.querySelector('.single-player-selector');
const duoButton = document.querySelector('.duo-selector');

const singleScreen = document.querySelector('.single-player-screen');
const duoScreen = document.querySelector('.duo-screen');

const exitSingleButton = document.querySelector('.exit-single-player');
const exitDuoButton = document.querySelector('.exit-duo');

singlePlayerButton.addEventListener('click', () => {
  if(document.body.classList.contains('blur')) {
    return;
  }
  document.body.classList.add('blur');
  singleScreen.classList.add('visible');
  startGame('single-player');
});

exitSingleButton.addEventListener('click', () => {
  document.body.classList.remove('blur');
  singleScreen.classList.remove('visible');
});

duoButton.addEventListener('click', () => {
  if(document.body.classList.contains('blur')) {
    return;
  }
  document.body.classList.add('blur');
  duoScreen.classList.add('visible');
  startGame('duo');
});

exitDuoButton.addEventListener('click', () => {
  document.body.classList.remove('blur');
  duoScreen.classList.remove('visible');
});