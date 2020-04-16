class Category {
  constructor() {
    this.mainPage = document.querySelector('.main-page');
    this.categoryImages = ['Actions', 'Animals (set 1)', 'Animals (set 2)', 'Clothes', 'Emotions', 'Fruits', 'Sweets', 'Vegetables'];
  }

  elementGeneration() {
    const categoryCard = document.querySelector('.category-card');
    for (let i = 1; i < this.categoryImages.length; i += 1) {
      const newElem = categoryCard.cloneNode(true);
      newElem.href = `#${this.categoryImages[i]}`;
      newElem.firstElementChild.style.backgroundImage = `url('images/category/${this.categoryImages[i]}.jpg')`
      newElem.lastElementChild.textContent = this.categoryImages[i];
      this.mainPage.append(newElem);
    }
  }
}

const category = new Category();
category.elementGeneration();

export default category;
