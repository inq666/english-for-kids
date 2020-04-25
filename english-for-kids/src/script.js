import menu from './script/menu';
import category from './script/category';
import cards from './script/cards';
import switcher from './script/switcher';

class Game {
  constructor() {
    this.audio = new Audio();
    this.audio.autoplay = true;
    this.statisticsWord = JSON.parse(localStorage.getItem('statistics'));
    this.gameMode = false;
    this.sortMode = false;
    this.difficultMode = false;
  }

  createDOM() {
    this.mainPage = category.mainPage;
    this.cardData = cards.cardData;
    this.cardsWrapper = cards.cardsWrapper;
    this.startGameButton = switcher.startGame;

    this.repeatButton = document.querySelector('.repeat');
    this.resetButton = document.querySelector('.reset-statistics');
    this.backButton = document.querySelector('.back-statisctics');

    this.statistics = document.querySelector('.statistics');
    this.difficultWords = document.querySelector('.difficult-words');
    this.difficultCards = document.querySelector('.difficult-cards');
    this.repeatDifficult = document.querySelector('.repeat-difficult');


    this.container = document.querySelector('.container');
    this.cardsPage = document.querySelector('.cards-page');

    this.stars = document.querySelector('.stars');
    this.table = document.querySelector('table');
    if (!this.statisticsWord) {
      this.statisticsReset();
    }
    this.cardsPage.remove();
    this.statistics.remove();
    this.difficultWords.remove();
  }

  eventListener() {
    this.backButton.addEventListener('click', (event) => this.generatorStatistics(event));
    this.repeatDifficult.addEventListener('click', () => this.generatorDifficultWord());
    this.table.addEventListener('click', (event) => this.statisticsSort(event));
    this.resetButton.addEventListener('click', () => this.statisticsReset());
    window.addEventListener('click', (event) => this.checkClickLink(event));
    this.container.addEventListener('click', (event) => this.rotateCard(event));
    window.addEventListener('mousemove', (event) => this.reverseRotateCard(event));
    this.cardsPage.addEventListener('click', (event) => this.audioPlay(event));
    this.startGameButton.addEventListener('click', () => this.startGame());
    this.cardsPage.addEventListener('click', (event) => this.playGame(event));
    this.repeatButton.addEventListener('click', () => this.newWord());
    window.addEventListener('unload', () => {
      localStorage.setItem('statistics', JSON.stringify(this.statisticsWord));
    });
  }

  generatorDifficultWord() {
    if (this.gameMode) {
      this.stopGame();
    }
    if (switcher.switcherMode) {
      this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'none');
    }
    const columnPercent = 6;
    this.backButton.style.display = 'block';
    this.currentPage = 'Statistics';
    this.allRow = document.querySelectorAll('tr');
    this.statistics.remove();
    this.cardsWrapper.remove();
    this.container.append(this.cardsPage);
    this.cardsPage.append(this.difficultWords);
    this.difficultCards.innerHTML = '';
    this.sortMode = false;
    this.sortNum(columnPercent);
    this.difficultWordsArray = [];
    this.difficultMode = true;
    for (let i = 0; i < this.cardData.length; i += 1) {
      if (this.allRow[i + 1].children[columnPercent].textContent === '0.00%' || i >= this.cardData.length) {
        document.querySelector('.no-mistakes').style.display = 'none';
        if (i === 0) {
          switcher.switcher.style.display = 'none';
          document.querySelector('.no-mistakes').style.display = 'block';
          this.startGameButton.style.display = 'none';
        }
        if (!switcher.switcherMode) this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'block');
        this.difficultWordsArray.sort(() => Math.random() - 0.5);
        return;
      }
      const categoryWord = this.allRow[i + 1].children[0].textContent.toLocaleLowerCase();
      const word = this.allRow[i + 1].children[1].textContent;
      const translate = this.allRow[i + 1].children[2].textContent;
      const newDifficultCard = this.cardsWrapper.children[0].cloneNode(true);
      newDifficultCard.style.backgroundImage = `url('images/${categoryWord}/${word}.jpg')`;
      newDifficultCard.querySelector('.word-control-front .card-title').textContent = word;
      newDifficultCard.querySelector('.word-control-back .card-title').textContent = translate;
      this.difficultCards.append(newDifficultCard);
      this.difficultWordsArray.push(word);
    }
  }

  startGame() {
    this.startGameButton.style.display = 'none';
    this.stars.style.visibility = 'visible';
    this.repeatButton.style.display = 'block';
    if (!this.difficultMode) {
      const index = category.categoryImages.indexOf(this.currentPage);
      this.randomArray = this.cardData[index].sort(() => Math.random() - 0.5);
    }
    this.mistakes = 0;
    this.nextElem = 0;
    this.gameMode = true;
    this.newWord();
  }

  playGame(event) {
    const MAXCARDS = 8;
    const useCard = event.target;
    const newStar = document.createElement('div');
    if (!this.gameMode || !useCard.classList.contains('word-card') || useCard.classList.contains('correctly-word')) return;
    if (useCard.querySelector('.word-control-front .card-title').textContent === this.currentWord) {
      newStar.classList.add('star-win');
      useCard.classList.add('correctly-word');
      this.nextElem += 1;
      this.statisticsWord[this.currentWord].correct += 1;
      this.audio.src = 'audio/correct.mp3';
      if (this.nextElem === MAXCARDS || (this.difficultMode && this.nextElem === this.difficultWordsArray.length)) {
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
    if (!this.difficultMode) {
      this.currentWord = this.randomArray[this.nextElem].word;
    } else {
      this.currentWord = this.difficultWordsArray[this.nextElem];
    }
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
    this.startGameButton.style.display = 'block';
    this.cardsPage.querySelectorAll('.correctly-word').forEach((item) => item.classList.remove('correctly-word'));
    this.mistakes = 0;
    this.nextElem = 0;
    this.gameMode = false;
    this.repeatButton.style.display = 'none';
    this.stars.innerHTML = '';
  }

  checkClickLink(event) {
    let clickLink = '';
    if (event.target.classList.contains('active-link')) return;
    if (event.target.classList.contains('nav-link')) {
      clickLink = event.target;
    } else {
      clickLink = event.target.closest('.category-card');
    }
    if (!clickLink) return;
    this.currentPage = clickLink.getAttribute('href').slice(1);
    this.highlightingLink();
    if (this.currentPage === 'MainPage' || this.currentPage === 'Statistics') return;
    this.createCardsPage();
  }

  highlightingLink() {
    this.cardsPage.querySelector('.title-cards').textContent = '';
    this.difficultMode = false;
    switcher.switcher.style.display = 'block';
    document.querySelectorAll('.nav-link').forEach((item) => {
      item.classList.remove('active-link');
      if (this.currentPage === item.getAttribute('href').slice(1)) {
        item.classList.add('active-link');
      }
    });
    if (this.currentPage === 'MainPage') {
      menu.nav.firstElementChild.classList.add('active-link');
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
    this.difficultWords.remove();
    this.cardsPage.append(this.cardsWrapper);
    this.container.append(this.cardsPage);
    this.cardsPage.querySelector('.title-cards').textContent = this.currentPage;
    const index = category.categoryImages.indexOf(this.currentPage);
    this.cardData[index].sort(() => Math.random() - 0.5);
    for (let k = 0; k < this.cardsWrapper.children.length; k += 1) {
      this.cardsWrapper.children[k].style.backgroundImage = `url('${this.cardData[index][k].image}')`;
      this.cardsWrapper.children[k].querySelector('.word-control-front .card-title').textContent = this.cardData[index][k].word;
      this.cardsWrapper.children[k].querySelector('.word-control-back .card-title').textContent = this.cardData[index][k].translation;
    }
    if (switcher.switcherMode) {
      this.startGameButton.style.display = 'block';
      this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'none');
    } else {
      this.cardsPage.querySelectorAll('.bottom-panel').forEach((item) => item.style.display = 'block');
    }
  }

  audioPlay(event) {
    const pressCard = event.target.closest('.word-card');
    if (switcher.switcherMode || event.target.classList.contains('rotate') || pressCard === null) return;
    const currentWord = pressCard.querySelector('.word-control-front .card-title').textContent;
    this.statisticsWord[currentWord].click += 1;
    this.audio.src = `audio/${currentWord}.mp3`;
  }

  rotateCard(event) {
    this.rotate = event.target;
    if (this.rotate.classList.contains('rotate')) {
      this.currentCard = this.rotate.closest('.word-card');
      this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(360deg)';
      this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(180deg)';
      this.currentCard.style.transform = 'rotateY(180deg)';
      setTimeout(() => {
        this.rotateMode = true;
      }, 300);
    }
  }

  reverseRotateCard(event) {
    if (event.toElement.closest('.word-card') !== this.currentCard && this.rotateMode && this.currentCard) {
      this.currentCard.querySelector('.word-control-back').style.transform = 'rotateY(180deg)';
      this.currentCard.querySelector('.word-control-front').style.transform = 'rotateY(0deg)';
      this.currentCard.style.transform = 'rotateY(0deg)';
      this.rotateMode = false;
    }
  }

  generatorStatistics(event) {
    if (event && event.target.closest('.back-statisctics')) {
      this.cardsPage.remove();
      document.body.append(this.statistics);
      switcher.switcher.style.display = 'block';
    }
    const tableContainer = this.table.querySelector('tbody');
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
        const errorWord = this.statisticsWord[this.cardData[i][z].word].error;
        const correctWord = this.statisticsWord[this.cardData[i][z].word].correct;
        categoryWord.innerHTML = category.categoryImages[i];
        word.innerHTML = this.cardData[i][z].word;
        translate.innerHTML = this.cardData[i][z].translation;
        clickTrain.innerHTML = this.statisticsWord[this.cardData[i][z].word].click;
        rightAnswer.innerHTML = correctWord;
        mistakesInGame.innerHTML = errorWord;
        if (errorWord) {
          percentMistakes.innerHTML = `${((errorWord / (errorWord + correctWord)) * 100).toFixed(2)}%`;
        } else {
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
