class Switcher {
  constructor() {
    this.switcherMode = false;
    this.switcher = document.querySelector('.switch');
  }

  eventListener() {
    this.switcher.addEventListener('click', () => {
      if (!this.switcherMode) {
        this.switcher.textContent = 'PLAY';
        this.switcherMode = true;
      } else {
        this.switcher.textContent = 'TRAIN';
        this.switcherMode = false;
      }
    });
  }
}

const switcher = new Switcher();
switcher.eventListener();
export default switcher;
