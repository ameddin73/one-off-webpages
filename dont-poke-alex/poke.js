var myGamePiece;
const src = "assets/images/alex_default.png";

function startGame() {
    myGamePiece = new component(150, 185, 2);
    this.interval = setInterval(updateGameArea, 20);
}

const getCanvas = function () {
    return {
        height: window.innerHeight,
        width: window.innerWidth,
    }
}

function component(width, height, speed) {
    this.width = width;
    this.height = height;
    this.speedX = speed;
    this.speedY = speed;
    this.x = 0;
    this.y = 0;

    const alex = new Image(width, height);
    let sfx = document.createElement("AUDIO");

    alex.src = src;
    alex.className = "alex";
    alex.onclick = async function () {
        sfx.setAttribute("src", getPokeSound());
        sfx.play();

        alex.src = getPokeImage();
        await sleep(300)
        alex.src = src;
    }

    document.body.appendChild(sfx);
    document.body.appendChild(alex);

    this.update = function () {
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
            alex.classList.add("faceLeft");
        }
        // Left
        if (this.x <= 0) {
            this.speedX = -1 * this.speedX;
            alex.classList.remove("faceLeft");
        }
    };

    this.outOfBounds = function () {
        // Bottom
        if (this.y > getCanvas().height) {
            startGame();
            updateGameArea();
            return;
        }
        // Top
        if (this.y < 0 - this.height) {
            startGame();
            updateGameArea();
            return;
        }
        // Right
        if (this.x > getCanvas().width) {
            startGame();
            updateGameArea();
            return;
        }
        // Left
        if (this.x < 0 - this.width) {
            startGame();
            updateGameArea();
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getPokeImage = function () {
    const selection = Math.floor(Math.random() * 7) + 1;
    return 'assets/images/alex_poke' + selection + '.png';
}

const getPokeSound = function () {
    const selection = Math.floor(Math.random() * 19) + 1;
    return 'assets/audio/alex_poke' + selection + '.ogg';
}
