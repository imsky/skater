/** 
 * Skater - simple smooth scrolling
 * Version 0.9.3
 * © 2019 Ivan Malopinsky
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Skater = factory());
}(this, function () { 'use strict';

  // todo: demo page
  // todo: cdnjs
  // 1.0

  var documentElement = document.documentElement;
  var requestAnimationFrame = window.requestAnimationFrame;

  var skating = false;

  /**
   * Throw error
   * @param {string} message - error message
   * @returns {void} N/A
   */
  function error(message) {
    throw Error(message);
  }

  /**
   * Source: https://github.com/jquery/jquery
   * @param {*} value arbitrary value
   * @returns {boolean} is value numeric?
   */
  function isNumeric(value) {
    return value - parseFloat(value) + 1 >= 0;
  }

  /**
   * Source: https://github.com/danro/jquery-easing
   * @param {number} deltaTime - time elapsed so far
   * @param {number} startValue - the starting value
   * @param {number} deltaValue - the amount to change from starting value
   * @param {number} totalTime - total time for animation
   * @returns {number} current value at deltaTime between startValue and startValue + deltaValue
   */
  function easeInOutQuad(deltaTime, startValue, deltaValue, totalTime) {
    if ((deltaTime /= totalTime / 2) < 1)
      { return (deltaValue / 2) * deltaTime * deltaTime + startValue; }
    return (-deltaValue / 2) * (--deltaTime * (deltaTime - 2) - 1) + startValue;
  }

  /**
   * A "skater" represents a scrolling movement from a starting point to a target.
   * @typedef {Object} Skater
   * @property {function} start - Start moving
   * @property {function} stop - Stop moving
   */

  /**
   * @param {object} startPosition - the x/y coordinates where the scrolling starts
   * @param {object} endPosition - the x/y coordinates where the scrolling ends
   * @param {number} durationMs - how long (in milliseconds) the scroll should take
   * @param {function} durationFn - custom duration function that overrides durationMs; takes one argument of the form {"x": 0, "y": 0} where the properties x and y represent distance between the scroll start and finish
   * @param {object} containerElement - an Element that, if set, will be scrolled instead of the document
   * @param {function} easingFn - custom easing function using the jquery-easing function signature
   * @param {function} callbackFn - callback to execute once scroll finishes
   * @param {function} setSkatingFn - function to set scrolling state
   * @returns {Skater} "skater" object with start and stop functions
   */
  function createSkater(
    startPosition,
    endPosition,
    durationMs,
    durationFn,
    containerElement,
    easingFn,
    callbackFn,
    setSkatingFn
  ) {
    var deltaPosition = {
      x: endPosition.x - startPosition.x,
      y: endPosition.y - startPosition.y
    };
    var startTime;
    var requestID;

    durationMs = durationFn ? durationFn(deltaPosition) : durationMs;

    if (durationMs < 0 || !isNumeric(durationMs)) {
      error(("Invalid duration: " + durationMs));
    }

    function animate(currentTime) {
      startTime = startTime || currentTime;
      var deltaTime = Math.min(durationMs, currentTime - startTime);
      var x = Math.round(
        easingFn(deltaTime, startPosition.x, deltaPosition.x, durationMs)
      );
      var y = Math.round(
        easingFn(deltaTime, startPosition.y, deltaPosition.y, durationMs)
      );

      if (containerElement) {
        containerElement.scrollLeft = x;
        containerElement.scrollTop = y;
      } else {
        window.scrollTo(x, y);
      }

      if (deltaTime < durationMs) {
        requestID = requestAnimationFrame(animate);
      } else {
        requestAnimationFrame(function () {
          setSkatingFn(false);
          if (typeof callbackFn === 'function') {
            callbackFn();
          }
        });
      }
    }

    return {
      start: function start() {
        if (
          !requestID &&
          (Math.abs(deltaPosition.y) > 0 || Math.abs(deltaPosition.x) > 0)
        ) {
          requestID = requestAnimationFrame(animate);
          setSkatingFn(true);
        }
      },
      stop: function stop() {
        window.cancelAnimationFrame(requestID);
        setSkatingFn(false);
      }
    };
  }

  /**
   * @param {string|object} target - an Element or a CSS selector to resolve to an Element
   * @returns {object} document element
   */
  function getElement(target) {
    if (typeof target === 'string') {
      return document.querySelector(target);
    } else if (typeof target === 'object' && target !== null) {
      return target;
    } else {
      error('Invalid target');
    }
  }

  /**
   * @param {boolean} value - whether a "skater" is currently moving
   * @returns {boolean} value
   */
  function setSkatingFn(value) {
    skating = value;
    return value;
  }

  /**
   * Scroll towards a target.
   * @param {number|string|object} target - a CSS selector, Element, or number representing a target to scroll to
   * @param {object} [options] - custom options
   * @param {function} [options.callbackFn] - callback to execute once scroll finishes
   * @param {string|object} [options.containerTarget] - set to scroll inside specified container; value can be a CSS selector or an Element
   * @param {function} [options.durationFn] - custom duration function that overrides durationMs; takes one argument of the form {"x": 0, "y": 0} where the properties x and y represent distance between the scroll start and finish
   * @param {number} [options.durationMs=1000] - how long (in milliseconds) the scroll should take
   * @param {function} [options.easingFn] - custom easing function using the jquery-easing function signature
   * @param {object} [options.offset] - scroll position offset from target, of the form {"x": 0, "y": 0}
   * @param {string} [options.scrollDirection="y"] - "y" scrolls only vertically, "x" scrolls only horizontally, "xy" scrolls in both directions
   * @returns {Skater|undefined} returns an object with start and stop functions; returns undefined if target does not exist
   */
  function API(target, options) {
    if ( options === void 0 ) options = {};

    var callbackFn = options.callbackFn;
    var containerTarget = options.containerTarget;
    var durationFn = options.durationFn;
    var durationMs = options.durationMs; if ( durationMs === void 0 ) durationMs = 1000;
    var easingFn = options.easingFn; if ( easingFn === void 0 ) easingFn = easeInOutQuad;
    var offset = options.offset;
    var scrollDirection = options.scrollDirection; if ( scrollDirection === void 0 ) scrollDirection = 'y';

    if (
      scrollDirection !== 'x' &&
      scrollDirection !== 'y' &&
      scrollDirection !== 'xy'
    ) {
      error(("Invalid scroll direction: " + scrollDirection));
    }

    var startPosition = {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
    };

    var containerElement;
    var containerElementGeometry;

    if (containerTarget) {
      containerElement = getElement(containerTarget);
      containerElementGeometry = containerElement.getBoundingClientRect();
      startPosition = {
        x: containerElement.scrollLeft,
        y: containerElement.scrollTop
      };
    }

    var endPosition;

    if (typeof target === 'number') {
      endPosition = {
        x: scrollDirection !== 'y' ? target : 0,
        y: scrollDirection !== 'x' ? target : 0
      };
    } else {
      var element = getElement(target);

      if (!element) {
        return;
      }

      var elementGeometry = element.getBoundingClientRect();
      var lockX = scrollDirection.indexOf('x') === -1;
      var lockY = scrollDirection.indexOf('y') === -1;

      endPosition = {
        x: lockX ? startPosition.x : elementGeometry.x + startPosition.x,
        y: lockY ? startPosition.y : elementGeometry.y + startPosition.y
      };

      var scrollHeight = documentElement.scrollHeight;
      var scrollWidth = documentElement.scrollWidth;
      var innerHeight = window.innerHeight;
      var innerWidth = window.innerWidth;

      if (containerElementGeometry) {
        endPosition.x = endPosition.x - (lockX ? 0 : containerElementGeometry.x);
        endPosition.y = endPosition.y - (lockY ? 0 : containerElementGeometry.y);
        scrollHeight = containerElement.scrollHeight;
        scrollWidth = containerElement.scrollWidth;
        innerHeight = containerElementGeometry.height;
        innerWidth = containerElementGeometry.width;
      }

      if (scrollHeight - endPosition.y <= innerHeight) {
        endPosition.y = scrollHeight - innerHeight;
      }

      if (scrollWidth - endPosition.x <= innerWidth) {
        endPosition.x = scrollWidth - innerWidth;
      }
    }

    if (offset && isNumeric(offset.x) && isNumeric(offset.y)) {
      endPosition.x = endPosition.x + offset.x;
      endPosition.y = endPosition.y + offset.y;
    }

    var skater = createSkater(
      startPosition,
      endPosition,
      durationMs,
      durationFn,
      containerElement,
      easingFn,
      callbackFn,
      setSkatingFn
    );

    if (!skating) {
      skater.start();
    }

    return skater;
  }

  API.version = '0.9.3';

  return API;

}));
