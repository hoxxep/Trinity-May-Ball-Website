'use strict';

/**
 * JavaScript for the header and navigation
 * @class Header
 */
class Header {
  constructor(navbarId, headerId) {
    this.$navbar = $(navbarId);
    this.$header = $(headerId);
    this.$mobileToggle = this.$navbar.find('.mobile.toggle a');
    this.$mobileMenu = this.$navbar.children('.ui.mobile.container');
    this.$window = $(window);
    this.scrolling = false;
    this.lastScrollPosition = 9999999;
    this.menuLastToggled = new Date(0);

    this.bind();
    this.scroll();

    if (this.$window.scrollTop() >= 200) {
      this.$navbar.addClass('slide-down');
    }
  }

  /**
   * Bind the header to scroll and toggle events
   */
  bind() {
    this.$window.scroll(this.scroll.bind(this));

    this.$window.resize(() => {
      if (this.$navbar.hasClass('mobile open') && this.$window.width() >= 768) {
        this.closeMobileMenu();
      }
    });

    this.$mobileToggle.click(this.toggleMobileMenu.bind(this));

    this.$mobileMenu.find('.menu-item-has-children').click((e) => {
      const $link = $(e.target).closest('.menu-item-has-children');
      const $menu = $link.children('ul');

      if (!$menu.hasClass('open')) {
        this.$mobileMenu.find('.menu-item-has-children ul').not($menu).slideUp(300).removeClass('open');
        $menu.slideDown(300).addClass('open');
        e.preventDefault();
      }
    });

    const self = this;
    $('a[href*="#"]:not([href="#"])').click(function (e) {
      self.smoothScroll.apply(this, [self, e]);
    });
  }

  /**
   * Handle the window scroll event
   */
  scroll() {
    let scrollPosition = this.$window.scrollTop();

    if (scrollPosition > 100) {
      if (this.lastScrollPosition === scrollPosition) {
        return;
      }

      if (!this.scrolling) {
        this.scrolling = true;
        this.$navbar.addClass('scrolling');
      } else if (this.lastScrollPosition < scrollPosition || scrollPosition < 200) {
        this.$navbar.addClass('slide-up').removeClass('slide-down');
      } else {
        this.$navbar.removeClass('slide-up').addClass('slide-down');
      }
    } else {
      if (this.scrolling) {
        this.scrolling = false;

        // prevent animations from occurring
        this.$navbar
          .removeClass('scrolling')
          .removeClass('slide-up')
          .removeClass('slide-down');
      }
    }

    this.lastScrollPosition = scrollPosition;
  }

  /**
   * Smooth scroll effect, closing mobile menu
   */
  smoothScroll(self, e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        self.closeMobileMenu();

        let offset = target.offset().top;

        if ($(window).width() > 767) {
          if (target.hasClass('extremely padded')) {
            offset += 80;
          } else if (target.hasClass('extra padded')) {
            offset += 20;
          } else if (target.hasClass('history section')) {
            offset += 50;
          } else if (!target.hasClass('padded')) {
            offset -= 50;
          }
        } else {
          if (target.hasClass('padded') || target.hasClass('history section')) {
            offset -= 30;
          } else {
            offset -= 80;
          }
        }

        if (offset < 0) {
          offset = 0;
        }

        $('html, body').animate({
          scrollTop: offset
        }, 350);

        e.preventDefault();
      }
    }
  }

  /**
   * Show/hide the mobile menu
   */
  toggleMobileMenu() {
    const now = new Date();

    // debouncing
    if (now.getTime() - 700 < this.menuLastToggled.getTime()) {
      return false;
    } else {
      this.menuLastToggled = new Date();
    }

    // toggling
    if (this.$navbar.hasClass('mobile open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open the mobile menu and handle animations
   */
  openMobileMenu() {
    $('.mobile.slice').addClass('active');
    this.$navbar.addClass('mobile open');
    $('body').addClass('mobile open');

    setTimeout(() => {
      this.$navbar.find('.ui.mobile.container').fadeIn(350);
    }, 300);
  }

  /**
   * Close the mobile menu, handling animations
   */
  closeMobileMenu() {
    this.$mobileMenu.find('.menu-item-has-children ul').slideUp(300).removeClass('open');
    this.$navbar.find('.ui.mobile.container').fadeOut(300);
    $('body').removeClass('mobile open');

    setTimeout(() => {
      this.$navbar.removeClass('mobile open');
      $('.mobile.slice').removeClass('active');
      this.scroll();
    }, 300);
  }
}

$(document).ready(() => new Header('#navigation-bar', '#masthead'));
