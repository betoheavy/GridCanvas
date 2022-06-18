// GridCanvas se encarga de dibujar y SFXPlayer de cargar los sonidos
const GC    = new GridCanvas('mainCanvas',{backgroundColor:"Lavender",gridSquared:18});
const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

//los objetos se manejan en layers
let test  = new GridLayer();

// en los layers se pueden colocar GameObject, que tienen propiedades del juego (colisiones vida, posicion, etc..)
let X = new Entity(['img/isometric/green.svg'], {});
let _ = new Entity(['img/isometric/brown.svg'], {});
let O = new Entity(['img/isometric/dither.svg'], {});

// un objeto Control para ejecutar la funcion "move" mas abajo
let controles = new Control(move, stopMove, null);
 
//los layers necesitan una matriz para colocar objetos
let customGrid = [
    [_,_,X,X,_,X,_,X,_,X,_,X,_,X,X,_,_,_,X,_,_,X,_,_,_,_,X,_,_],
    [_,X,_,_,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,_,_,X,_,X,_],
    [_,X,_,_,_,X,X,X,_,X,_,X,_,X,X,_,_,X,X,X,_,X,_,_,_,X,_,X,_],
    [_,X,_,_,_,X,_,X,_,X,_,X,_,X,_,_,_,X,_,X,_,X,_,_,_,X,_,X,_],
    [_,_,X,X,_,X,_,X,_,X,X,X,_,X,_,_,_,X,_,X,_,X,X,X,_,_,X,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,X,X,_,_,X,_,X,X,X,_,X,X,X,_,_,X,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,X,_,X,_,X,_,X,_,_,_,X,_,_,_,X,_,X,_,_,_,_,_,_,_,_],
    [_,_,_,_,X,_,X,_,X,_,X,X,X,_,X,_,X,_,X,_,X,_,_,_,_,_,_,_,_],
    [_,_,_,_,X,_,X,_,X,_,X,_,_,_,X,_,X,_,X,_,X,_,_,_,_,_,_,_,_],
    [_,_,_,_,X,X,_,_,X,_,X,X,X,_,X,X,X,_,_,X,_,_,_,_,_,_,_,_,_],
]

//los layers necesitan una matriz para colocar objetos
/*customGrid = [
    [br,gr,gr,br,br],
]*/

test.isometric(customGrid,true);

//si los objetos tienen un layer asignado, ellos puede colocarse ellos mismos (como el layer "objects")
GC.addGrid(test);

GC.start(ctx =>{
    controles.triggerInput();
});

//controla el teclado
function move(dp, controls){
    let vel = 1/8;
    
    if(dp[controls.right]){
        GC.moveCamera(-vel,0);
        flop.index = "leftMove";
        flop.sprite.flipX = true;
    }
    if(dp[controls.left]) {
        GC.moveCamera(vel,0);
        flop.index = "leftMove";
        flop.sprite.flipX= false;
    }
    if(dp[controls.up]){
        GC.moveCamera(0,vel);
        flop.index = "backMove";
    }
    if(dp[controls.down] ) {
        GC.moveCamera(0,-vel)
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