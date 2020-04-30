var myGamePiece;

function startGame() {
    myGamePiece = new component(100, 100, 1, "public/research-dog.png");
    this.interval = setInterval(updateGameArea, 20);
}

const getCanvas = function () {
    return {
        height: window.innerHeight,
        width: window.innerWidth,
    }
}

const getNumber = function (position, incr) {
    console.log(position)
    let value = parseInt(position.match(/(\d+)/), 10);
    value += incr;
    console.log(value)
    return value + "px";
}

function component(width, height, speed, src) {
    this.width = width;
    this.height = height;
    this.speedX = speed;
    this.speedY = speed;
    this.x = 0;
    this.y = 0;
    var alex = new Image(width, height);
    alex.src = src;
    alex.className = "alex";
    alex.onclick = () => {
        console.log('nope')
        alert('huh')
    }
    document.body.appendChild(alex);
    this.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        alex.style.left = this.x + "px";
        alex.style.top = this.y + "px";
    };
    this.collide = function () {
        // Bottom
        if (this.y + this.height >= getCanvas().height) {
            this.speedY = -1 * this.speedY;
        }
        // Top
        if (this.y <= 0) {
            this.speedY = -1 * this.speedY;
        }
        // Right
        if (this.x + this.width >= getCanvas().width) {
            this.speedX = -1 * this.speedX;
        }
        // Left
        if (this.x <= 0) {
            this.speedX = -1 * this.speedX;
        }
    };
    this.outOfBounds = function () {
        // Bottom
        if (this.y > getCanvas().height) {
            startGame();
            return;
        }
        // Top
        if (this.y < 0 - this.height) {
            startGame();
            return;
        }
        // Right
        if (this.x > getCanvas().width) {
            startGame();
            return;
        }
        // Left
        if (this.x < 0 - this.width) {
            startGame();
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
}

function updateGameArea() {
    myGamePiece.newPos();
    myGamePiece.outOfBounds();
    myGamePiece.collide();
    myGamePiece.update();
}
