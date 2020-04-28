class Bar {
    x = canvas.width / 2;
    y = canvas.height - 20;
    width = 50;
    height = 3;

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    update(delta: number) {
        if (inputL) this.x -= 300 * delta;
        if (inputR) this.x += 300 * delta;
        if (this.x < this.width / 2) this.x = this.width / 2;
        else if (this.x > canvas.width - this.width / 2) this.x = canvas.width - this.width / 2;
    }
}