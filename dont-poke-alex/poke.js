let myGamePiece;
let body;
let angrySounds;
const src = "assets/images/alex_default.png";
let clickCounter = 0;

function startGame() {
    myGamePiece = new component(150, 185, 2);
    body = document.getElementsByTagName("BODY")[0];
    angrySounds = document.createElement("AUDIO");
    angrySounds.setAttribute("src", 'assets/audio/click_crazy.ogg');
    angrySounds.loop = true;
    document.body.appendChild(angrySounds);

    this.interval = setInterval(updateGameArea, 20);
    derclick();
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
    let comp = this;

    const alex = new Image(width, height);
    let sfx = document.createElement("AUDIO");

    alex.src = src;
    alex.className = "alex";
    alex.onclick = async function () {
        clickCounter++;
        sfx.setAttribute("src", getPokeSound());
        sfx.play();

        alex.src = getPokeImage();
        let tempSpeedX = comp.speedX;
        let tempSpeedY = comp.speedY;
        if (tempSpeedX !== 0) {
            comp.speedX = 0;
            comp.speedY = 0;
        }
        await sleep(300)
        alex.src = src;
        if (tempSpeedX !== 0) {
            comp.speedX = tempSpeedX;
            comp.speedY = tempSpeedY;
        }
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
    clickCrazy();
    myGamePiece.newPos();
    myGamePiece.outOfBounds();
    myGamePiece.collide();
    myGamePiece.update();
}

async function clickCrazy() {

    if (clickCounter > 10) {
        body.classList.add("clickCrazy");
        if (angrySounds.paused)
            angrySounds.play();
    } else {
        body.classList.remove("clickCrazy");
        angrySounds.pause();
    }
}

async function derclick() {
    while (true) {
        const subtractor = clickCounter > 10 ? 3 : 1;
        await sleep(500);
        clickCounter = Math.max(0, clickCounter - subtractor);
    }
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
