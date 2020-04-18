import menuy from './script/menu.js';
import category from './script/category.js';
import cards from './script/cards.js';
import switcher from './script/switcher.js';

class Game {
  constructor() {
    this.mainPage = category.mainPage;
    this.category = category.categoryImages;
    this.cardData = cards.cardData;
    this.cardsWrapper = cards.cardsWrapper;
    this.startGameButton = switcher.startGame;
    this.gameMode = false;
    this.audio = new Audio();
    this.audio.autoplay = true;
  }

  createDOM() {
    this.wrapper = document.querySelector('.wrapper');
    this.container = document.querySelector('.container');
    this.cardsPage = document.querySelector('.cards-page');
    this.repeatButton = document.querySelector('.repeat');
    this.stars = document.querySelector('.stars');
    this.cardsPage.remove();
  }

  eventListener() {
    this.wrapper.addEventListener('click', (event) => this.checkClickLink(event));
    this.container.addEventListener('click', (event) => this.rotateCard(event));
    this.container.addEventListener('mousemove', (event) => this.reverseRotateCard(event));
    this.cardsWrapper.addEventListener('click', (event) => this.audioPlay(event));
    this.startGameButton.addEventListener('click', () => this.startGame());
    this.cardsPage.addEventListener('click', (event) => this.playGame(event));
    this.repeatButton.addEventListener('click', () => this.newWord());
  }

  startGame() {
    document.querySelector('.start-game').style.display = 'none';
    this.stars.style.visibility = 'visible';
    this.repeatButton.style.display = 'block';
    const index = this.category.indexOf(this.currentPage);
    this.randomArray = this.cardData[index].sort(() => Math.random() - 0.5);
    this.errors = 0;
    this.nextElem = 0;
    this.gameMode = true;
    setTimeout(() => this.newWord(), 400);
  }

  playGame(event) {
    const useCard = event.target;
    if (!this.gameMode) return;
    if (!useCard.classList.contains('word-card') || useCard.classList.contains('correctly-word')) return;
    const newStar = document.createElement('div');
    if (useCard.querySelector('.word-control-front .card-title').textContent === this.currentWord) {
      newStar.classList.add('star-win');
      useCard.classList.add('correctly-word');
      this.nextElem += 1;
      this.audio.src = 'audio/correct.mp3';
      if (this.nextElem === 8) {
        setTimeout(() => this.finishGame(), 600);
        return;
      }
      setTimeout(() => this.newWord(), 600);
    } else {
      newStar.classList.add('star-lose');
      this.errors += 1;
      this.audio.src = 'audio/error.mp3';
    }
    this.stars.prepend(newStar);
  }

  newWord() {
    this.currentWord = this.randomArray[this.nextElem].word;
    this.audio.src = `audio/${this.currentWord}.mp3`;
  }

  finishGame() {
    if (this.errors) {
      this.audio.src = 'audio/sad_finish.mp3';
      document.querySelector('.lose-game').style.display = 'block';
      document.querySelector('.lose-game p').textContent = `Errors: ${this.errors}`;
    } else {
      this.audio.src = 'audio/success.mp3';
      document.querySelector('.win-game').style.display = 'block';
    }
    setTimeout(() => {
      document.querySelector('.lose-game').style.display = 'none';
      document.querySelector('.win-game').style.display = 'none';
      this.currentPage = 'MainPage';
      this.highlightingLink();
    }, 3000);
  }

  stopGame() {
    this.cardsPage.querySelector('.start-game').style.display = 'block';
    this.cardsPage.querySelectorAll('.correctly-word').forEach((item) => item.classList.remove('correctly-word'));
    this.errors = 0;
    this.nextElem = 0;
    this.gameMode = false;
    this.repeatButton.style.display = 'none';
    this.stars.innerHTML = '';
  }

  checkClickLink(event) {
    let clickLink = '';
    if (event.target.classList.contains('active-link')) {
      return;
    } if (event.target.classList.contains('nav-link')) {
      clickLink = event.target;
    } else {
      clickLink = event.target.closest('.category-card');
    }
    if (clickLink === null) return;
    this.currentPage = clickLink.getAttribute('href').slice(1);
    this.highlightingLink();
    if (this.currentPage === 'MainPage') return;
    this.createCardsPage();
  }

  highlightingLink() {
    document.querySelectorAll('.nav-link').forEach((item) => {
      item.classList.remove('active-link');
      if (this.currentPage === item.getAttribute('href').slice(1)) {
        item.classList.add('active-link');
      }
    });
    if (this.currentPage === 'MainPage') {
      document.querySelector('.nav-link').classList.add('active-link');
      this.container.append(this.mainPage);
      this.cardsPage.remove();
    }
  }

  createCardsPage() {
    if (this.gameMode) {
      this.stopGame();
    }
    this.mainPage.remove();
    this.container.append(this.cardsPage);
    const index = this.category.indexOf(this.currentPage);
    this.cardData[index].sort(() => Math.random() - 0.5);
    for (let k = 0; k < this.cardsWrapper.children.length; k += 1) {
      this.cardsWrapper.children[k].style.backgroundImage = `url('${this.cardData[index][k].image}')`;
      this.cardsWrapper.children[k].querySelector('.word-control-front .card-title').textContent = this.cardData[index][k].word;
      this.cardsWrapper.children[k].querySelector('.word-control-back .card-title').textContent = this.cardData[index][k].translation;
    }
  }

  audioPlay(event) {
    if (switcher.switcherMode) return;
    if (event.target.classList.contains('rotate')) return;
    const pressCard = event.target.closest('.word-card');
    if (pressCard === null) return;
    const currentWord = pressCard.querySelector('.word-control-front .card-title').textContent;
    this.audio.src = `audio/${currentWord}.mp3`;
  }

  rotateCard(event) {
    if (event.target.classList.contains('rotate')) {
      this.currentCard = event.target.closest('.word-card');
      this.rotate = event.target;
      this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(360deg)';
      this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(180deg)';
      this.currentCard.style.transform = 'rotateY(180deg)';
      this.rotate.style.opacity = '0';
      setTimeout(() => {
        this.rotateMode = true;
      }, 600);
    }
  }

  reverseRotateCard(event) {
    if (this.currentCard) {
      if (this.rotateMode) {
        if (event.toElement.classList.contains('cards-wrapper')) {
          this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(180deg)';
          this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(0deg)';
          this.currentCard.style.transform = 'rotateY(0deg)';
          this.rotate.style.opacity = '1';
          this.rotateMode = false;
        }
      }
    }
  }
}

const game = new Game();
game.createDOM();
game.eventListener();

export default game;
