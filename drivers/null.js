function Null(deviceId, options) {
  const self = this;

  options = options || {};
  this.universe = Buffer.alloc(513, 0);
  self.start();
}

Null.prototype.start = function () {
  const self = this;

  self.timeout = setInterval(() => {
    console.log(self.universe);
  }, 1000);
};

Null.prototype.stop = function () {
  clearInterval(this.timeout);
};

Null.prototype.close = cb => {
  cb(null);
};

Null.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  console.log(this.universe.slice(1));
};

Null.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

Null.prototype.get = function (c) {
  return this.universe[c];
};

module.exports = Null;
