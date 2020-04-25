import cardData from './data/cardData';

class Cards {
  constructor() {
    this.cardsWrapper = document.querySelector('.cards-wrapper');
    this.cardData = cardData;
  }

  elementGeneration() {
    const wordCard = document.querySelector('.word-card');
    for (let j = 1; j < this.cardData.length; j += 1) {
      const newElem = wordCard.cloneNode(true);
      this.cardsWrapper.append(newElem);
    }
  }
}

const cards = new Cards();
cards.elementGeneration();

export default cards;
