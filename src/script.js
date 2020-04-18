import menu from './script/menu.js';
import category from './script/category.js';
import cards from './script/cards.js';
import switcher from './script/switcher.js';

class Game {
  constructor() {
    this.statisticsWord = JSON.parse(localStorage.getItem('statistics'));
    this.categoryImages = category.categoryImages;
    this.mainPage = category.mainPage;
    this.category = category.categoryImages;
    this.cardData = cards.cardData;
    this.cardsWrapper = cards.cardsWrapper;
    this.startGameButton = switcher.startGame;
    this.nav = menu.nav;
    this.gameMode = false;
    this.audio = new Audio();
    this.audio.autoplay = true;
    this.sortMode = false;
  }

  createDOM() {
    if (this.statisticsWord === null) {
      this.statisticsReset();
    }
    this.table = document.querySelector('table');
    this.statistics = document.querySelector('.statistics');
    this.wrapper = document.querySelector('.wrapper');
    this.container = document.querySelector('.container');
    this.cardsPage = document.querySelector('.cards-page');
    this.repeatButton = document.querySelector('.repeat');
    this.stars = document.querySelector('.stars');
    this.resetButton = document.querySelector('.reset-statistics');
    this.cardsPage.remove();
    this.statistics.remove();
  }

  eventListener() {
    this.table.addEventListener('click', (event) => this.statisticsSort(event));
    this.resetButton.addEventListener('click', () => this.statisticsReset());
    this.wrapper.addEventListener('click', (event) => this.checkClickLink(event));
    this.container.addEventListener('click', (event) => this.rotateCard(event));
    this.container.addEventListener('mousemove', (event) => this.reverseRotateCard(event));
    this.cardsWrapper.addEventListener('click', (event) => this.audioPlay(event));
    this.startGameButton.addEventListener('click', () => this.startGame());
    this.cardsPage.addEventListener('click', (event) => this.playGame(event));
    this.repeatButton.addEventListener('click', () => this.newWord());
    window.addEventListener('unload', () => {
      localStorage.setItem('statistics', JSON.stringify(this.statisticsWord));
    });
  }

  startGame() {
    document.querySelector('.start-game').style.display = 'none';
    this.stars.style.visibility = 'visible';
    this.repeatButton.style.display = 'block';
    const index = this.category.indexOf(this.currentPage);
    this.randomArray = this.cardData[index].sort(() => Math.random() - 0.5);
    this.mistakes = 0;
    this.nextElem = 0;
    this.gameMode = true;
    this.newWord();
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
      this.statisticsWord[this.currentWord].correct += 1;
      this.audio.src = 'audio/correct.mp3';
      if (this.nextElem === 8) {
        setTimeout(() => this.finishGame(), 600);
        return;
      }
      setTimeout(() => this.newWord(), 600);
    } else {
      newStar.classList.add('star-lose');
      this.mistakes += 1;
      this.statisticsWord[this.currentWord].error += 1;
      this.audio.src = 'audio/error.mp3';
    }
    this.stars.prepend(newStar);
  }

  newWord() {
    this.currentWord = this.randomArray[this.nextElem].word;
    this.audio.src = `audio/${this.currentWord}.mp3`;
  }

  finishGame() {
    if (this.mistakes) {
      this.audio.src = 'audio/sad_finish.mp3';
      document.querySelector('.lose-game').style.display = 'block';
      document.querySelector('.lose-game p').textContent = `Mistakes: ${this.mistakes}`;
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
    this.mistakes = 0;
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
    if (this.currentPage === 'MainPage' || this.currentPage === 'Statistics') return;
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
      this.nav.firstElementChild.classList.add('active-link');
      this.container.append(this.mainPage);
      this.cardsPage.remove();
      this.statistics.remove();
    }
    if (this.currentPage === 'Statistics') {
      document.body.append(this.statistics);
      this.cardsPage.remove();
      this.mainPage.remove();
      this.generatorStatistics();
    }
  }

  createCardsPage() {
    if (this.gameMode) {
      this.stopGame();
    }
    this.statistics.remove();
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
    this.statisticsWord[currentWord].click += 1;
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
        if (!event.toElement.classList.contains('word-card')) {
          this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(180deg)';
          this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(0deg)';
          this.currentCard.style.transform = 'rotateY(0deg)';
          this.rotate.style.opacity = '1';
          this.rotateMode = false;
        }
      }
    }
  }

  generatorStatistics() {
    const tableContainer = document.querySelector('tbody');
    tableContainer.innerHTML = '';
    for (let i = 0; i < this.cardData.length; i += 1) {
      for (let z = 0; z < this.cardData[i].length; z += 1) {
        const row = document.createElement('tr');
        const categoryWord = document.createElement('td');
        const word = document.createElement('td');
        const translate = document.createElement('td');
        const clickTrain = document.createElement('td');
        const rightAnswer = document.createElement('td');
        const mistakesInGame = document.createElement('td');
        const percentMistakes = document.createElement('td');
        categoryWord.innerHTML = this.categoryImages[i];
        word.innerHTML = this.cardData[i][z].word;
        translate.innerHTML = this.cardData[i][z].translation;
        clickTrain.innerHTML = this.statisticsWord[this.cardData[i][z].word].click;
        rightAnswer.innerHTML = this.statisticsWord[this.cardData[i][z].word].correct;
        mistakesInGame.innerHTML = this.statisticsWord[this.cardData[i][z].word].error;
        percentMistakes.innerHTML = `${((this.statisticsWord[this.cardData[i][z].word].error
          / (this.statisticsWord[this.cardData[i][z].word].error + this.statisticsWord[this.cardData[i][z].word].correct)) * 100).toFixed(2)}%`;
        if (percentMistakes.textContent === 'NaN%') {
          percentMistakes.textContent = '0.00%';
        }
        row.append(categoryWord);
        row.append(word);
        row.append(translate);
        row.append(clickTrain);
        row.append(rightAnswer);
        row.append(mistakesInGame);
        row.append(percentMistakes);
        tableContainer.append(row);
      }
    }
  }

  statisticsReset() {
    this.statisticsWord = {};
    for (let i = 0; i < this.cardData.length; i += 1) {
      for (let z = 0; z < this.cardData[i].length; z += 1) {
        this.statisticsWord[this.cardData[i][z].word] = {
          error: 0,
          correct: 0,
          click: 0,
        };
      }
    }
    this.generatorStatistics();
  }

  statisticsSort(event) {
    if (event.target.tagName !== 'TH') return;
    const columnNumber = event.toElement.cellIndex;
    this.allRow = document.querySelectorAll('tr');
    if (columnNumber < 3) {
      this.sortWord(columnNumber);
    } else {
      this.sortNum(columnNumber);
    }
    if (this.sortMode) {
      this.sortMode = false;
    } else {
      this.sortMode = true;
    }
  }

  sortWord(columnNumber) {
    for (let i = 1; i < this.allRow.length - 1; i += 1) {
      let min = i;
      for (let j = i + 1; j < this.allRow.length; j += 1) {
        const minRow = this.allRow[min].children[columnNumber].textContent;
        const nextRow = this.allRow[j].children[columnNumber].textContent;
        if (nextRow < minRow && !this.sortMode) {
          min = j;
        } else if (nextRow > minRow && this.sortMode) {
          min = j;
        }
      }
      const dummy = this.allRow[i].innerHTML;
      this.allRow[i].innerHTML = this.allRow[min].innerHTML;
      this.allRow[min].innerHTML = dummy;
    }
  }

  sortNum(columnNumber) {
    for (let i = 1; i < this.allRow.length - 1; i += 1) {
      let min = i;
      for (let j = i + 1; j < this.allRow.length; j += 1) {
        const minRow = parseFloat(this.allRow[min].children[columnNumber].textContent);
        const nextRow = parseFloat(this.allRow[j].children[columnNumber].textContent);
        if (nextRow > minRow && !this.sortMode) {
          min = j;
        } else if (nextRow < minRow && this.sortMode) {
          min = j;
        }
      }
      const dummy = this.allRow[i].innerHTML;
      this.allRow[i].innerHTML = this.allRow[min].innerHTML;
      this.allRow[min].innerHTML = dummy;
    }
  }
}

const game = new Game();
game.createDOM();
game.eventListener();

export default game;
