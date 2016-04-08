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
  app._track = function (e) {
    e.preventDefault();
    var started = e.detail.state === 'start';
    var goRight = e.detail.dx < 0;
    if (started !== undefined) {
      console.log('started ', started);
      if (goRight) {
        this._next();
      } else {
        this._prev();
      }
    }
  };

  var body = document.querySelector('body');
  body.addEventListener('my-dots-selected-changed', function (e) {
    console.log('listener for selected ', e);
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
    var slider = document.querySelector('#slider');
    var mutationObserver = new MutationObserver(mutationObserverCallback);
    mutationObserver.observe(slider, {childList: true });
  });

  var mutationObserverCallback = function () {
    document.querySelector('#spinner').removeAttribute('active');
  };
})(document);
