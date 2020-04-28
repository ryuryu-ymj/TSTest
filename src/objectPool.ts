class ObjectPool {
    private readonly bar = new Bar();
    private readonly ball = new Ball();
    private blocks: Array<Block>;
    private previousTime = new Date().getTime();

    constructor() {
        this.blocks = new Array<Block>(300);
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Block(10 + i % 30 * 20, 50 + Math.floor(i / 30) * 20);
        }
    }

    draw() {
        this.bar.draw();
        this.ball.draw();
        this.blocks.forEach(it => it.draw());
    }

    update() {
        // 経過時間の測定
        let presentTime = new Date().getTime();
        let delta = (presentTime - this.previousTime) / 1000;
        //console.log("fps = " + 1 / delta);
        this.previousTime = presentTime;

        this.bar.update(delta);
        this.ball.update(delta);

        let dx = this.ball.x - this.bar.x;
        if (Math.abs(dx) < this.bar.width / 2) {
            if (this.ball.y + this.ball.radius > this.bar.y - this.bar.height / 2 && this.ball.y < this.bar.y) {
                this.ball.reflectBar(this.bar.y - this.bar.height / 2 - this.ball.radius, dx)
            }
        }
        this.blocks.forEach(block => {
            if (block.isActive) {
                let dx = this.ball.x - block.x;
                let dy = this.ball.y - block.y;
                if (Math.sqrt(dx * dx + dy * dy) < this.ball.radius + block.width / 2) {
                    let a = dy / dx;
                    if (a > -1 && a < 1) {
                        if (dx > 0) {
                            this.ball.reflectX(block.x + block.width / 2 + this.ball.radius);
                        } else {
                            this.ball.reflectX(block.x - block.width / 2 - this.ball.radius);
                        }
                    } else {
                        if (dy > 0) {
                            this.ball.reflectY(block.y + block.width / 2 + this.ball.radius);
                        } else {
                            this.ball.reflectY(block.y - block.width / 2 - this.ball.radius);
                        }
                    }
                    block.remove();
                }
            }
        });
    }

    get isGameOver() { return this.ball.isGameOver }
}