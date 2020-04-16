import menuBurger from './script/menu.js';
import category from './script/category.js';
import cards from './script/cards.js';
import menu from './script/menu.js';
import switcher from './script/switcher.js';


class Game {
  constructor() {
    this.mainPage = category.mainPage;
    this.category = category.categoryImages;
    this.cardData = cards.cardData;
    this.cardsWrapper = cards.cardsWrapper;
    this.startGameButton = switcher.startGame;
  }

  createDOM() {
    this.wrapper = document.querySelector('.wrapper');
    this.container = document.querySelector('.container');
    this.cardsPage = document.querySelector('.cards-page')
    this.cardsPage.remove();
  }

  eventListener() {
    this.wrapper.addEventListener('click', (event) => this.checkClickLink(event));
    this.container.addEventListener('click', (event) => this.rotateCard(event));
    this.container.addEventListener('mousemove', (event) => this.reverseRotateCard(event));
    this.cardsWrapper.addEventListener('click', (event) => this.audioPlay(event));
    this.startGameButton.addEventListener('click', () => this.startGame());
    this.cardsPage.addEventListener('click', (event) => this.playGame(event));
  }

  startGame() {
    const index = this.category.indexOf(this.currentPage);
    this.randomArray = this.cardData[index].sort(() => Math.random() - 0.5);
    this.errors = 0;
    this.correct = 0;
    this.nextElem = 0;
  }

  playGame() {

  }


  checkClickLink(event) {
    let clickLink = '';
    if (event.target.classList.contains('active-link')) {
      return;
    } else if (event.target.classList.contains('nav-link')) {
      clickLink = event.target;
    } else {
      clickLink = event.target.closest('.category-card')
    }

    if (clickLink === null) return;
    this.currentPage = clickLink.getAttribute('href').slice(1);
    document.querySelectorAll('.nav-link').forEach(item => {
      item.classList.remove('active-link')
      if (this.currentPage === item.getAttribute('href').slice(1)) {
        item.classList.add('active-link');
      }
    });
    if (this.currentPage === 'MainPage') {
      document.querySelector('.nav-link').classList.add('active-link');
      this.container.append(this.mainPage);
      this.cardsPage.remove();
      return;
    }
    this.createCardsPage(this.currentPage);
  }

  createCardsPage(currentPage) {
    this.mainPage.remove();
    this.container.append(this.cardsPage);
    const index = this.category.indexOf(currentPage);
    this.cardData[index].sort(() => Math.random() - 0.5);
    let i = 0;
    for (let node of this.cardsWrapper.children) {
      node.style.backgroundImage = `url('${this.cardData[index][i].image}')`
      node.querySelector('.word-control-front .card-title').textContent = this.cardData[index][i].word;
      node.querySelector('.word-control-back .card-title').textContent = this.cardData[index][i].translation;
      i++;
    }
  }

  audioPlay(event) {
    if (switcher.switcherMode) return;
    if (event.target.classList.contains('rotate')) return;
    const pressCard = event.target.closest('.word-card')
    if (pressCard === null) return;
    const currentWord = pressCard.querySelector('.word-control-front .card-title').textContent;
    const audio = new Audio();
    audio.src = `audio/${currentWord}.mp3`
    audio.autoplay = true;
  }

  rotateCard(event) {
    if (event.target.classList.contains('rotate')) {
      this.currentCard = event.target.closest('.word-card');
      this.rotate = event.target;
      this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(360deg)';
      this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(180deg)';
      this.currentCard.style.transform = 'rotateY(180deg)';
      this.rotate.style.opacity = '0'
      setTimeout(() => this.rotateMode = true, 600);
    }
  }

  reverseRotateCard(event) {
    if (this.currentCard) {
      if (this.rotateMode) {
        if (event.toElement.classList.contains('cards-wrapper')) {
          console.log(event.toElement)
          this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(180deg)';
          this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(0deg)';
          this.currentCard.style.transform = 'rotateY(0deg)';
          this.rotate.style.opacity = '1'
          this.rotateMode = false;
        }
      } else {
        return;
      }
    }
  }
}

const game = new Game();
game.createDOM();
game.eventListener();

