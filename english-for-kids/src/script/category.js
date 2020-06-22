class Category {
  constructor() {
    this.mainPage = document.querySelector('.main-page');
    this.categoryImages = ['Actions', 'Animals (set 1)', 'Animals (set 2)', 'Clothes', 'Emotions', 'Fruits', 'Sweets', 'Vegetables'];
  }

  elementGeneration() {
    const categoryCard = document.querySelector('.category-card');
    for (let i = 1; i < this.categoryImages.length; i += 1) {
      const newCard = categoryCard.cloneNode(true);
      newCard.href = `#${this.categoryImages[i]}`;
      newCard.querySelector('.category-card-image').style.backgroundImage = `url('images/category/${this.categoryImages[i]}.jpg')`;
      newCard.querySelector('h2').textContent = this.categoryImages[i];
      this.mainPage.append(newCard);
    }
  }
}

const category = new Category();
category.elementGeneration();

export default category;
