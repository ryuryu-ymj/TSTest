class Ball {
    private _x = canvas.width / 2; private _y = canvas.height / 2 + 50;
    private _vx; private _vy;
    readonly radius = 5;
    private _isGameOver = false;

    constructor() {
        let direction = Math.PI / 2 + Math.random() - 0.5;
        this._vx = 200 * Math.cos(direction);
        this._vy = 200 * Math.sin(direction);
    }

    draw() {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this._x, this._y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(delta: number) {
        this._x += this._vx * delta;
        this._y += this._vy * delta;

        if (this._x - this.radius < 0) {
            this._vx = -this._vx;
            this._x = this.radius;
        } else if (this._x + this.radius > canvas.width) {
            this._vx = -this._vx;
            this._x = canvas.width - this.radius;
        }
        if (this._y - this.radius < 0) {
            this._vy = -this._vy;
            this._y = this.radius;
        } else if (this._y + this.radius > canvas.height) {
            this._isGameOver = true;
        }
    }

    reflectX(x: number) {
        this._vx = -this._vx;
        this._x = x;
    }

    reflectY(y: number) {
        this._vy = -this._vy;
        this._y = y;
    }

    reflectBar(y: number, dx: number) {
        this._vy = -this._vy;
        this._vx += dx * 3;
        this._y = y;
    }

    get x() { return this._x }
    get y() { return this._y }
    get isGameOver() { return this._isGameOver }
}