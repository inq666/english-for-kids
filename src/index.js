const menu = document.querySelector('.menu-icon');
const nav = document.querySelector('.nav');

menu.addEventListener('click', () => {
  document.querySelector('.menu-icon-line').classList.toggle('menu-icon-active');
   nav.classList.toggle('nav-hidden');
})
