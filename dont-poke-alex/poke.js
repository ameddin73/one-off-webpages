var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    controller.start();
}

var controller = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    setCanvas: function () {
        this.context = this.canvas.getContext("2d");
        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
    },
    getCanvas: function () {
        return {
            height: this.context.canvas.height,
            width: this.context.canvas.width,
        }
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 2;
    this.speedY = 2;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = controller.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.collide = function () {
        // Bottom
        if (this.y + this.height >= controller.getCanvas().height) {
            this.speedY = -1 * this.speedY;
        }
        // Top
        if (this.y <= 0) {
            this.speedY = -1 * this.speedY;
        }
        // Right
        if (this.x + this.width >= controller.getCanvas().width) {
            this.speedX = -1 * this.speedX;
        }
        // Left
        if (this.x <= 0) {
            this.speedX = -1 * this.speedX;
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
}

function updateGameArea() {
    controller.clear();
    controller.setCanvas();
    myGamePiece.newPos();
    myGamePiece.collide();
    myGamePiece.update();
}
