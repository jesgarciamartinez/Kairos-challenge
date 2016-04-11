(function (document) {
  'use strict';

  var app = document.querySelector('#app');

  app.baseUrl = '/';
  if (window.location.port === '') { // if production
    app.baseUrl = '/kairos-challenge/';
  }

  app.selected = 0;
  app.entryAnimation = 'slide-from-right-animation';
  app.exitAnimation = 'slide-left-animation';

  app._prev = function () {
    this.entryAnimation = 'slide-from-left-animation';
    this.exitAnimation = 'slide-right-animation';
    this.selected = this.selected === 0 ? 0 : (this.selected - 1);
  };
  app._next = function () {
    this.entryAnimation = 'slide-from-right-animation';
    this.exitAnimation = 'slide-left-animation';
    var last = app.slides.length - 1;
    this.selected = this.selected === last ? last : (this.selected + 1);
  };
  app._track = debounce(function (e) {
    e.preventDefault();
    var started = e.detail.state === 'start';
    var goRight = e.detail.dx < 0;
    if (started !== undefined) {
      if (goRight) {
        this._next();
      } else {
        this._prev();
      }
    }
  }.bind(app), 250, true);

  var body = document.querySelector('body');
  body.addEventListener('my-dots-selected-changed', function (e) {
    var values = e.detail;
    var goRight = values.newValue > values.oldValue;
    app.entryAnimation = goRight ?
      'slide-from-right-animation' :
      'slide-from-left-animation';
    app.exitAnimation = goRight ?
      'slide-left-animation' :
      'slide-right-animation';
    app.selected = values.newValue;
  });

  window.addEventListener('WebComponentsReady', function () {
    var pages = document.querySelector('#pages');
    var mutationObserver = new MutationObserver(mutationObserverCallback);
    mutationObserver.observe(pages, {
      childList: true
    });
  });

  var mutationObserverCallback = function () {
    document.querySelector('#spinner')
      .removeAttribute('active');

    // fix pages having no height
    var sliderRect = document.querySelector('#slider').getBoundingClientRect();
    var pages = document.querySelector('#pages');
    pages.style.height = sliderRect.height + 'px';

    // make wide images 100% width, tall images 100% height

    var imgs = [].slice.call(document.querySelectorAll('#pages img'));
    imgs.forEach(function (img) {
      if (img.naturalWidth >= img.naturalHeight) {
        img.style.width = '100%';
        img.style.height = 'auto';

        var imgHeight = pages.getBoundingClientRect().width * img.naturalHeight / img.naturalWidth;
        var imgPos = sliderRect.height / 2 - imgHeight / 2;
        console.log(imgPos);
        img.style.top = imgPos + 'px';
      } else {
        img.style.height = '100%';
        img.style.width = 'auto';

        var imgWidth = sliderRect.height * img.naturalWidth / img.naturalHeight;
        var imgPos = pages.width / 2 - imgWidth / 2;
        img.style.left = imgPos + 'px';
      }
    });
  };

  app.year = new Date()
    .getFullYear();

  function debounce (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

})(document);
