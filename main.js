
const player = {
    x: 0,
    y: 0,
    z: -200,
    model: {
        imgSrc: 'assets/aircraft.bmp',
        img: null,
        modelSrc: 'assets/aircraft.obj',
        model: null
    },
    speed: {
        x: 0,
        y: 0,
        z: 3
    }
}

const view = {
    x: 0,
    y: 0,
    z: 0
}

const bullets = [];

let skyImg;
let horizonImg;

let seaImg;

let sandImg;

let fanImg;
let fan;
let fanAngle = 0;

let enemies = [];

let enemyModel;
let enemyImg;

let sands = [];
let waters = [];

let planeSound;
let fireSound;
let explosionSound;

let explosions = [];

let start = false;

let backgroundSound = false;

function preload() {
    skyImg = loadImage('assets/foggy-sky.jpg');
    horizonImg = loadImage('assets/horizon.jpg');
    
    player.model.img = loadImage(player.model.imgSrc);
    player.model.model = loadModel(player.model.modelSrc);
    
    fanImg = loadImage('assets/fan.bmp');
    fan = loadModel('assets/fan.obj');
    
    seaImg = loadImage('assets/water.jpg');
    sandImg = loadImage('assets/sand.jpg');
    
    planeSound = loadSound('assets/plane.ogg');
    fireSound = loadSound('assets/fire.ogg');
    explosionSound = loadSound('assets/explosion.mp3');
    
    enemyModel = loadModel('assets/enemy.obj');
    enemyImg = loadImage('assets/enemy.bmp');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    angleMode(DEGREES);
    
    for (let i = -10; i < 10; i++) {
        for (let j = -5; j < 8; j++) {
            sands.push({
            x: i * 200,
            y: 500,
            z: j * 200
            });
        }
    }
    
    for (let i = -10; i < 10; i++) {
        for (let j = 8; j < 100; j++) {
            waters.push({
            x: i * 200,
            y: 500,
            z: j * 200
            });
        }
    }
    
    fireSound.setVolume(0.2);
    
    startTextContent = 'Başlamak için ufak bir dokunuş';
    startText = createGraphics(windowWidth, windowHeight);
    startText.fill(255);
    startText.textSize(windowWidth / startTextContent.length);
    startText.textAlign(CENTER, CENTER);
    startText.text('Başlamak için ufak bir dokunuş', width / 2, height / 2);
    
    noStroke();
    texture(startText);
    plane(windowWidth, windowHeight);

    for (let i = 0; i < 100; i++) {
        enemies.push(
            {
                x: random(-100, 100),
                y: random(-100, 100),
                z: -random(2000, 10000),
                speed: {
                    x: 0,
                    y: -0.02,
                    z: random(2, 6)
                },
                died: false
            }
        );
    }
}

function draw() {
if (!start) return;
    
background(color('royalblue'));

ambientLight(190, 190, 190);
pointLight(170, 170, 170, 0, 0, -200);

player.x += player.speed.x;
player.y += player.speed.y;
player.z += player.speed.z;


dx = mouseX - player.x;
dy = mouseY - player.y;


player.x += (dx / 8);
player.y += (dy / 8);

camera(0, 0, 250, player.x - width / 2, player.y - height / 2, 0, 0, 1, 0);


push();
translate(0, 0, 0);
rotateY(-frameCount / 20);
noStroke();
skyImg.mask(horizonImg)
texture(skyImg);
sphere(2000);
pop();
/*
push();
translate(0, 0, 0);
noStroke();
tint(0, 153, 204, 126);
texture(horizonImg);
sphere(1500);
pop();
*/
bullets.forEach((e, i, o) => {
    if (e.z < -1900) {
        delete bullets[i];
    }
    else {
        push();
        noStroke();
        ambientMaterial(55);
        e.z -= e.speed;
        translate(e.x, e.y, e.z);
        rotateX(90);
        cylinder(0.5, 8);
        pop();
    }
    
});
/*
push();
noStroke();
fill(155);
translate(player.x, 305, player.z);
rotateX(90);
plane(100000);
pop();
*/

sands.forEach(e => {
    push();
    if (e.x > player.x - 2000 && e.x < player.x + 2000 && e.y > player.y - 1000 && e.y < player.y + 1000 && e.z > player.z - 2000 && e.z < player.z + 2000) {
        noStroke();
        farness = dist(e.x, e.y, e.z, player.x, player.y, player.z);
        tint(255, 255 - farness * 255 / 2000);
        texture(sandImg);
        translate(player.x - e.x, e.y, player.z - e.z);
        rotateX(90);
        plane(200);
    }
    pop();
});


waters.forEach(e => {
    push();
    if (e.x > player.x - 2000 && e.x < player.x + 2000 && e.y > player.y - 1000 && e.y < player.y + 1000 && e.z > player.z - 2000 && e.z < player.z + 2000) {
        noStroke();
        farness = dist(e.x, e.y, e.z, player.x, player.y, player.z);
        tint(255, 255 - farness * 255 / 2000);
        texture(seaImg);
        translate(player.x - e.x, e.y, player.z - e.z);
        if (frameCount % 20 > 9) {
            rotateY(180);
        }
        rotateX(90);
        plane(200);
    }
    pop();
});

explosions.forEach((e, i, o) => {
    push();
    translate(e.x, e.y, e.z);
    fill(color(random(200, 255), random(0, 60), 0));
    rotateZ(random(0, 360));
    rotateY(random(0, 360));
    rotateZ(random(0, 360));
    plane(e.size);
    e.size -= 5;
    if (e.size < 1) {
    delete explosions[i];
    }
    pop();
});


push();
translate(player.x - width / 2, player.y - height / 2, 100);
rotateZ(180);
noStroke();
texture(player.model.img);
model(player.model.model);
pop();

push();
translate(player.x - width / 2, player.y - height / 2, 75);
noStroke();
// texture(fanImg);
specularMaterial(120);
rotateZ(-fanAngle);
// model(fan);
plane(15, 3);
pop();

fanAngle += 105;

enemies.forEach((e, ei, eo) => {
    e.x += e.speed.x;
    e.y += e.speed.y;
    e.z += e.speed.z;

    if (e.x > player.x - 2000 && e.x < player.x + 2000 && e.y > player.y - 1000 && e.y < player.y + 1000 && e.z >  -2000 && e.z < 2000) {
    push();
    translate(e.x, e.y, player.z + e.z);
    scale(0.8)
    rotateX(180);
    noStroke();
    texture(enemyImg);
    model(enemyModel);
    pop();
    }

    bullets.forEach((b, bi, bo) => {
    if (30 > dist(b.x, b.y, b.z, e.x, e.y, e.z)) {
        explosions.push({
        x: e.x,
        y: e.y,
        z: player.z + e.z,
        size: 40
        });

        explosionSound.play();

        delete bullets[bi];
        delete enemies[ei];
    }
    });
});


if (keyIsDown(87)) {
    player.z += keyIsDown(16) ? 100 : 10;
}

if (keyIsDown(83)) {
    player.z -= keyIsDown(16) ? 100 : 10;
}
}

function mousePressed() {
    if (!start) {
        start = true;

        backgroundSound ? planeSound.loop() : null;
        
        mouseX = width / 2;
        mouseY = height / 2;

        canvas.requestFullscreen();
        
        return;
    };
    
    if (mouseButton === LEFT) {
        fireSound.play();
        bullets.push({
            x: player.x - width / 2 - 15,
            y: player.y - height / 2,
            z: 125,
            speed: player.speed.x + 40
        });
        
        bullets.push({
            x: player.x - width / 2 + 15,
            y: player.y - height / 2,
            z: 125,
            speed: player.speed.x + 40
        });
    }
}

document.addEventListener('contextmenu', e => e.preventDefault());