const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1380
canvas.height = 630
ctx.font = '32px Gothic';
ctx.fillStyle = "white";
ctx.textAlign = "center";


const backgroundImage = new Image();
backgroundImage.src = 'src/img/bg_forest.png';
const selectorImage = new Image()
selectorImage.src = 'src/img/items/selector.png'

//character
const characterImgRight = new Image();
characterImgRight.src = 'src/img/character/hero_right.png';
const characterImgLeft = new Image();
characterImgLeft.src = 'src/img/character/hero_left.png';
const characterImgRightDamage = new Image();
characterImgRightDamage.src = 'src/img/character/damage_hero_right.png';
const characterImgLeftDamage = new Image();
characterImgLeftDamage.src = 'src/img/character/damage_hero_left.png';
const attackRightImg = new Image();
attackRightImg.src = 'src/img/attack/attackRight.png';
const attackLeftImg = new Image();
attackLeftImg.src = 'src/img/attack/attackLeft.png';

//enemys
const miniOrcImage = new Image();
miniOrcImage.src = 'src/img/enemys/miniOrc.png';
const FlightEyeImage = new Image();
FlightEyeImage.src = 'src/img/enemys/FlightEye.png';
const GoblinImage = new Image();
GoblinImage.src = 'src/img/enemys/Goblin.png';
const MushroomImage = new Image();
MushroomImage.src = 'src/img/enemys/Mushroom.png';
const skeletonImage = new Image();
skeletonImage.src = 'src/img/enemys/skeleton.png';
const miniRedImage = new Image();
miniRedImage.src = 'src/img/enemys/miniRed.png';
const frankImage = new Image();
frankImage.src = 'src/img/enemys/frank.png';
const redImage = new Image();
redImage.src = 'src/img/enemys/red.png';

//items
const hpImage = new Image();
hpImage.src = 'src/img/items/hpIcon.png';
const xpImage = new Image();
xpImage.src = 'src/img/items/xpPointBlue.png';
const damagesBuffImage = new Image();
damagesBuffImage.src = 'src/img/items/buff1.png';
const rangeBuffImage = new Image();
rangeBuffImage.src = 'src/img/items/buff2.png';
const coolDownBuffImage = new Image();
coolDownBuffImage.src = 'src/img/items/buff3.png';
const armorBuffImage = new Image();
armorBuffImage.src = 'src/img/items/buff4.png';
const speedBuffImage = new Image();
speedBuffImage.src = 'src/img/items/buff5.png';
const healthBuffImage = new Image();
healthBuffImage.src = 'src/img/items/heart.png';

const background = new Sprite(8000,7860,backgroundImage,{x:-2560,y:-2026});
const selector = new Sprite(42,35,selectorImage,{x:canvas.width/2 - 200,y:canvas.height/2 - 90,});
const character = new Player(
    75,65,characterImgRight,
    {right:characterImgRight,
    left:characterImgLeft,
    touchedLeft: characterImgLeftDamage,
    touchedRight: characterImgRightDamage}
);
const swordAttach = new Sword(
    70,54,attackRightImg,
    {right:attackRightImg,
        left:attackLeftImg
    },5
);
character.weapons.push(swordAttach);

const damageBuff = new DamagesBuff('Лира',damagesBuffImage); 
const rangeBuff = new RangeBuff('Скрипка',rangeBuffImage);
const cooldownBuff = new CoolDownBuff('Окарина',coolDownBuffImage);
const armorBuff = new ArmorBuff('Флейта',armorBuffImage);
const speedBuff = new SpeedBuff('Рог',speedBuffImage);
const healthBuff = new HealthBuff('Сердце', healthBuffImage);

//skills
let skillSelection = "";
let choiceList = [];
const skills = [healthBuff,damageBuff,rangeBuff,cooldownBuff,armorBuff,speedBuff];

const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
};

//timer varibes
let seconds = 0;
let minutes = 0;
let secondsToWrite;
let minutesToWrite;
let intervalTimer;

//other varibes
let enemies = {};
let loots = {};
let game = {
    active : false,
    over : false,
    lvlUpScreen : false,
    victory:false,
};

//functions
function toggleScreen(id,toggle){
    let element = document.getElementById(id);
    let display = (toggle) ? 'flex' : 'none';
    element.style.display = display;
}

function startGame(){
    toggleScreen('start', false);
    toggleScreen('canvas', true);
    ctx = canvas.getContext('2d');
    game.active = true;
    game.over = false;
    game.lvlUpScreen = false;
    addTimer();
    animate();
    generateEnemys();
}
function endGame(){
    let bodyElem = document.querySelector('body')
    if(game.victory){
        bodyElem.style.backgroundColor = '#48C2F9';
        toggleScreen('win',true);
    }else{
        bodyElem.style.backgroundColor = 'red';
        toggleScreen('lose',true)
    }
    enemies = {};
    loots = {};
    ctx = null;
    game.active = false;
    background.position = {x:-2560,y:-2026};
    toggleScreen('canvas',false);
}
function reStart(){
    let bodyElem = document.querySelector('body');
    bodyElem.style.backgroundColor = 'white';
    ctx = canvas.getContext('2d');
    toggleScreen('win',false);
    toggleScreen('lose',false);
    toggleScreen('canvas',true);
    character.reset();
    game.victory = false;
    game.active = true;
    clearTimeout(intervalTimer);
    seconds = 0;
    minutes = 0;
    animate();
    addTimer();
    generateEnemys();
}
function tick(){
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if(minutes === 5){
        game.victory = true;
        endGame();
    }
}
function addTimer(){
    tick();
    secondsToWrite = (seconds<10) ? `0${seconds}` : `${seconds}`;
    minutesToWrite = (minutes<10) ? `0${minutes}` : `${minutes}`;
    timer();
}
function timer() {
    intervalTimer = setTimeout(addTimer, 1000);
}
function drawTimer(){
    ctx.font = '42px Gothic';
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`${minutesToWrite}:${secondsToWrite}`, 1200, 200);
}
function drawStats(){
    ctx.fillText(`${character.stats.pv} / ${character.stats.pvMax}`, 1200, 50);
    ctx.fillText(`${character.stats.xp} / ${character.stats.xpMax}`, 1200, 100);
    ctx.fillText(`Lv : ${character.stats.lvl}`, 1200, 150);
}
function generateItems(deadBody){
    let idGenerator = Math.floor(Math.random() * 1000);
    let option = Math.floor(Math.random() * 11);
    switch (option){
        case 1:
            loots[`hp${idGenerator}`] = new Item(32,32,hpImage,{x:deadBody.position.x, y:deadBody.position.y},'heal');
        break;
        default:
            loots[`xp${idGenerator}`] = new Item(32,32,xpImage,{x:deadBody.position.x, y:deadBody.position.y});

    }
}
function generateEnemys() {
    let counter = 1;
    let intervalEnemyId = setInterval(() => {
        let options = Math.floor(Math.random() * 4);
        let randomPositionX = Math.floor(Math.random() * canvas.width);
        let randomPositionY = Math.floor(Math.random() * canvas.height);
        switch (options) {
            case 2:
                if(minutes<1){
                    enemies[`FlightEye${counter}`] = new Enemy(120,60,FlightEyeImage,{x:randomPositionX, y:0},10,1);
                }
                if(minutes>=1){
                    randomPositionY = Math.floor(Math.random() * canvas.height);
                    enemies[`Goblin${counter}`] = new Enemy(150,65,GoblinImage,{x:canvas.width, y:randomPositionY},15,2);
                    if(minutes>=2){
                        enemies[`Mushroom${counter}`] = new Enemy(150,67,MushroomImage,{x:canvas.width, y:randomPositionY},20,3);
                        if(minutes>=3){
                            randomPositionY = Math.floor(Math.random() * canvas.height);
                            enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:canvas.width, y:randomPositionY},25,3)
                            if(minutes>=4){
                                randomPositionY = Math.floor(Math.random() * canvas.height);
                                enemies[`red${counter}`] = new Enemy(48,84,redImage,{x:canvas.width, y:randomPositionY},30,4);
                            }
                        }
                    }
                }
                break;
            case 3:
                if(minutes<1){
                    enemies[`miniOrc${counter}`] = new Enemy(32,56,miniOrcImage,{x:randomPositionX, y:canvas.height},10,1);
                }
                if(minutes>=1){
                    randomPositionX = Math.floor(Math.random() * canvas.width);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:randomPositionX, y:canvas.height},15,1);
                    if(minutes>=2){
                        randomPositionY = Math.floor(Math.random() * canvas.height);
                        enemies[`miniOrc${counter}`] = new Enemy(32,56,miniOrcImage,{x:canvas.width, y:randomPositionY},10,1);
                    }
                }
                break;
            default:
                if(minutes<1){
                    enemies[`miniOrc${counter}`] = new Enemy(32,56,miniOrcImage,{x:randomPositionX, y:0},10,1);
                }
                if(minutes>=1){
                    randomPositionX = Math.floor(Math.random() * canvas.width);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:randomPositionX, y:0},15,2);
                    if(minutes>=3){
                        randomPositionX = Math.floor(Math.random() * canvas.width);
                        enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:randomPositionX, y:0},25,3);
                        if(minutes>=4){
                            randomPositionX = Math.floor(Math.random() * canvas.width);
                            enemies[`Mushroom${counter}`] = new Enemy(150,67,MushroomImage,{x:randomPositionX, y:0},20,3);
                        }
                    }
                }   
                break;
        }
        counter ++;
        if(!game.active){clearInterval(intervalEnemyId);}
    }, 3500);
}
function checkAttackOnEnemy(enemies,attack){
    if(attack.animation){
        for (enemy in enemies){
            if(enemies[enemy].position.x >= attack.position.x && enemies[enemy].position.x <= attack.position.x + attack.width){
                if(enemies[enemy].position.y + enemies[enemy].height >= attack.position.y && enemies[enemy].position.y <= attack.position.y){    
                    enemies[enemy].pv -= attack.damage;
                    if (enemies[enemy].pv <= 0 ){
                        generateItems(enemies[enemy]);
                        delete enemies[enemy];
                    }else{
                        enemies[enemy].getPushed(character.direction,'up')
                    }
                }else if(enemies[enemy].position.y <= attack.position.y + attack.height && enemies[enemy].position.y >= attack.position.y){
                        enemies[enemy].pv -= attack.damage;
                        if (enemies[enemy].pv <= 0 ){
                        generateItems(enemies[enemy]);
                        delete enemies[enemy];
                    }else{
                        enemies[enemy].getPushed(character.direction,'down');
                    }
                }
            }
        }
    }
}
function checkCollisionOnPlayer(enemy, player, collisionDistance) {
    const enemyX = enemy.position.x + enemy.width / 2;
    const enemyY = enemy.position.y + enemy.height / 2;
    const playerX = player.position.x + player.width / 2;
    const playerY = player.position.y + player.height / 2;
    const distance = Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2));

    if (distance <= collisionDistance) {
        player.touched = true;
        player.stats.pv -= enemy.strenght - (enemy.strenght * player.stats.armor / 100);
        if (player.stats.pv <= 0){
            endGame();
        }
    } else {
        player.touched = false;
    }
}
function checkCollisionWithItems(items, player, pickupRadius) {
    for (let item in items) {
        const itemX = items[item].position.x + items[item].width / 2;
        const itemY = items[item].position.y + items[item].height / 2;
        const playerX = player.position.x + player.width / 2;
        const playerY = player.position.y + player.height / 2;
        const distance = Math.sqrt(Math.pow(itemX - playerX, 2) + Math.pow(itemY - playerY, 2));

        if (distance <= pickupRadius) {
            if (items[item].type === 'heal') {
                items[item].heal(player);
                delete items[item];
            } else {
                let isLvlUp = items[item].pex(player);
                if (isLvlUp) {
                    skillSelection = "";
                    lvlUp();
                }
                delete items[item];
            }
        }
    }
}
function lvlUp() {
    if(skillSelection){
        game.lvlUpScreen = false;
        game.active = true;
        skillSelection.applyBuff(character);
        choiceList = [];
        skillSelection = "";
        addTimer();
        generateEnemys();
        animate();
    }else{
        clearInterval(intervalTimer);
        character.stats.pv += character.stats.pvMax * 25/100;
        if(character.stats.pv > character.stats.pvMax){
            character.stats.pv = character.stats.pvMax;
        }
        if(character.skills.length <= 3){
            let randomIndex1 = Math.floor(Math.random()*skills.length);
            let randomIndex2 = Math.floor(Math.random()*skills.length);
            if (randomIndex1 === randomIndex2){
                randomIndex2 = (randomIndex2 === skills.length -1) ? randomIndex2-1 : randomIndex2+1
            }
            choiceList.push(skills[randomIndex1],skills[randomIndex2]);
        }else{
            let randomIndex1 = Math.floor(Math.random()*character.skills.length);
            let randomIndex2 = Math.floor(Math.random()*character.skills.length);
            if (randomIndex1 === randomIndex2){
                randomIndex2 = (randomIndex2 === character.skills.length -1) ? randomIndex2-1 : randomIndex2+1;
            }
            choiceList.push(character.skills[randomIndex1],character.skills[randomIndex2])
        }
        game.active = false;
        game.lvlUpScreen = true;
        drawLvlUpScreen()
    }
}
function drawLvlUpScreen(){
    if(!game.lvlUpScreen) return
    window.requestAnimationFrame(drawLvlUpScreen)
    const firstOption = choiceList[0];
    const secondOption = choiceList[1];
    ctx.fillStyle = "#48C2F9";
    ctx.fillRect((canvas.width/2 - 200), (canvas.height/2 - 225), 400, 450);
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "#FFCE00";
    ctx.rect((canvas.width/2 - 200), (canvas.height/2 - 225), 400, 450);
    ctx.stroke();

    ctx.font = '32px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Level up !!`, canvas.width/2, (canvas.height/2 - 190));

    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "#FFCE00";
    ctx.rect((canvas.width/2 - 175), (canvas.height/2 - 155), 350, 150);
    ctx.stroke();
    ctx.rect((canvas.width/2 - 175), (canvas.height/2 + 5 ), 350, 150);
    ctx.stroke();

    selector.draw()
    //first skill
    ctx.drawImage(firstOption.image,(canvas.width/2 - 162),(canvas.height/2 - 142),32,35)
    ctx.font = '20px Gothic';
    ctx.fillStyle = "#FFCE00";
    ctx.textAlign = "start";
    ctx.fillText(`${firstOption.name}`, (canvas.width/2 - 120), (canvas.height/2 - 116));    
    ctx.font = '18px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(`${firstOption.description}`, (canvas.width/2 - 162), (canvas.height/2 - 80));
    //second skill
    ctx.drawImage(secondOption.image,(canvas.width/2 - 162),(canvas.height/2 + 18),32,35)
    ctx.font = '20px Gothic';
    ctx.fillStyle = "#FFCE00";
    ctx.textAlign = "start";
    ctx.fillText(`${secondOption.name}`, (canvas.width/2 - 120), (canvas.height/2 + 44));     
    ctx.font = '18px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(`${secondOption.description}`, (canvas.width/2 - 162), (canvas.height/2 + 80)); 
}
function animate(){
    if(!game.active) return;
    let currentFrame = window.requestAnimationFrame(animate); //улучшение производительности кадров
    background.draw();
    drawStats();
    drawTimer();

    //Character
    character.move();
    character.moving = false;
    if(keys.up){
        background.position.y += (4 * character.speed);
        character.moving = true;
    }
    if(keys.right){
        background.position.x -= (4 * character.speed);
        character.moving = true;
        character.direction = 'right';
    }   
    if(keys.down){
        background.position.y -= (4 * character.speed);
        character.moving = true;
    }
    if(keys.left){
        background.position.x += (4 * character.speed);
        character.moving = true;
        character.direction = 'left';
    }

    //Attacks
    if(currentFrame % swordAttach.frame === 0){;
        swordAttach.animation = true;
        swordAttach.animationStart = currentFrame;
    }
    if (currentFrame === swordAttach.animationStart + 15){
        swordAttach.animation = false;
    }
    swordAttach.attack();
    checkAttackOnEnemy(enemies,swordAttach);

    //Enemys
    for (const enemy in enemies){
        if(!game.active){break}
        enemies[enemy].draw();
        enemies[enemy].move();
        if(keys.up){
            enemies[enemy].position.y += (2 * character.speed);
        }
        if(keys.right){
            enemies[enemy].position.x -= (2 * character.speed);
        }
        if(keys.down){
            enemies[enemy].position.y -= (2 * character.speed);
        }
        if(keys.left){
            enemies[enemy].position.x += (2 * character.speed);
        }
        checkCollisionOnPlayer(enemies[enemy],character,30);
    }

    //Items
    for (const item in loots){
        loots[item].draw()
        if(keys.up){
            loots[item].position.y += (2 * character.speed);
        }
        if(keys.right){
            loots[item].position.x -= (2 * character.speed);
        }
        if(keys.down){
            loots[item].position.y -= (2 * character.speed);
        }
        if(keys.left){
            loots[item].position.x += (2 * character.speed);
        }
    }
    checkCollisionWithItems(loots,character,50);
}

window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = true
            if(game.lvlUpScreen){
                skillSelection = choiceList[0];
                selector.position.y = canvas.height/2 - 90;
            };
            break;
        case "a":
            keys.left = true;
            break;   
        case "d":
            keys.right = true;
            break;   
        case "s":
            keys.down = true;
            if(game.lvlUpScreen){
                skillSelection = choiceList[1];
                selector.position.y = canvas.height/2 + 70;
            };
            break;   
        case 'p':
            game.active = false; 
            break
        case "Enter":
            if(game.lvlUpScreen){
                lvlUp();
            };   
    };
});

window.addEventListener('keyup', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = false;
            break;
        case "a":
            keys.left = false;
            break;   
        case "d":
            keys.right = false;
            break;   
        case "s":
            keys.down = false;
            break;    
        case 'p':
            game.active = true;
            generateEnemys();
            animate();
            break      
    }
})