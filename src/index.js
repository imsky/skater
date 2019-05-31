// todo: banner
// todo: tests
// todo: README
// 0.9
// todo: documentation + automated jsdoc to markdown
// todo: rAF polyfill build version
// todo: demo page
// 1.0

const requestAnimationFrame = window.requestAnimationFrame;

let skating = false;

/**
 * source: https://github.com/danro/jquery-easing
 * @param {number} deltaTime
 * @param {number} startValue
 * @param {number} deltaValue
 * @param {number} totalTime
 */
function easeInOutQuad(deltaTime, startValue, deltaValue, totalTime) {
  if ((deltaTime /= totalTime / 2) < 1)
    return (deltaValue / 2) * deltaTime * deltaTime + startValue;
  return (-deltaValue / 2) * (--deltaTime * (deltaTime - 2) - 1) + startValue;
}

/**
 * @param {object} startPosition
 * @param {object} endPosition
 * @param {number} durationMs
 * @param {function} durationFn
 * @param {object} containerElement
 * @param {function} easingFn
 * @param {function} callbackFn
 * @param {function} setSkatingFn
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
  const deltaPosition = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y
  };
  let startTime;
  let requestID;

  durationMs = durationFn ? durationFn(deltaPosition) : durationMs;

  if (durationMs < 0 || Number.isNaN(durationMs)) {
    throw Error(`Invalid duration: ${durationMs}`);
  }

  function animate(currentTime = 0) {
    startTime = startTime || currentTime;
    const deltaTime = currentTime - startTime;
    const x = easingFn(deltaTime, startPosition.x, deltaPosition.x, durationMs);
    const y = easingFn(deltaTime, startPosition.y, deltaPosition.y, durationMs);

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
        setSkatingFn(false);
        if (typeof callbackFn === 'function') {
          callbackFn.call(null);
        }
      });
    }
  }

  return {
    start: function start() {
      if (Math.abs(deltaPosition.y) > 0 || Math.abs(deltaPosition.x) > 0) {
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
 *
 * @param {string|object} target
 */
function getElement(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else if (typeof target === 'object' && target !== null) {
    return target;
  } else {
    throw Error('Invalid target');
  }
}

/**
 *
 * @param {object} element
 */
function getGeometry(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
}

/**
 *
 * @param {boolean} value
 */
function setSkatingFn(value) {
  skating = value;
  return value;
}

/**
 *
 * @param {number|string|object} target
 * @param {object} options
 */
function API(target, options = {}) {
  const {
    callbackFn,
    containerTarget,
    durationFn,
    durationMs=1000,
    easingFn = easeInOutQuad,
    scrollDirection = 'y'
  } = options;

  if (
    scrollDirection !== 'x' &&
    scrollDirection !== 'y' &&
    scrollDirection !== 'xy'
  ) {
    throw Error(`Invalid scroll direction: ${scrollDirection}`);
  }

  let startPosition = {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0
  };

  let containerElement;
  let containerElementGeometry;

  if (containerTarget) {
    containerElement = getElement(containerTarget);
    containerElementGeometry = getGeometry(containerElement);
    startPosition = {
      x: containerElement.scrollLeft,
      y: containerElement.scrollTop
    };
  }

  let endPosition;

  if (typeof target === 'number') {
    endPosition = {
      x: scrollDirection !== 'y' ? target : 0,
      y: scrollDirection !== 'x' ? target : 0
    };
  } else {
    const element = getElement(target);

    if (!element) {
      return;
    }

    const elementGeometry = getGeometry(element);
    const lockX = scrollDirection.indexOf('x') === -1;
    const lockY = scrollDirection.indexOf('y') === -1;

    endPosition = {
      x: lockX ? startPosition.x : elementGeometry.x + startPosition.x,
      y: lockY ? startPosition.y : elementGeometry.y + startPosition.y
    };

    const documentElement = document.documentElement;
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

  const skater = createSkater(
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

export default API;
