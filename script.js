var Ball = /** @class */ (function () {
    function Ball() {
        this._x = canvas.width / 2;
        this._y = canvas.height / 2 + 50;
        this.radius = 5;
        this._isGameOver = false;
        var direction = Math.PI / 2 + Math.random() - 0.5;
        this._vx = 200 * Math.cos(direction);
        this._vy = 200 * Math.sin(direction);
    }
    Ball.prototype.draw = function () {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this._x, this._y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };
    Ball.prototype.update = function (delta) {
        this._x += this._vx * delta;
        this._y += this._vy * delta;
        if (this._x - this.radius < 0) {
            this._vx = -this._vx;
            this._x = this.radius;
        }
        else if (this._x + this.radius > canvas.width) {
            this._vx = -this._vx;
            this._x = canvas.width - this.radius;
        }
        if (this._y - this.radius < 0) {
            this._vy = -this._vy;
            this._y = this.radius;
        }
        else if (this._y + this.radius > canvas.height) {
            this._isGameOver = true;
        }
    };
    Ball.prototype.reflectX = function (x) {
        this._vx = -this._vx;
        this._x = x;
    };
    Ball.prototype.reflectY = function (y) {
        this._vy = -this._vy;
        this._y = y;
    };
    Ball.prototype.reflectBar = function (y, dx) {
        this._vy = -this._vy;
        this._vx += dx * 3;
        this._y = y;
    };
    Object.defineProperty(Ball.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "isGameOver", {
        get: function () { return this._isGameOver; },
        enumerable: true,
        configurable: true
    });
    return Ball;
}());
var Bar = /** @class */ (function () {
    function Bar() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 20;
        this.width = 50;
        this.height = 3;
    }
    Bar.prototype.draw = function () {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    };
    Bar.prototype.update = function (delta) {
        if (keyADown)
            this.x -= 300 * delta;
        if (keyDDown)
            this.x += 300 * delta;
        if (this.x < this.width / 2)
            this.x = this.width / 2;
        else if (this.x > canvas.width - this.width / 2)
            this.x = canvas.width - this.width / 2;
    };
    return Bar;
}());
var Block = /** @class */ (function () {
    function Block(x, y) {
        this.width = 20;
        this.isActive = true;
        this.x = x;
        this.y = y;
    }
    Block.prototype.draw = function () {
        if (this.isActive) {
            ctx.fillStyle = "orange";
            ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
        }
    };
    Block.prototype.remove = function () {
        this.isActive = false;
    };
    return Block;
}());
var ObjectPool = /** @class */ (function () {
    function ObjectPool() {
        this.bar = new Bar();
        this.ball = new Ball();
        this.previousTime = new Date().getTime();
        this.blocks = new Array(300);
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Block(10 + i % 30 * 20, 50 + Math.floor(i / 30) * 20);
        }
    }
    ObjectPool.prototype.draw = function () {
        this.bar.draw();
        this.ball.draw();
        this.blocks.forEach(function (it) { return it.draw(); });
    };
    ObjectPool.prototype.update = function () {
        var _this = this;
        // 経過時間の測定
        var presentTime = new Date().getTime();
        var delta = (presentTime - this.previousTime) / 1000;
        //console.log("fps = " + 1 / delta);
        this.previousTime = presentTime;
        this.bar.update(delta);
        this.ball.update(delta);
        var dx = this.ball.x - this.bar.x;
        if (Math.abs(dx) < this.bar.width / 2) {
            if (this.ball.y + this.ball.radius > this.bar.y - this.bar.height / 2 && this.ball.y < this.bar.y) {
                this.ball.reflectBar(this.bar.y - this.bar.height / 2 - this.ball.radius, dx);
            }
        }
        this.blocks.forEach(function (block) {
            if (block.isActive) {
                var dx_1 = _this.ball.x - block.x;
                var dy = _this.ball.y - block.y;
                if (Math.sqrt(dx_1 * dx_1 + dy * dy) < _this.ball.radius + block.width / 2) {
                    var a = dy / dx_1;
                    if (a > -1 && a < 1) {
                        if (dx_1 > 0) {
                            _this.ball.reflectX(block.x + block.width / 2 + _this.ball.radius);
                        }
                        else {
                            _this.ball.reflectX(block.x - block.width / 2 - _this.ball.radius);
                        }
                    }
                    else {
                        if (dy > 0) {
                            _this.ball.reflectY(block.y + block.width / 2 + _this.ball.radius);
                        }
                        else {
                            _this.ball.reflectY(block.y - block.width / 2 - _this.ball.radius);
                        }
                    }
                    block.remove();
                }
            }
        });
    };
    Object.defineProperty(ObjectPool.prototype, "isGameOver", {
        get: function () { return this.ball.isGameOver; },
        enumerable: true,
        configurable: true
    });
    return ObjectPool;
}());
/// <reference path = "ball.ts"/>
/// <reference path = "bar.ts"/>
/// <reference path = "block.ts"/>
/// <reference path = "objectPool.ts"/>
var keyADown = false;
var keyDDown = false;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// キー入力
canvas.setAttribute('tabindex', "0");
canvas.addEventListener("keypress", keyPress);
canvas.addEventListener("keyup", keyUp);
function keyPress(ev) {
    switch (ev.key) {
        case "a":
            keyADown = true;
            break;
        case "d":
            keyDDown = true;
            break;
    }
}
function keyUp(ev) {
    switch (ev.key) {
        case "a":
            keyADown = false;
            break;
        case "d":
            keyDDown = false;
            break;
    }
}
var state = 0;
var count = 0;
var objectPool;
function render() {
    // 画面のクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (state) {
        case 0: // start
            ctx.font = "30px san-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("press key a or d", canvas.width / 2, canvas.height / 2);
            if (keyADown || keyDDown) {
                state = 1;
                objectPool = new ObjectPool();
            }
            break;
        case 1: // play
            objectPool.draw();
            objectPool.update();
            if (objectPool.isGameOver) {
                state = 2;
                count = 0;
            }
            break;
        case 2: // gameover
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            if (count > 30) {
                if (keyADown || keyDDown) {
                    state = 1;
                    objectPool = new ObjectPool();
                }
            }
            break;
    }
    count++;
    window.requestAnimationFrame(render);
}
render();
