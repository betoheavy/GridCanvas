// GridCanvas se encarga de dibujar y SFXPlayer de cargar los sonidos
const GC    = new GridCanvas('mainCanvas',{debug:true});
const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

//los objetos se manejan en layers
let background  = new GridLayer();
let objects     = new GridLayer();
let player      = new GridLayer();

// en los layers se pueden colocar GameObject, que tienen propiedades del juego (colisiones vida, posicion, etc..)
let base = new Entity(['img/base.svg'], {});
let bloc = new Entity(['img/block.svg'], {collision:new Collision("circle")});
let fire = new Entity(['img/trasparent.png'], {grid:objects, position: new Position(0,-1)});
let swrd = new Entity(['img/sword.png'], {grid:objects, position: new Position(2,3)});

// "flop" sera un gameObject mas complejo, con varios sprites (algunos animados)
let sptFront    = new Sprite('img/floppa/front.svg');
let sptFrontMv  = new Sprite(['img/floppa/front_1.svg', 'img/floppa/front_2.svg'],{ticks:15});
let sptLeft     = new Sprite('img/floppa/left.svg');
let sptLeftMv   = new Sprite(['img/floppa/left_1.svg','img/floppa/left_2.svg'],{ticks:15});
let sptBack     = new Sprite('img/floppa/back.svg');
let sptBackMv   = new Sprite(['img/floppa/back_1.svg','img/floppa/back_2.svg'],{ticks:15});

//pasamos nuestros sprites a un objeto para despues ponerlo en el constructor de "flop" (GameObject)
let flopSprites = {
    front:      sptFront,
    frontMove : sptFrontMv,
    left:       sptLeft,
    leftMove:   sptLeftMv,
    back:       sptBack,
    backMove:   sptBackMv,
}

//"flop" tendra todos los sprites anteriores, y ademas se le paso la opcion que inicie en "front"
let flop = new Entity(flopSprites, {collision:new Collision("circle"), index:"front"});

// un objeto Control para ejecutar la funcion "move" mas abajo
let controles = new Control(move, stopMove, null);
 
//los layers necesitan una matriz para colocar objetos
let customGrid = [];
for (let x = 0; x < 18; x++){
    let col = [];
    for (let y = 0; y < 18; y++){
        if (y == 0 || y == 17 || x == 0 || x== 17) col.push(base.clone());
        else col.push(base.clone());
    }
    customGrid.push(col);
}
//customGrid[2][2] = bloc.clone();
//customGrid[2][3] = bloc.clone();
customGrid[7][8] = bloc.clone();

background.grid(customGrid);
player.grid([[flop]]);

//si los objetos tienen un layer asignado, ellos puede colocarse ellos mismos (como el layer "objects")
GC.addGrid(background);
GC.addGrid(objects);
GC.addGrid(player);

// focus permite tener un layer que no se mueva al mover la camara
GC.focus = player;

GC.start(ctx =>{
    controles.triggerInput();
});

//controla el teclado
function move(dp, controls){
    let vel = 1/8;
    
    if(dp[controls.right]){
        GC.moveAllLayers(-vel,0);
        flop.index = "leftMove";
        flop.sprite.flipX = true;
    }
    if(dp[controls.left]) {
        GC.moveAllLayers(vel,0);
        flop.index = "leftMove";
        flop.sprite.flipX = false;
    }
    if(dp[controls.up]){
        GC.moveAllLayers(0,-vel);
        flop.index = "backMove";
    }
    if(dp[controls.down] ) {
        GC.moveAllLayers(0,vel)
        flop.index = "frontMove";
    }
    if(dp[controls.miau]) {SFX.play('floppa_miau')}
    if(dp[controls.click]){SFX.play('puaj')}
}

function stopMove(dp, controls){
    if (flop.index == "frontMove"){
        flop.index = "front";
    }
    if (flop.index == "leftMove"){
        let currentFlipX = flop.sprite.flipX;
        flop.index = "left";
        flop.sprite.flipX = currentFlipX;
    }
    if (flop.index == "backMove"){
        flop.index = "back";
    }
        
}