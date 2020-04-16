class Menu {
  constructor() {
    this.menu = document.querySelector('.menu-icon');
    this.nav = document.querySelector('.nav');
    this.navActive = false;
  }

  eventListener() {
    window.addEventListener('click', (event) => {
      if (!this.navActive || event.target.classList.contains('menu-icon') || event.target.classList.contains('menu-icon-line')) {
        return;
      } else if (event.target.tagName !== 'NAV') {
        document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
        this.nav.classList.add('nav-hidden');
        this.navActive = false;
      }
    });
    this.menu.addEventListener('click', () => {
      document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
      this.nav.classList.toggle('nav-hidden');
      this.navActive = true;
    });
  }
}

const menu = new Menu();
menu.eventListener();
export default menu;
