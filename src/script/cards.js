import cardData from './Data/cardData.js';

class Cards {
  constructor() {
    this.cardsPage = document.querySelector('.cards-page');
    this.cardData = cardData;
  }

  elementGeneration() {
    const wordCard = document.querySelector('.word-card');
    for (let j = 0; j < this.cardData.length; j += 1) {
      const newElem = wordCard.cloneNode(true);
      this.cardsPage.append(newElem);
    }
  }
}

const card = new Cards();
card.elementGeneration();

export default card;
