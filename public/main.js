// GridCanvas se encarga de dibujar y SFXPlayer de cargar los sonidos
const GC    = new GridCanvas('mainCanvas');
const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

//los objetos se manejan en layers
let background  = new GridLayer();
let objects     = new GridLayer();
let player      = new GridLayer();

// en los layers se pueden colocar GameObject, que tienen propiedades del juego (colisiones vida, posicion, etc..)
let base = new GameObject(['img/base.svg'], {});
let bloc = new GameObject(['img/block.svg'], {collide:true});
let flop = new GameObject(['img/floppa.png'], {collide:true});
let fire = new GameObject(['img/trasparent.png'], {grid:objects});
let swrd = new GameObject(['img/sword.png'], {grid:objects});

// un objeto Control para ejecutar la funcion "move" mas abajo
let controles   = new Control(move, null, null);
 
//los layers necesitan una matriz para colocar objetos
let customGrid = [];
for (let x = 0; x < 18; x++){
    let col = [];
    for (let y = 0; y < 18; y++){
        if (y == 0 || y == 17 || x == 0 || x== 17) col.push(bloc);
        else col.push(base);
    }
    customGrid.push(col);
}
customGrid[2][2] = bloc;
customGrid[2][3] = bloc;
customGrid[3][2] = bloc;

background.grid = customGrid;
player.grid     = [[flop]];

//si los objetos tienen un layer asignado, ellos puede colocarse ellos mismos (como el layer "objects")
GC.addGrid(background);
GC.addGrid(objects);
GC.addGrid(player);

// focus permite tener un layer que no se mueva al mover la camara
GC.focus = player;

//esta variable a ocupamos para cambiar de orientacion el Sprite de "flop" segun los controles en "move()"
let left = false;

GC.start(ctx =>{
    flop.sprite.flipX = left;
    controles.triggerInput();
});

//controla el teclado
function move(dp, controls){
    let vel = 1/8;
    
    if( dp[controls.right] ){GC.moveCamera(-vel,0);left = false;}
    if( dp[controls.left] ) {GC.moveCamera(vel,0); left = true;}
    if( dp[controls.up] )   {GC.moveCamera(0,vel)}
    if( dp[controls.down] ) {GC.moveCamera(0,-vel)}
    if( dp[controls.miau] ) {SFX.play('floppa_miau')}
    if( dp[controls.click] ){SFX.play('puaj')}
}