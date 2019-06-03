describe('Skater', function () {
  before(function () {
    document.body.insertAdjacentHTML('afterbegin', `
      <style>#a, #b {height: 100vh}</style>
      <div id="a"><h2>a</h2></div>
      <div id="b"><h2>b</h2></div>
    `);
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
});
