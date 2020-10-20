# Skater

[![codecov](https://codecov.io/gh/imsky/skater/branch/master/graph/badge.svg?token=i6le40iI4y)](https://codecov.io/gh/imsky/skater) [![skaterjs on npm](https://img.shields.io/npm/v/skaterjs.svg)](https://www.npmjs.com/package/skaterjs) [![license](https://img.shields.io/npm/l/skaterjs.svg)](./LICENSE)

Skater makes smooth scrolling simple.

It's tiny (1 KB gzipped) and has zero dependencies.

## Installation

* npm: `npm install skaterjs`
* yarn: `yarn install skaterjs`
* jsdelivr: <https://cdn.jsdelivr.net/npm/skaterjs>
* unpkg: <https://unpkg.com/skaterjs>

## Usage

Smoothly scroll to the `#example` element:

```js
Skater('#example')
```

Skater also accepts a number or an `Element` as the first argument:

```js
Skater(200)
Skater(document.getElementById('example'))
```

Skater returns an object with `start` and `stop` functions:

```js
skater = Skater(1000)
skater.stop()
setTimeout(() => skater.start(), 500)
```

### Options

Skater takes an optional second argument with customizable options. These are the defaults:

```js
Skater('#example', {
  callbackFn: undefined,
  containerTarget: undefined,
  durationFn: undefined,
  durationMs: 1000,
  easingFn: easeInOutQuad,
  offset: {x: 0, y: 0},
  scrollDirection = 'y'
})
```

#### callbackFn

Execute a callback after scrolling:

```js
Skater('#example', {
  callbackFn: function () {
    alert('done!')
  }
})
```

### containerTarget

Scroll inside specified container:

```js
Skater('#example', {
  containerTarget: '#container'
})

// Elements can also be passed directly
Skater('#example', {
  containerTarget: document.querySelector('#container')
})
```

### durationFn

Set a custom duration using a function takes one argument that includes x and y scroll distance. This duration overrides `durationMs`.

```js
Skater('#example', {
  durationFn: function (position) {
    return Math.log(position.x * position.y)
  }
})
```

### durationMs

Set a custom duration in milliseconds.

```js
Skater('#example', {
  durationMs: 123456
})
```

### easingFn

Custom easing function using the [jquery-easing](https://github.com/danro/jquery-easing) function signature.

```js
Skater('#example', {
  easingFn: function (deltaTime, startValue, deltaValue, totalTime) {
    return startValue + ((deltaTime / totalTime) * deltaValue)
  }
})
```

### offset

Set a scroll position offset from the target. Both `x` and `y` properties must be defined.

```js
Skater('#example', {
  offset: {
    x: 0,
    y: 100
  }
});
```

### scrollDirection

Scroll vertically, horizontally, or both simultaneously:

```js
Skater('#example', {
  scrollDirection: 'y'
})

Skater('#example', {
  scrollDirection: 'x'
})

Skater('#example', {
  scrollDirection: 'xy'
})
```

## Browser support

* Chrome 24+
* Firefox 23+
* Safari 6.1+
* IE 10+
* Edge 12+

### Browser support using polyfilled build

You can use a polyfilled build, such as `dist/skater.polyfilled.js`, to support the following browsers:

* Chrome 4+
* Firefox 4+
* Safari 3.1+
* IE 8+

## Contributing

Contributions, issues, and feature requests are welcome. Check out the [issues page](https://github.com/imsky/skater/issues) if you'd like to contribute.

## License

Skater is provided under the [MIT](./LICENSE) license.

## Credits

Skater is a project by [Ivan Malopinsky](https://imsky.co).
