const documentElement = document.documentElement;
const requestAnimationFrame = window.requestAnimationFrame;

let skaters = [];

/**
 * Remove reference of Skater container from skaters array, allowing another Skater to run in the same container
 * @param {Object} skaterRef - Reference of Skater container, window or Element
 * @returns {void}
 */
function removeSkaterRef(skaterRef) {
  skaters.splice(skaters.indexOf(skaterRef), 1);
}

/**
 * Throw error
 * @param {string} message - error message
 * @returns {void}
 */
function error(message) {
  throw Error(message);
}

/**
 * Source: https://github.com/jquery/jquery
 * @param {*} value arbitrary value
 * @returns {boolean} is the value numeric?
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
    return (deltaValue / 2) * deltaTime * deltaTime + startValue;
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
 * @returns {Skater} "skater" object with start and stop functions
 */
function createSkater(
  startPosition,
  endPosition,
  durationMs,
  durationFn,
  containerElement,
  easingFn,
  callbackFn
) {
  const deltaPosition = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y
  };
  const skaterRef = containerElement || window;
  let startTime;
  let requestID;

  durationMs = durationFn ? durationFn(deltaPosition) : durationMs;

  if (durationMs < 0 || !isNumeric(durationMs)) {
    error(`Invalid duration: ${durationMs}`);
  }

  function animate(currentTime) {
    startTime = startTime || currentTime;
    const deltaTime = Math.min(durationMs, currentTime - startTime);
    const x = Math.round(
      easingFn(deltaTime, startPosition.x, deltaPosition.x, durationMs)
    );
    const y = Math.round(
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
      requestAnimationFrame(() => {
        removeSkaterRef(skaterRef);
        if (typeof callbackFn === 'function') {
          callbackFn();
        }
      });
    }
  }

  return {
    start: function start() {
      if (
        skaters.indexOf(skaterRef) === -1 &&
        !requestID &&
        (Math.abs(deltaPosition.y) > 0 || Math.abs(deltaPosition.x) > 0)
      ) {
        requestID = requestAnimationFrame(animate);
        skaters.push(skaterRef);
      }
    },
    stop: function stop() {
      window.cancelAnimationFrame(requestID);
      removeSkaterRef(skaterRef);
    }
  };
}

/**
 * @param {object|string} target - an Element or a CSS selector to resolve to an Element
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
function API(target, options = {}) {
  const {
    callbackFn,
    containerTarget,
    durationFn,
    durationMs = 1000,
    easingFn = easeInOutQuad,
    offset,
    scrollDirection = 'y'
  } = options;

  if (
    scrollDirection !== 'x' &&
    scrollDirection !== 'y' &&
    scrollDirection !== 'xy'
  ) {
    error(`Invalid scroll direction: ${scrollDirection}`);
  }

  let startPosition = {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset
  };

  let containerElement;
  let containerElementGeometry;

  if (containerTarget) {
    containerElement = getElement(containerTarget);
    containerElementGeometry = containerElement.getBoundingClientRect();
    startPosition = {
      x: containerElement.scrollLeft,
      y: containerElement.scrollTop
    };
  }

  let endPosition;

  if (isNumeric(target)) {
    endPosition = {
      x: scrollDirection !== 'y' ? target : 0,
      y: scrollDirection !== 'x' ? target : 0
    };
  } else {
    const element = getElement(target);

    if (!element) {
      return;
    }

    const elementGeometry = element.getBoundingClientRect();
    const lockX = scrollDirection.indexOf('x') === -1;
    const lockY = scrollDirection.indexOf('y') === -1;

    endPosition = {
      x: lockX ? startPosition.x : elementGeometry.x + startPosition.x,
      y: lockY ? startPosition.y : elementGeometry.y + startPosition.y
    };

    let scrollHeight = documentElement.scrollHeight;
    let scrollWidth = documentElement.scrollWidth;
    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;

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

  const skater = createSkater(
    startPosition,
    endPosition,
    durationMs,
    durationFn,
    containerElement,
    easingFn,
    callbackFn
  );

  skater.start();
  return skater;
}

API.version = 'VERSION';

export default API;
