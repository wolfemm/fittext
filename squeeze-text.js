(function() {
  'use strict';

  if (typeof window.vebounce === 'undefined') {
    console.error('window.squeezeText requires vebounce.',
                  'https://github.com/wolfemm/vebounce.js');
    return;
  }

  if (typeof window.fastdom === 'undefined') {
    console.error('window.squeezeText requires fastdom.',
                  'https://github.com/wilsonpage/fastdom');
    return;
  }

  // Extends an object with default properties
  var extend = function(obj, ext) {
    for (var key in ext) {
      if (key in obj) {
        obj[key] = ext[key];
      }
    }

    return obj;
  };

  // Does the actual font-size adjustment for an individual element
  function squeeze(el) {
    window.fastdom.measure(function() {
      // Reset the element's font-size (incase it was previous applied)
      el.style.fontSize = null;

      var elementWidth = el.scrollWidth;

      // Check that the element is actually visible
      if (!elementWidth) {
        return false;
      }

      var parentWidth = el.parentNode.clientWidth;

      if (elementWidth > parentWidth) {
        var baseSize = parseInt((window.getComputedStyle(el, null).getPropertyValue('font-size') || el.currentStyle.fontSize), 10);

        window.fastdom.mutate(function() {
          el.style.fontSize = ((parentWidth / elementWidth) * baseSize) + 'px';
        });
      }
    });
  }

  window.squeezeText = function(el, options) {
    var elCount = el ? el.length : 0;

    if (elCount === 0) {
      return;
    }

    options = extend({
      debounce: 150
    }, options);

    function run() {
      if (elCount) {
        for (var i = 0; i < elCount; i++) {
          squeeze(el[i]);
        }
      } else {
        squeeze(el);
      }
    }

    // Sometimes the browser rapidly triggers the resize event, so it's best
    // that we debounce the call when involving events.
    var debouncedSqueeze = window.vebounce(squeeze, options.debounce);

    // Run once right off the bat without debouncing.
    run();

    if (window.addEventListener) {
      window.addEventListener('resize', run, false);
    } else {
      window.attachEvent('onResize', run);
    }

    return this;
  };
}());
