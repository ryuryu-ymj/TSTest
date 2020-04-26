class Block {
    readonly x: number; readonly y: number;
    readonly width = 20;
    isActive = true;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw() {
        if (this.isActive) {
            ctx.fillStyle = "orange";
            ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
        }
    }

    remove() {
        this.isActive = false;
    }
}