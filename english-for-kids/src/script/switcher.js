import game from '../script.js';

class Switcher {
  constructor() {
    this.switcher = document.querySelector('.switch');
    this.cardsPage = document.querySelector('.cards-page');
    this.nav = document.querySelector('.nav');
    this.mainPage = document.querySelector('.main-page');
    this.startGame = document.querySelector('.start-game');
  }

  eventListener() {
    const backgroundTrain = 'linear-gradient(rgb(255, 229, 59) 0%, rgb(250, 39, 39) 75%)';
    const backgroundPlay = 'linear-gradient(rgb(255, 162, 162) 0%,rgb(250, 132, 250) 100%)';
    this.switcher.addEventListener('click', () => {
      if (!this.switcherMode) {
        if (game.currentPage === 'Statistics') {
          game.difficultMode = true;
        }
        this.switcherMode = true;
        this.switcher.textContent = 'PLAY';
        this.switcher.style.background = backgroundTrain;
        this.nav.style.background = backgroundTrain;
        game.difficultWords.querySelector('.back-statisctics').style.background = backgroundTrain;
        this.mainPage.querySelectorAll('.category-card').forEach((item) => item.style.background = 'linear-gradient(rgb(255, 229, 59) 0%, rgb(250, 39, 39) 40%, #ffffff 30%)');
        this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'none');
        this.startGame.style.display = 'block';
      } else {
        this.switcherMode = false;
        game.difficultMode = false;
        this.switcher.textContent = 'TRAIN';
        this.switcher.style.background = backgroundPlay;
        this.nav.style.background = backgroundPlay;
        game.difficultWords.querySelector('.back-statisctics').style.background = backgroundPlay;
        this.mainPage.querySelectorAll('.category-card').forEach((item) => item.style.background = 'linear-gradient(rgb(255, 162, 162) 0%,rgb(250, 132, 250) 40%, #ffffff 30%)');
        this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'block');
        game.stopGame();
        this.startGame.style.display = 'none';
      }
    });
  }
}

const switcher = new Switcher();
switcher.eventListener();

export default switcher;
