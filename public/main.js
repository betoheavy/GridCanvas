let GC;
let left = false;
window.onload = main;

const sfxList = {
	floppa_miau: './sfx/floppa/miau.ogg'
}

var sfxGame;


function main() {
    GC = new GridCanvas('mainCanvas');
		sfxGame = new SFX(sfxList);
    const IL = new ImageLoader();

    GC.onClick(getCoords);

    IL.addImageURL("img/base.svg");
    IL.addImageURL("img/block.svg");
    IL.addImageURL("img/floppa.png");
    IL.addImageURL("img/trasparent.png");
    
    IL.onLoad(imageArray =>{
        GC.images = imageArray;
        GC.start(customDraw);
    });

    //window.addEventListener('keypress', logKey, true);
    window.addEventListener('keydown', logKey, true);

    function logKey(e) {
        //console.log(` ${e.code}`);
        if (e.code == 'KeyD'){
            GC.moveCamera(-1,0);
            left = false;
        }
        if (e.code == 'KeyA'){
            GC.moveCamera(1,0);
            left = true;
        }
        if (e.code == 'KeyW'){
            GC.moveCamera(0,1);
        }
        if (e.code == 'KeyS'){
            GC.moveCamera(0,-1);
        }
				if(e.code == 'KeyG'){
					sfxGame.play('floppa_miau')
				}
    }

}
  
function customDraw(ctx, img) {
    img[2].flipX = left;
    let customGrid = [[3]];

    let customGrid2 = [];

    for (let x = 0; x < 18; x++){
        let col = [];
        for (let y = 0; y < 18; y++){
            if (y == 0 || y == 17 || x == 0 || x== 17) col.push(2);
            else col.push(1);
        }
        customGrid2.push(col);
    }

    ctx.drawGrid(customGrid2);
    ctx.drawStaticGrid(customGrid);

}

function getCoords(evt){
    let minDistanceSquared = Math.sqrt(window.innerWidth * window.innerHeight);

    const x = (evt.x -  window.innerWidth/2)/((minDistanceSquared/2)/9);
    const y = (evt.y - window.innerHeight/2)/((minDistanceSquared/2)/9);

    console.log(x.toFixed(2),y.toFixed(2));
}