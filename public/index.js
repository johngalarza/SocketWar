import { Application, Container, Sprite, Assets } from "./libs/pixi.mjs";
const socket = io();

const app = new Application();
const container = new Container();
let player;
let enemys = {};
let myId;

async function main(){
    await render2D();
    controllers();
    sendStatus();
}

async function render2D(){
    await renderScenery();
    await renderPlayer();
}

async function renderScenery() {
    await app.init({ background: '#bbb', resizeTo: window });
    document.body.appendChild(app.canvas);
    app.stage.addChild(container);
}

async function renderPlayer(){
    const texture = await Assets.load('./assets/tank.png');
    player = new Sprite({
        texture: texture,
        anchor: 0.5,
        x: app.screen.width/2,
        y: app.screen.height/2
    });
    container.addChild(player);
}

function controllers(){
    document.addEventListener('keydown', (e)=>{
        if(e.key==='w'){
            player.y -= 5;
            player.rotation = 0;
        }
        if(e.key==='d'){
            player.x += 5;
            player.rotation = Math.PI / 2;
        }
        if(e.key==='s'){
            player.y += 5;
            player.rotation = Math.PI;
        }
        if(e.key==='a'){
            player.x -= 5;
            player.rotation = Math.PI + Math.PI /2;
        }
        sendStatus()
    })
}

function sendStatus(){
    socket.emit('move', {
        x: player.x,
        y: player.y,
        rotation: player.rotation
    })
}

socket.on('connect', async () => {
    myId = socket.id;
});

socket.on('currentPlayers', async (players)=>{
    console.log(players)
    for(let id in players){
        if(id !== myId){
            const texture = await Assets.load('./assets/tank.png');
            enemys[id] = new Sprite({
                texture: texture,
                anchor: 0.5,
                x: app.screen.width/2,
                y: app.screen.height/2,
                tint: 0xff6666
            });
            container.addChild(enemys[id]);
        }
    }
});

socket.on('newPlayer', async (data) => {
    const texture = await Assets.load('./assets/tank.png');
    enemys[data.id] = new Sprite({
        texture,
        anchor: 0.5,
        x: data.x,
        y: data.y,
        rotation: data.rotation,
        tint: 0xff6666
    });
    container.addChild(enemys[data.id]);
    console.log('Nuevo jugador conectado:', data.id);
});

socket.on('enemyMoved', async (data)=>{
    const { id, x, y, rotation } = data;
    if(enemys[id]){
        enemys[id].x = x;
        enemys[id].y = y;
        enemys[id].rotation = rotation;
    }
});

socket.on('enemyDisconnect', (id)=>{
    container.removeChild(enemys[id]);
    enemys[id].destroy;
    delete enemys[id];
});

main();
