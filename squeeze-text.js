(function() {
  'use strict';

  if (typeof window.vebounce === 'undefined') {
    console.error('window.squeezeText requires vebounce.',
                  'https://github.com/wolfemm/vebounce.js');
    return;
  }

  // Extends an object with default properties
  var extend = function(obj, ext) {
    for (var key in ext) {
      if (typeof obj[key] !== 'undefined') {
        obj[key] = ext[key];
      }
    }

    return obj;
  };

  // Does the actual font-size adjustment for an individual element
  function squeeze(el, increment) {
    // Check that the element is actually visible
    if (!el.offsetWidth || !el.offsetHeight) {
      return false;
    }

    var parentWidth = el.parentNode.clientWidth;

    // Reset the elements font-size (incase it was previous applied)
    el.style.fontSize = null;

    if (el.scrollWidth > parentWidth) {
      // Variablize computed font size of this el
      var currentSize = parseInt((window.getComputedStyle(el, null).getPropertyValue('font-size') || el.currentStyle.fontSize), 10);

      // Loop so long as the element is wider than its parent.
      // Each iteration removes one pixel of font size.
      while (el.scrollWidth > parentWidth) {
        currentSize = currentSize - increment;
        el.style.fontSize = (currentSize) + 'px';
      }
    }
  }

  window.squeezeText = function(el, options) {
    options = extend({
      debounce: 150,
      increment: 1
    }, options);

    function run() {
      var length = el.length;

      if (length) {
        for (var i = 0; i < length; i++) {
          squeeze(el[i], options.increment);
        }
      } else {
        squeeze(el, options.increment);
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
