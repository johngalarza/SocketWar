import { Application, Container, Sprite, Assets } from "./libs/pixi.mjs";

const app = new Application();
const container = new Container();
let player;

async function main(){
    await render2D();
    controllers();
}

async function render2D(){
    await renderScenery();
    await renderPlayer();
}

async function renderScenery() {
    await app.init({ background: '#ccc', resizeTo: window });
    document.body.appendChild(app.canvas);
    app.stage.addChild(container);
}

async function renderPlayer(){
    const texture = await Assets.load('./assets/tank.png');
    player = new Sprite(texture);
    player.x = 0;
    player.y = 0;
    container.addChild(player)
}

function controllers(){
    document.addEventListener('keydown', (e)=>{
        if(e.key==='w'){
            player.y -= 5;
            player.rotation = 2
        }
        if(e.key==='d'){
            player.x += 5;
        }
        if(e.key==='s'){
            player.y += 5;
        }
        if(e.key==='a'){
            player.x -= 5;
        }
    })
}



main();