const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const sizeSpan = document.getElementById("size");
const colorInput = document.getElementById("color");
const bgColorInput = document.getElementById("bgColor");
const clearBtn = document.getElementById("clear");
const undoBtn = document.getElementById("undo");

let size = 1;
let color = "black";
let bgColor = "white";
let isPressed = false;
let x = undefined;
let y = undefined;
let undoStack = [];
const sizes = [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64];

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 10) { // Limit the stack size to 10 for performance
        undoStack.shift();
    }
}

canvas.addEventListener("mousedown", (e) => {
    isPressed = true;
    x = e.offsetX;
    y = e.offsetY;
    saveState();
});

canvas.addEventListener("mouseup", () => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
    if (isPressed) {
        const x2 = e.offsetX;
        const y2 = e.offsetY;

        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
});

increaseBtn.addEventListener("click", () => {
    let currentIndex = sizes.indexOf(size);
    if (currentIndex < sizes.length - 1) {
        size = sizes[currentIndex + 1];
    }
    updateSizeOnUI();
});

decreaseBtn.addEventListener("click", () => {
    let currentIndex = sizes.indexOf(size);
    if (currentIndex > 0) {
        size = sizes[currentIndex - 1];
    }
    updateSizeOnUI();
});

function updateSizeOnUI() {
    sizeSpan.innerText = size;
}

clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    undoStack = [];
});

colorInput.addEventListener("change", (e) => {
    color = e.target.value;
});

bgColorInput.addEventListener("change", (e) => {
    bgColor = e.target.value;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

undoBtn.addEventListener("click", () => {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
    }
});

updateSizeOnUI();
