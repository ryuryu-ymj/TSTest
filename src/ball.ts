class Ball {
    private x = canvas.width / 2; private y = canvas.height / 2 + 50;
    private vx; private vy;
    readonly radius = 5;

    constructor() {
        let direction = Math.PI / 2 + Math.random() - 0.5;
        this.vx = 200 * Math.cos(direction);
        this.vy = 200 * Math.sin(direction);
    }

    draw() {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(delta: number) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if (this.x - this.radius < 0) {
            this.vx = -this.vx;
            this.x = this.radius;
        } else if (this.x + this.radius > canvas.width) {
            this.vx = -this.vx;
            this.x = canvas.width - this.radius;
        }
        if (this.y - this.radius < 0) {
            this.vy = -this.vy;
            this.y = this.radius;
        } else if (this.y + this.radius > canvas.height) {
            console.log("gameover")
            state = 2;
        }
        let dx = this.x - bar.x;
        if (Math.abs(dx) < bar.width / 2) {
            if (this.y + this.radius > bar.y - bar.height / 2 && this.y < bar.y) {
                this.vy = -this.vy;
                this.vx += dx * 3;
                this.y = bar.y - bar.height / 2 - this.radius;
            }
        }
        blocks.forEach(block => {
            if (block.isActive) {
                let dx = this.x - block.x;
                let dy = this.y - block.y;
                if (Math.sqrt(dx * dx + dy * dy) < this.radius + block.width / 2) {
                    let a = dy / dx;
                    if (a > -1 && a < 1) {
                        if (dx > 0) {
                            this.vx = -this.vx;
                            this.x = block.x + block.width / 2 + this.radius;
                        } else {
                            this.vx = -this.vx;
                            this.x = block.x - block.width / 2 - this.radius;
                        }
                    } else {
                        if (dy > 0) {
                            this.vy = -this.vy;
                            this.y = block.y + block.width / 2 + this.radius;
                        } else {
                            this.vy = -this.vy;
                            this.y = block.y - block.width / 2 - this.radius;
                        }
                    }
                    block.remove();
                }
            }
        });
    }
}