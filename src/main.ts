/// <reference path = "ball.ts"/>
/// <reference path = "bar.ts"/>
/// <reference path = "block.ts"/>
/// <reference path = "objectPool.ts"/>
let inputL = false;
let inputR = false;

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// キー入力
canvas.setAttribute('tabindex', "0");
canvas.addEventListener("keypress", keyPress);
canvas.addEventListener("keyup", keyUp);
function keyPress(ev: KeyboardEvent) {
    switch (ev.key) {
        case "a": inputL = true;
            break;
        case "d": inputR = true;
            break;
    }
}
function keyUp(ev: KeyboardEvent) {
    switch (ev.key) {
        case "a": inputL = false;
            break;
        case "d": inputR = false;
            break;
    }
}
if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    canvas.addEventListener("mousedown", mouseDown);
    function mouseDown(mv: MouseEvent) {
        if (mv.offsetX < canvas.width / 2) inputL = true;
        else inputR = true;
    }
    canvas.addEventListener("mouseup", mouseUp);
    function mouseUp() {
        inputL = false;
        inputR = false;
    }
}

let state = 0;
let count = 0;
let objectPool: ObjectPool;

function render() {
    // 画面のクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (state) {
        case 0: // start
            ctx.font = "30px san-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("press key a or d", canvas.width / 2, canvas.height / 2);
            if (inputL || inputR) {
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
                if (inputL || inputR) {
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