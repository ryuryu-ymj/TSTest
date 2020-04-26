var Ball = /** @class */ (function () {
    function Ball() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 50;
        this.radius = 5;
        var direction = Math.PI / 2 + Math.random() - 0.5;
        this.vx = 200 * Math.cos(direction);
        this.vy = 200 * Math.sin(direction);
    }
    Ball.prototype.draw = function () {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };
    Ball.prototype.update = function (delta) {
        var _this = this;
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        if (this.x - this.radius < 0) {
            this.vx = -this.vx;
            this.x = this.radius;
        }
        else if (this.x + this.radius > canvas.width) {
            this.vx = -this.vx;
            this.x = canvas.width - this.radius;
        }
        if (this.y - this.radius < 0) {
            this.vy = -this.vy;
            this.y = this.radius;
        }
        else if (this.y + this.radius > canvas.height) {
            console.log("gameover");
            state = 2;
        }
        var dx = this.x - bar.x;
        if (Math.abs(dx) < bar.width / 2) {
            if (this.y + this.radius > bar.y - bar.height / 2 && this.y < bar.y) {
                this.vy = -this.vy;
                this.vx += dx * 3;
                this.y = bar.y - bar.height / 2 - this.radius;
            }
        }
        blocks.forEach(function (block) {
            if (block.isActive) {
                var dx_1 = _this.x - block.x;
                var dy = _this.y - block.y;
                if (Math.sqrt(dx_1 * dx_1 + dy * dy) < _this.radius + block.width / 2) {
                    var a = dy / dx_1;
                    if (a > -1 && a < 1) {
                        if (dx_1 > 0) {
                            _this.vx = -_this.vx;
                            _this.x = block.x + block.width / 2 + _this.radius;
                        }
                        else {
                            _this.vx = -_this.vx;
                            _this.x = block.x - block.width / 2 - _this.radius;
                        }
                    }
                    else {
                        if (dy > 0) {
                            _this.vy = -_this.vy;
                            _this.y = block.y + block.width / 2 + _this.radius;
                        }
                        else {
                            _this.vy = -_this.vy;
                            _this.y = block.y - block.width / 2 - _this.radius;
                        }
                    }
                    block.remove();
                }
            }
        });
    };
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
            this.x -= 5;
        if (keyDDown)
            this.x += 5;
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
/// <reference path = "ball.ts"/>
/// <reference path = "bar.ts"/>
/// <reference path = "block.ts"/>
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
var bar = new Bar();
var ball = new Ball();
var blocks = new Array(300);
for (var i = 0; i < blocks.length; i++) {
    blocks[i] = new Block(10 + i % 30 * 20, 50 + Math.floor(i / 30) * 20);
}
var state = 0;
var previousTime = new Date().getTime();
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
                previousTime = new Date().getTime();
            }
            break;
        case 1: // play
            // draw
            bar.draw();
            ball.draw();
            blocks.forEach(function (it) { return it.draw(); });
            // 経過時間の測定
            var presentTime = new Date().getTime();
            var delta = (presentTime - previousTime) / 1000;
            //console.log("fps = " + 1 / delta);
            previousTime = presentTime;
            update(delta);
            break;
        case 2: // gameover
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            break;
    }
    window.requestAnimationFrame(render);
}
function update(delta) {
    bar.update(delta);
    ball.update(delta);
}
render();
