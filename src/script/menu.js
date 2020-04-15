class MenuBurger {
  constructor() {
    this.menuBurger = document.querySelector('.menu-icon');
    this.nav = document.querySelector('.nav');
  }

  eventListener() {
    this.menuBurger.addEventListener('click', () => {
      document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
      this.nav.classList.toggle('nav-hidden');
    });
  }
}

const menuBurger = new MenuBurger();
menuBurger.eventListener();
export default menuBurger;
