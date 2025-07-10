import { tns } from 'tiny-slider';
import { menu } from './modules/menu';
import { menuMobile } from './modules/menu';
import mining from './modules/mining';

import './background-check.min.js';

window.addEventListener('DOMContentLoaded', () => {
  BackgroundCheck.refresh();

  mining();

  menu('.promo__menu-hamburger', '.promo__menu-items');
  menu('.mining__menu-hamburger', '.mining__menu-items');
  menuMobile('.mobile__hamburger', '.menu-mobile', '.menu-mobile__close', '.menu-mobile__item');

  const slider = tns({
    container: '.tns',
    items: 1,
    slideBy: 1,
    nav: true,
    loop: true,
    controls: true,
    prevButton: '.promo__controls-prev',
    nextButton: '.promo__controls-next',
    autoplay: true,
    autoplayTimeout: 9000,
    autoplayHoverPause: false,
    autoplayButton: false,
    autoplayButtonOutput: false,
  });

  let slideCurrent = 1;
  const slideBtns = document.querySelectorAll('.promo__controls-prev, .promo__controls-next');
  const slideTotal = document.querySelectorAll('[data-nav]').length;
  const slideCounter = document.querySelector('.promo__controls-counter');

  slideCounter.textContent = `${slideCurrent} / ${slideTotal}`;

  slideBtns.forEach((item) => {
    item.addEventListener('click', () => {
      slideCurrent = +document.querySelector('.tns-nav-active').getAttribute('data-nav') + 1;
      slideCounter.textContent = `${slideCurrent} / ${slideTotal}`;
    });
  });

  slider.events.on('transitionEnd', () => {
    BackgroundCheck.refresh();
  });

  BackgroundCheck.init({
    targets:
      '.promo__controls-counter, .promo__controls-prev, .promo__controls-next, .menu__item, .menu__hamburger, .mobile__hamburger, .promo__breadcrumbs-link, .divider-mobile, .promo__title',
  });

  BackgroundCheck.set('threshold', 80);
});
