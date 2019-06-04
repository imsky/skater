describe('Skater', function () {
  before(function () {
    document.body.insertAdjacentHTML('afterbegin', `
      <style>
        #a, #b {height: 100vh}
        #b {position: relative; width: 200vh}
        #c {position: absolute; top: 0; left: 50vh}
        #d {width: 200px; height: 200px; overflow: scroll}
        #e {margin-top: 400px; height: 200px}
      </style>
      <div id="a"><h2>a</h2></div>
      <div id="b">
        <h2>b</h2>
        <div id="c">
          <h3>c</h3>
        </div>
        <div id="d">
          <h4>d</h4>
          <div id="e"><h5>e</h5></div>
        </div>
      </div>
    `);
  });

  beforeEach(function () {
    window.scrollTo(0, 0);
  });

  it('scrolls to a target', function (done) {
    this.timeout(10000);
    expect(window.Skater).to.exist;
    var bY = b.getBoundingClientRect().y;
    window.Skater('#b');
    setTimeout(function () {
      expect(Math.floor(window.scrollY)).to.equal(Math.floor(bY));
      done();
    }, 2000);
  });

  it('executes a callback after scrolling', function (done) {
    window.Skater('#b', {callbackFn: done});
  });

  it('scrolls inside a container', function (done) {
    this.timeout(10000);
    var dY = d.getBoundingClientRect().y;
    var eY = e.getBoundingClientRect().y;
    window.Skater('#b', {
      callbackFn: function () {
        window.Skater('#e', {
          containerTarget: '#d',
          callbackFn: function () {
            expect(Math.floor(d.scrollTop)).to.equal(Math.floor(eY - dY));
            done();
        } });
      }
    });
  });

  it('can use a custom duration', function (done) {
    this.timeout(10000);
    var bY = b.getBoundingClientRect().y;
    window.Skater('#b', {durationMs: 100});
    setTimeout(function () {
      expect(Math.floor(window.scrollY)).to.equal(Math.floor(bY));
      done();
    }, 200);
  });

  it('can set custom duration with a function', function (done) {
    this.timeout(10000);
    var bY = b.getBoundingClientRect().y;
    window.Skater('#b', {
      durationFn: function () {
        return 200;
    }});
    setTimeout(function () {
      expect(Math.floor(window.scrollY)).to.equal(Math.floor(bY));
      done();
    }, 400);
  });

  it('can use a custom easing function', function (done) {
    this.timeout(10000);

    function easeOutQuart(deltaTime, startValue, deltaValue, totalTime) {
      return -deltaValue * ((deltaTime=deltaTime/totalTime-1)*deltaTime*deltaTime*deltaTime - 1) + startValue;
    }

    window.Skater('#b', { easingFn: easeOutQuart });
    setTimeout(done, 2000);
  });

  it('can scroll only vertically', function (done) {
    this.timeout(10000);
    var wX = window.scrollX;
    var wY = window.scrollY;
    window.Skater('#c', {scrollDirection: 'y'});
    setTimeout(function () {
      expect(window.scrollY).to.not.equal(wY);
      expect(window.scrollX).to.equal(wX);
      done();
    }, 2000);
  });

  it('can scroll only horizontally', function (done) {
    this.timeout(10000);
    var wX = window.scrollX;
    var wY = window.scrollY;
    window.Skater('#c', {scrollDirection: 'x'});
    setTimeout(function () {
      expect(window.scrollY).to.equal(wY);
      expect(window.scrollX).to.not.equal(wX);
      done();
    }, 2000);
  });

  it('can scroll horizontally and vertically', function (done) {
    this.timeout(10000);
    var wX = window.scrollX;
    var wY = window.scrollY;
    window.Skater('#c', {scrollDirection: 'xy'});
    setTimeout(function () {
      expect(window.scrollY).to.not.equal(wY);
      expect(window.scrollX).to.not.equal(wX);
      done();
    }, 2000);
  });

  it('can cancel scrolling', function (done) {
    this.timeout(10000);
    var wY = window.scrollY;
    var bY = b.getBoundingClientRect().y;
    var skater = window.Skater('#b', { durationMs: 5000 });
    setTimeout(function () {
      skater.stop();
      expect(window.scrollY / (bY - wY)).to.be.lessThan(0.5);
      wY = window.scrollY;
      setTimeout(function () {
        expect(window.scrollY).to.equal(wY);
        done();
      }, 1000);
    }, 1000);
  });

  it('does not scroll if already scrolling', function (done) {
    this.timeout(10000);
    window.Skater('#b');
    setTimeout(function () {
      var wY = window.scrollY;
      window.Skater('#a');
      setTimeout(function () {
        expect(window.scrollY).to.be.greaterThan(wY);
        done();
      }, 500);
    }, 500);
  });

  it('does nothing and returns undefined if target is not found', function (done) {
    expect(window.Skater('#z')).to.be.undefined;
    setTimeout(function () {
      expect(window.scrollY).to.equal(0);
      done();
    }, 500)
  });

  it('errors out on invalid scroll direction', function () {
    expect(function () {
      window.Skater('#b', { scrollDirection: '?' });
    }).to.throw('Invalid scroll direction: ?');
  });

  it('errors out on invalid duration', function () {
    expect(function () {
      window.Skater('#b', { durationMs: -1 });
    }).to.throw('Invalid duration: -1');

    expect(function () {
      window.Skater('#b', { durationMs: null + undefined });
    }).to.throw('Invalid duration: NaN');

    expect(function () {
      window.Skater('#b', {
        durationFn: function () {
          return -1;
      } });
    }).to.throw('Invalid duration: -1');
  });
});