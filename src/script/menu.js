class Menu {
  constructor() {
    this.menu = document.querySelector('.menu-icon');
    this.nav = document.querySelector('.nav');
    this.navActive = false;
  }

  eventListener() {
    window.addEventListener('click', (event) => {
      const clickTarget = event.target;
      if (clickTarget.closest('.menu-icon') && !this.navActive) {
        document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
        this.nav.classList.toggle('nav-hidden');
        this.navActive = true;
      } else if (clickTarget.tagName !== 'NAV' && this.navActive) {
        document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
        this.nav.classList.add('nav-hidden');
        this.navActive = false;
      }
    });
  }
}

const menu = new Menu();
menu.eventListener();
export default menu;
