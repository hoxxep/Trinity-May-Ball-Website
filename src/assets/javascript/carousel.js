'use strict';

/**
 * Used in the Portfolio page
 * @class Carousel
 */
class Carousel {
  /**
   * Set up classes on the carousel slides
   * @param element
   */
  constructor(element) {
    this.$element = $(element);
    this.$slides = this.$element.children('.image');
    this.interval = null;

    this.$slides.each((index, slide) => {
      $(slide).addClass('hidden');
    });

    const count = this.$slides.length;

    if (count < 3) {
      console.error('Must have at least 3 images in carousel!');
      alert('Must have at least 3 images in carousel');
      throw new Error('Must have at least 3 images in carousel!');
    } else if (count < 5) {
      console.debug(`Duplicating slides as we have only ${count} slides`);  // eslint-disable-line no-console
      this.$slides.clone().prependTo(this.$element);
      this.$slides = this.$element.children('.image');
    }

    if (!Carousel.detectIE()) {
      this.$element.addClass('transitions');
    }

    this.bind();
    this.startTimer();

    setTimeout(() => {  // animate the carousel load by allowing .transitions to be applied first
      $(this.$slides.get(-2 % count)).addClass('left');
      $(this.$slides.get(-1 % count)).addClass('left').removeClass('hidden');
      $(this.$slides.get(0 % count)).addClass('active').removeClass('hidden');
      $(this.$slides.get(1 % count)).addClass('right').removeClass('hidden');
      $(this.$slides.get(2 % count)).addClass('right');
    }, 0);
  }

  /**
   * Bind the event handlers
   */
  bind() {
    this.$element
      .delegate('.image.left:not(.hidden), .left.arrow', 'click', this.slideRight.bind(this))
      .delegate('.image.right:not(.hidden), .right.arrow', 'click', this.slideLeft.bind(this))
      .mouseenter(this.stopTimer.bind(this))
      .mouseleave(this.startTimer.bind(this));
  }

  /**
   * Move to the right image, sliding all images left
   */
  slideLeft() {
    const count = this.$slides.length;
    const index = this.$slides.filter('.right.hidden').index();

    this.$slides.filter('.left.hidden').removeClass('left');
    this.$slides.filter('.left').addClass('hidden');
    this.$slides.filter('.active').removeClass('active').addClass('left');
    this.$slides.filter('.right').not('.hidden').removeClass('right').addClass('active');
    this.$slides.filter('.right.hidden').removeClass('hidden');
    $(this.$slides.get((index + 1) % count)).addClass('right hidden');
  }

  /**
   * Move to the left image, sliding all images right
   */
  slideRight() {
    const count = this.$slides.length;
    const index = this.$slides.filter('.left.hidden').index();

    this.$slides.filter('.right.hidden').removeClass('right');
    this.$slides.filter('.right').addClass('hidden');
    this.$slides.filter('.active').removeClass('active').addClass('right');
    this.$slides.filter('.left').not('.hidden').removeClass('left').addClass('active');
    this.$slides.filter('.left.hidden').removeClass('hidden');
    $(this.$slides.get((index - 1) % count)).addClass('left hidden');
  }

  /**
   * Set up a 6s interval to scroll through the images
   */
  startTimer() {
    this.stopTimer();
    this.interval = setInterval(this.slideLeft.bind(this), 3000);
  }

  /**
   * Stop the transition interval
   */
  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Detect IE version
   * @returns {number|boolean} version of IE or false, if browser is not Internet Explorer
   */
  static detectIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }
}

// Start the carousel
$(document).ready(() => $('.image.carousel').each((index, element) => {
  new Carousel(element);
}));
