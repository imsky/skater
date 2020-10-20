/* Polyfill service v3.34.0
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * Features requested: requestAnimationFrame
 *
 * - Date.now, License: CC0 (required by "requestAnimationFrame")
 * - requestAnimationFrame, License: MIT */

!(function(undefined) {
if (!("Date"in this&&"now"in this.Date&&"getTime"in this.Date.prototype
)) {

// Date.now
Date.now = function now() {
	return new Date().getTime();
};

}

if (!("requestAnimationFrame"in this
)) {

// requestAnimationFrame
(function (global) {
	var rafPrefix;

	// do not inject RAF in order to avoid broken performance
	var nowOffset = Date.now();

	// use performance api if exist, otherwise use Date.now.
	// Date.now polyfill required.
	var pnow = function () {
		if (global.performance && typeof global.performance.now === 'function') {
			return global.performance.now();
		}
		// fallback
		return Date.now() - nowOffset;
	};

	if ('mozRequestAnimationFrame' in global) {
		rafPrefix = 'moz';

	} else if ('webkitRequestAnimationFrame' in global) {
		rafPrefix = 'webkit';

	}

	if (rafPrefix) {
		global.requestAnimationFrame = function (callback) {
		    return global[rafPrefix + 'RequestAnimationFrame'](function () {
		        callback(pnow());
		    });
		};
		global.cancelAnimationFrame = global[rafPrefix + 'CancelAnimationFrame'];
	} else {

		var lastTime = Date.now();

		global.requestAnimationFrame = function (callback) {
			if (typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}

			var
			currentTime = Date.now(),
			delay = 16 + lastTime - currentTime;

			if (delay < 0) {
				delay = 0;
			}

			lastTime = currentTime;

			return setTimeout(function () {
				lastTime = Date.now();

				callback(pnow());
			}, delay);
		};

		global.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}
}(this));

}

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
