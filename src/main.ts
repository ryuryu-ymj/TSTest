/// <reference path = "ball.ts"/>
/// <reference path = "bar.ts"/>
/// <reference path = "block.ts"/>
let keyADown = false;
let keyDDown = false;

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// キー入力
canvas.setAttribute('tabindex', "0");
canvas.addEventListener("keypress", keyPress);
canvas.addEventListener("keyup", keyUp);
function keyPress(ev: KeyboardEvent) {
    switch (ev.key) {
        case "a": keyADown = true;
            break;
        case "d": keyDDown = true;
            break;
    }
}
function keyUp(ev: KeyboardEvent) {
    switch (ev.key) {
        case "a": keyADown = false;
            break;
        case "d": keyDDown = false;
            break;
    }
}

let bar = new Bar();
let ball = new Ball();
let blocks = new Array<Block>(300);
for (let i = 0; i < blocks.length; i++) {
    blocks[i] = new Block(10 + i % 30 * 20, 50 + Math.floor(i / 30) * 20);
}

let state = 0;
let previousTime = new Date().getTime();

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
            blocks.forEach(it => it.draw());

            // 経過時間の測定
            let presentTime = new Date().getTime();
            let delta = (presentTime - previousTime) / 1000;
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

function update(delta: number) {
    bar.update(delta);
    ball.update(delta);
}

render();