# Skater

[![skaterjs on npm](https://img.shields.io/npm/v/skaterjs.svg)](https://www.npmjs.com/package/skaterjs) ![NPM](https://img.shields.io/npm/l/skaterjs.svg)

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

const exampleElement = document.getElementById('example')
Skater(exampleElement)
```

Skater returns an object with `start` and `stop` functions:

```js
const skater = Skater(1000)
skater.stop()
setTimeout(() => skater.start(), 500)
```

### Options

Skater takes an optional second argument with customizable options. These are the defaults:

```js
Skater('#example', {
  callbackFn: undefined,
  containerTarget: undefined,
  durationFn,
  durationMs = 1000,
  easingFn = easeInOutQuad,
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
const containerElement = document.querySelector('#container');
Skater('#example', {
  containerTarget: containerElement
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

## License

Skater is provided under the [MIT](./LICENSE) license.

## Credits

Skater is a project by [Ivan Malopinsky](http://imsky.co).
