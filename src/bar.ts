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
        if (keyADown) this.x -= 5;
        if (keyDDown) this.x += 5;
    }
}